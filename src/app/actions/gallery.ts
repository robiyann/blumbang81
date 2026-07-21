"use server";

import { db } from "@/lib/db";
import { galleryImages, galleryAlbums } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { r2Client, R2_BUCKET_NAME, getR2PublicUrl } from "@/lib/r2/client";
import { PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { checkSession } from "@/lib/auth/session";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit

/** Strip any character that's not a letter, digit, space, or dash */
function sanitizeName(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9\s\-']/g, "").slice(0, 80).trim();
}

export async function uploadPublicImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const albumId = formData.get("albumId") as string;
    const rawName = (formData.get("contributorName") as string) || "Warga";
    // [SEC] Sanitize contributor name — strip script/html-unsafe chars
    const contributorName = sanitizeName(rawName) || "Warga";

    if (!file || file.size === 0) {
      return { success: false, error: "File foto tidak ditemukan." };
    }

    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: "Ukuran file foto melebihi batas maksimal 5MB." };
    }

    // [SEC] Validate albumId is a proper UUID and actually exists in DB
    if (!albumId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(albumId)) {
      return { success: false, error: "Album tidak valid." };
    }
    const [existingAlbum] = await db
      .select({ id: galleryAlbums.id })
      .from(galleryAlbums)
      .where(eq(galleryAlbums.id, albumId))
      .limit(1);
    if (!existingAlbum) {
      return { success: false, error: "Album tidak ditemukan." };
    }

    // 1. Convert file into Buffer
    const fileBytes = await file.arrayBuffer();
    const buffer = Buffer.from(fileBytes);

    // 2. Load Sharp and metadata
    const sharpImg = sharp(buffer);
    const metadata = await sharpImg.metadata();

    // 3. Optimize & Convert to WebP
    const processedBuffer = await sharpImg
      .resize({ width: 1200, height: 1200, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();

    const width = metadata.width || 800;
    const height = metadata.height || 600;
    const r2Key = `public_uploads/${Date.now()}-${randomUUID()}.webp`;
    const filename = `upload-${Date.now()}.webp`; // sanitize filename — ignore original

    // 4. Upload to Cloudflare R2
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      Body: processedBuffer,
      ContentType: "image/webp",
    });

    await r2Client.send(uploadCommand);

    // 5. Insert database record (isApproved = false)
    await db.insert(galleryImages).values({
      albumId,
      r2Key,
      filename,
      altText: `Kontributor: ${contributorName}`,
      width,
      height,
      sizeBytes: processedBuffer.length,
      isApproved: false,
    });

    return { success: true };
  } catch (error: any) {
    // [SEC] Never leak internal error details to client
    console.error("[gallery] Public upload failed:", error);
    return { success: false, error: "Gagal memproses foto. Pastikan file adalah gambar yang valid." };
  }
}

export async function approveImageAction(imageId: string) {
  // [SEC] Admin-only: require valid session
  const isAuth = await checkSession();
  if (!isAuth) return { success: false, error: "Unauthorized." };

  if (!imageId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(imageId)) {
    return { success: false, error: "Image ID tidak valid." };
  }

  try {
    const result = await db
      .update(galleryImages)
      .set({ isApproved: true })
      .where(eq(galleryImages.id, imageId));

    return { success: true };
  } catch (error: any) {
    console.error("[gallery] Approve failed:", error);
    return { success: false, error: "Gagal menyetujui foto." };
  }
}

export async function rejectImageAction(imageId: string) {
  // [SEC] Admin-only: require valid session
  const isAuth = await checkSession();
  if (!isAuth) return { success: false, error: "Unauthorized." };

  if (!imageId || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(imageId)) {
    return { success: false, error: "Image ID tidak valid." };
  }

  try {
    const [img] = await db
      .select({ id: galleryImages.id, r2Key: galleryImages.r2Key })
      .from(galleryImages)
      .where(eq(galleryImages.id, imageId))
      .limit(1);

    if (!img) {
      return { success: false, error: "Foto tidak ditemukan." };
    }

    // Delete from R2
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: img.r2Key,
      });
      await r2Client.send(deleteCommand);
    } catch (r2Err) {
      console.warn("[gallery] R2 deletion warning:", r2Err);
    }

    // Delete from DB
    await db.delete(galleryImages).where(eq(galleryImages.id, imageId));

    return { success: true };
  } catch (error: any) {
    console.error("[gallery] Reject failed:", error);
    return { success: false, error: "Gagal menghapus foto." };
  }
}

/**
 * Fetch all unapproved/pending gallery images for the admin dashboard.
 */
export async function getPendingImagesAction() {
  try {
    const rows = await db
      .select({
        image: galleryImages,
        albumTitle: galleryAlbums.title,
      })
      .from(galleryImages)
      .innerJoin(galleryAlbums, eq(galleryImages.albumId, galleryAlbums.id))
      .where(eq(galleryImages.isApproved, false));

    return rows.map((r) => ({
      id: r.image.id,
      albumTitle: r.albumTitle,
      url: getR2PublicUrl(r.image.r2Key) ?? `/api/gallery/image?key=${encodeURIComponent(r.image.r2Key)}`,
      altText: r.image.altText,
      uploadedAt: r.image.uploadedAt.toISOString(),
    }));
  } catch (error) {
    console.error("[gallery] Get pending failed:", error);
    return [];
  }
}

/**
 * Scan Cloudflare R2 bucket for any new folders/files added manually via Cloudflare dashboard,
 * and automatically index them into Neon DB.
 */
export async function syncR2BucketAction() {
  const isAuth = await checkSession();
  if (!isAuth) return { success: false, error: "Unauthorized." };

  try {
    // 1. Fetch existing albums and images in DB
    const existingAlbums = await db.select().from(galleryAlbums);
    const existingImages = await db.select({ r2Key: galleryImages.r2Key }).from(galleryImages);
    const albumMap = new Map<string, string>();
    for (const a of existingAlbums) {
      albumMap.set(a.slug, a.id);
      albumMap.set(a.slug.replace(/_/g, "-"), a.id);
      albumMap.set(a.slug.replace(/-/g, "_"), a.id);
    }
    const existingImageKeys = new Set(existingImages.map((i) => i.r2Key));

    // 2. Fetch all objects from Cloudflare R2 with pagination
    let continuationToken: string | undefined = undefined;
    let newImagesCount = 0;
    let newAlbumsCount = 0;

    do {
      const command: ListObjectsV2Command = new ListObjectsV2Command({
        Bucket: R2_BUCKET_NAME,
        ContinuationToken: continuationToken,
      });

      const response = await r2Client.send(command);
      continuationToken = response.IsTruncated ? response.NextContinuationToken : undefined;

      const objects = response.Contents || [];

      for (const obj of objects) {
        if (!obj.Key || obj.Key.endsWith("/")) continue;

        // Extract folder prefix (e.g. "jalan_sehat_2025/photo1.webp" -> folder "jalan_sehat_2025")
        const parts = obj.Key.split("/");
        if (parts.length < 2) continue; // Skip root files if any

        const folderSlug = parts[0];
        if (folderSlug === "public_uploads") continue; // Skip public uploads folder during bulk sync

        // Check if album exists, or create it
        let albumId = albumMap.get(folderSlug);
        if (!albumId) {
          const humanTitle = folderSlug
            .replace(/[-_]/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

          const [newAlbum] = await db
            .insert(galleryAlbums)
            .values({
              slug: folderSlug,
              title: humanTitle,
              description: `Dokumentasi kegiatan ${humanTitle}`,
              coverKey: obj.Key,
            })
            .returning({ id: galleryAlbums.id });

          albumId = newAlbum.id;
          albumMap.set(folderSlug, albumId);
          albumMap.set(folderSlug.replace(/_/g, "-"), albumId);
          newAlbumsCount++;
        }

        // Check if image key already indexed
        if (!existingImageKeys.has(obj.Key)) {
          const filename = parts[parts.length - 1];
          await db.insert(galleryImages).values({
            albumId,
            r2Key: obj.Key,
            filename,
            altText: filename.replace(/\.[^/.]+$/, ""),
            width: 800,
            height: 600,
            sizeBytes: obj.Size || 0,
            isApproved: true, // Manual R2 bucket additions default to approved
          });

          existingImageKeys.add(obj.Key);
          newImagesCount++;
        }
      }
    } while (continuationToken);

    revalidatePath("/dokumentasi");
    revalidatePath("/");

    return {
      success: true,
      message: `Berhasil sinkronisasi R2! ${newImagesCount} foto baru dan ${newAlbumsCount} album baru berhasil terdaftar di database.`,
      newImagesCount,
      newAlbumsCount,
    };
  } catch (error: any) {
    console.error("[gallery] R2 sync failed:", error);
    return { success: false, error: "Gagal memindai bucket Cloudflare R2." };
  }
}
