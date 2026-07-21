// src/lib/r2/client.ts
import { S3Client } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID ?? "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID ?? "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY ?? "";

/**
 * AWS S3-compatible client configured for Cloudflare R2.
 * R2 uses the S3 API but with a Cloudflare-specific endpoint.
 */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_ACCOUNT_ID
    ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "https://placeholder.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || "placeholder",
    secretAccessKey: R2_SECRET_ACCESS_KEY || "placeholder",
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME ?? "hut-ri-81";
export const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL ?? "";

/**
 * Build a public URL for an R2 object.
 * Uses the custom domain if R2_PUBLIC_URL is set, otherwise returns null
 * (caller must use signed URL via the /api/gallery route).
 */
export function getR2PublicUrl(key: string): string | null {
  if (!R2_PUBLIC_URL) return null;
  return `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key}`;
}
