# WORKFLOW

Asisten produktivitas kerja pribadi. Monorepo **Turborepo + pnpm**.

| Folder | Isi |
|---|---|
| `apps/web` | Next.js 14 (App Router, Tailwind, Zustand, React Query). Di-build sebagai **situs statis** (`apps/web/out`) |
| `apps/api` | API Node (TypeScript, tanpa framework) + test Vitest |
| `packages/types` | Skema Zod + tipe bersama (`@workflow/types`) |
| `packages/config` | tsconfig & ESLint bersama (`@workflow/config`) |
| `packages/database` | Skema Prisma (Postgres) |
| `.github/workflows` | CI/CD: lint → typecheck → test → build → deploy |

> Status: kerangka yang sudah diuji build-nya (lint, typecheck, test, build lulus dengan pnpm 11.24.0 / Node 22).
> Fitur aplikasi masih dasar (daftar tugas). Tambahkan fitur Anda di atas struktur ini.

---

## 1. Upload ke GitHub (tanpa terminal)

1. Di GitHub: **New repository** → beri nama (mis. `workflow-repo`) → **Create** (kosong, tanpa README).
2. Ekstrak zip ini di komputer Anda.
3. Di halaman repo kosong, klik **uploading an existing file**.
4. Buka folder hasil ekstrak, **pilih semua isinya** (termasuk folder `.github`) lalu seret ke halaman GitHub. Tunggu sampai selesai, lalu **Commit changes** ke branch `main`.

**Jika folder `.github` tidak ikut ter-upload** (folder berawalan titik kadang tersembunyi): di repo klik **Add file → Create new file**, ketik nama
`.github/workflows/ci-deploy.yml`, lalu salin-tempel isi file itu dari zip, dan commit.

## 2. Pilih tujuan deploy: Netlify **atau** Vercel

GitHub Actions akan build semuanya, lalu mengirim hasilnya ke satu tujuan. Atur di repo: **Settings → Secrets and variables → Actions**.

### Opsi A — Netlify
1. Di Netlify: **Add new site → Deploy manually** (cukup buat site kosong), lalu catat **Site ID** (Site configuration → Site details).
2. Buat token: User settings → Applications → **Personal access tokens**.
3. Di GitHub, tab **Secrets**: tambahkan `NETLIFY_AUTH_TOKEN` dan `NETLIFY_SITE_ID`.
4. Di GitHub, tab **Variables**: tambahkan `DEPLOY_TARGET` = `netlify`.

### Opsi B — Vercel
1. Di Vercel: buat project **baru** (bukan project lama) lewat Add New → Project. Atur:
   **Framework Preset = Other**, **Build Command & Install Command dikosongkan**, **Root Directory dikosongkan**.
   Vercel hanya bertindak sebagai hosting file statis; build dikerjakan GitHub Actions.
2. Ambil `VERCEL_ORG_ID` dan `VERCEL_PROJECT_ID` dari **Project Settings → General**.
3. Buat token di Account Settings → **Tokens**.
4. Di GitHub, tab **Secrets**: tambahkan `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
5. Di GitHub, tab **Variables**: tambahkan `DEPLOY_TARGET` = `vercel`.

> Jika `DEPLOY_TARGET` tidak diisi, workflow tetap menjalankan lint/test/build tapi **tidak deploy**.
> Jangan hubungkan project yang sama ke Git integration Netlify/Vercel sekaligus, agar tidak terjadi deploy ganda.

## 3. Jalankan

Setiap push ke `main` memicu workflow (tab **Actions** untuk melihat progres). Pull request hanya menjalankan pemeriksaan, tanpa deploy.

---

## Pengembangan lokal

```bash
corepack enable            # memakai pnpm sesuai package.json
pnpm install
pnpm dev                   # web di :3000, API di :4000
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

Salin `.env.example` ke `.env` bila perlu. Isi `NEXT_PUBLIC_API_URL` agar web menampilkan status API
(di GitHub, atur sebagai **Variable** `NEXT_PUBLIC_API_URL`).

Database (opsional): `docker compose up -d` → `pnpm db:generate` → `pnpm db:migrate`.

## Catatan penting

- **Static export** (`output: 'export'` di `apps/web/next.config.mjs`) dipilih agar hasil build identik di Netlify dan Vercel.
  Konsekuensinya tidak ada SSR/route handler Next.js. Bila nanti butuh itu, hapus baris tersebut dan ubah langkah deploy.
- `apps/api` belum ikut di-deploy otomatis (hanya diuji). Untuk meng-host-nya, pakai layanan Node (Render, Fly.io, Railway, dsb.).
- Data tugas di web tersimpan di `localStorage` browser, belum tersambung ke API/database.
- Pin versi `netlify-cli` / `vercel` di workflow untuk produksi agar build reprodusibel.
- File `vercel.json` dan `netlify.toml` di root hanya dipakai bila Anda memilih deploy lewat Git integration (bukan GitHub Actions).
