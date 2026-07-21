# HUT Kemerdekaan RI ke-81 — Web App Rebuild

Rebuilt village website for Indonesian Independence Day 81 (Tahun 2026) for Blumbang RT 15, Desa Saren, Kec. Kalijambe, Kab. Sragen.

Re-architected from Google Stitch designs into a production-ready, highly-performant Next.js 15 App Router codebase.

---

## Fitur Unggulan

- **SSG & ISR (Incremental Static Regeneration):** Pages pre-rendered statically with background revalidation.
- **Google Sheets CMS Integration:** Real-time synchronization of schedule, committee, and announcements.
- **Drizzle ORM & Neon DB:** Safe transactional registration persistence with rate limiting and deduplication.
- **R2 Storage Gallery:** Photo gallery connected to Cloudflare R2 bucket.
- **A11y (Aksesibilitas):** Responsive layouts, semantic markup, focus tracking, and reduced-motion animation guards.

---

## Persyaratan Awal (Prerequisites)

- Node.js >= 18.x
- npm / pnpm / yarn

---

## Petunjuk Instalasi (Setup Guide)

### 1. Kloning dan Instalasi Dependensi
```bash
cd hut-ri-81
npm install
```

### 2. Konfigurasi Lingkungan (Environment Variables)
Salin berkas `.env.example` ke `.env.local` dan lengkapi datanya:
```bash
cp .env.example .env.local
```

### 3. Jalankan Server Pengembangan (Local Dev Server)
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) untuk mengakses halaman web.

### 4. Build Produksi (Production Build)
```bash
npm run build
npm run start
```
