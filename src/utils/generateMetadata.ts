// src/utils/generateMetadata.ts
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hut-ri-81.vercel.app";
const siteName = "HUT Kemerdekaan RI ke-81 — Blumbang RT 15";
const siteDescription =
  "Peringatan HUT Kemerdekaan Republik Indonesia ke-81 Tahun 2026. Blumbang RT 15, Desa Saren, Kec. Kalijambe, Kab. Sragen. Semangat Gotong Royong Lintas Generasi.";

interface GenerateMetadataOptions {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Generate consistent page metadata with Open Graph and Twitter Card support.
 */
export function generatePageMetadata({
  title,
  description = siteDescription,
  path = "",
  image,
  noIndex = false,
}: GenerateMetadataOptions): Metadata {
  const fullTitle = path === "" ? siteName : `${title} — ${siteName}`;
  const canonicalUrl = `${siteUrl}${path}`;
  const ogImage = image ?? `${siteUrl}/og-image.jpg`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "id_ID",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
