# Deployment

Alur: push ke `main` → job `verify` (install, lint, typecheck, test, build) → artefak `web-static`
→ job `deploy-netlify` **atau** `deploy-vercel` sesuai repo variable `DEPLOY_TARGET`.

Secrets/variables yang dibutuhkan ada di README bagian 2.

Pemecahan masalah umum:
- `ERR_PNPM_OUTDATED_LOCKFILE`: jalankan `pnpm install` lokal, commit `pnpm-lock.yaml`.
- Deploy Vercel gagal "build command": pastikan Framework Preset = Other dan Build/Install Command kosong.
- Job deploy dilewati: cek variable `DEPLOY_TARGET` (huruf kecil: `netlify` / `vercel`) dan bahwa event-nya bukan pull request.
