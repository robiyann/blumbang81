// src/types/gallery.ts

export interface GalleryAlbum {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  coverKey: string | null;
  coverUrl: string | null;
  category: string;
  imageCount: number;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  albumId: string;
  r2Key: string;
  url: string;
  blurDataUrl?: string;
  filename: string;
  altText: string;
  width: number;
  height: number;
  sizeBytes: number;
  takenAt: string | null;
  sortOrder: number;
  isApproved: boolean;
}

export interface GalleryPaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
