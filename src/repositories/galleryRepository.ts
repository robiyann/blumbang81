// src/repositories/galleryRepository.ts
import { db } from "@/lib/db";
import { galleryAlbums, galleryImages } from "@/lib/db/schema";
import { eq, and, desc, asc, sql, count } from "drizzle-orm";
import { getR2PublicUrl } from "@/lib/r2/client";
import type { GalleryAlbum, GalleryImage } from "@/types/gallery";

export const GALLERY_PAGE_SIZE = 12;

function resolveImageUrl(r2Key: string): string {
  return getR2PublicUrl(r2Key) ?? `/api/gallery/image?key=${encodeURIComponent(r2Key)}`;
}

/**
 * Get all published albums with approved image count and cover URL.
 */
export async function getGalleryAlbums(): Promise<GalleryAlbum[]> {
  if (!db) return [];

  const rows = await db
    .select({
      album: galleryAlbums,
      imageCount: count(galleryImages.id),
      firstImageKey: sql<string | null>`(
        SELECT r2_key FROM gallery_images 
        WHERE album_id = ${galleryAlbums.id} AND is_approved = true 
        ORDER BY sort_order ASC, uploaded_at ASC LIMIT 1
      )`,
    })
    .from(galleryAlbums)
    .leftJoin(
      galleryImages,
      and(eq(galleryAlbums.id, galleryImages.albumId), eq(galleryImages.isApproved, true))
    )
    .where(eq(galleryAlbums.isPublished, true))
    .groupBy(galleryAlbums.id)
    .orderBy(desc(galleryAlbums.createdAt));

  return rows.map((r) => {
    const activeCoverKey = r.album.coverKey || r.firstImageKey;
    return {
      id: r.album.id,
      slug: r.album.slug,
      title: r.album.title,
      description: r.album.description ?? null,
      coverKey: activeCoverKey ?? null,
      coverUrl: activeCoverKey ? resolveImageUrl(activeCoverKey) : null,
      category: r.album.category,
      imageCount: r.imageCount,
      createdAt: r.album.createdAt.toISOString(),
    };
  });
}

/**
 * Get 2 featured approved images for the homepage flashback section.
 */
export async function getFeaturedFlashbackImages(): Promise<string[]> {
  if (!db) return [];
  try {
    const rows = await db
      .select({ r2Key: galleryImages.r2Key })
      .from(galleryImages)
      .where(eq(galleryImages.isApproved, true))
      .orderBy(desc(galleryImages.uploadedAt))
      .limit(2);

    return rows.map((r) => resolveImageUrl(r.r2Key));
  } catch (e) {
    console.error("Error fetching flashback images:", e);
    return [];
  }
}

/**
 * Get paginated images for an album (approved only).
 */
export async function getAlbumImages(
  albumSlug: string,
  page = 1
): Promise<{ images: GalleryImage[]; total: number; album: GalleryAlbum | null }> {
  if (!db) return { images: [], total: 0, album: null };

  const [albumRow] = await db
    .select({ album: galleryAlbums, imageCount: count(galleryImages.id) })
    .from(galleryAlbums)
    .leftJoin(
      galleryImages,
      and(eq(galleryAlbums.id, galleryImages.albumId), eq(galleryImages.isApproved, true))
    )
    .where(eq(galleryAlbums.slug, albumSlug))
    .groupBy(galleryAlbums.id)
    .limit(1);

  if (!albumRow) return { images: [], total: 0, album: null };

  const offset = (page - 1) * GALLERY_PAGE_SIZE;
  const imageRows = await db
    .select()
    .from(galleryImages)
    .where(
      and(eq(galleryImages.albumId, albumRow.album.id), eq(galleryImages.isApproved, true))
    )
    .orderBy(asc(galleryImages.sortOrder), asc(galleryImages.uploadedAt))
    .limit(GALLERY_PAGE_SIZE)
    .offset(offset);

  const album: GalleryAlbum = {
    id: albumRow.album.id,
    slug: albumRow.album.slug,
    title: albumRow.album.title,
    description: albumRow.album.description ?? null,
    coverKey: albumRow.album.coverKey ?? null,
    coverUrl: albumRow.album.coverKey ? resolveImageUrl(albumRow.album.coverKey) : null,
    category: albumRow.album.category,
    imageCount: albumRow.imageCount,
    createdAt: albumRow.album.createdAt.toISOString(),
  };

  const images: GalleryImage[] = imageRows.map((img) => ({
    id: img.id,
    albumId: img.albumId,
    r2Key: img.r2Key,
    url: resolveImageUrl(img.r2Key),
    blurDataUrl: img.blurDataUrl ?? undefined,
    filename: img.filename,
    altText: img.altText,
    width: img.width,
    height: img.height,
    sizeBytes: img.sizeBytes,
    takenAt: img.takenAt?.toISOString() ?? null,
    sortOrder: img.sortOrder,
    isApproved: img.isApproved,
  }));

  return { images, total: albumRow.imageCount, album };
}
