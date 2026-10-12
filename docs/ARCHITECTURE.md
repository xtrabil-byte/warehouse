# Arsitektur

```
apps/web  ──imports──►  @workflow/types  ◄──imports──  apps/api
                              ▲
                  packages/config (tsconfig, eslint)

packages/database  — skema Prisma (belum dipakai api/web pada kerangka ini)
```

- Turbo menjalankan `build` paket dependensi lebih dulu (`dependsOn: ["^build"]`), jadi `@workflow/types` selalu ter-build sebelum web/api.
- `@workflow/types` adalah sumber kebenaran skema validasi (Zod): dipakai web (form) dan api (request body).
