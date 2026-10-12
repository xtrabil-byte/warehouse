/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export statis -> deploy identik di Netlify & Vercel, tanpa runtime server.
  // Hapus baris ini bila nanti butuh SSR / route handler Next.js.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // Lint dijalankan terpisah (pnpm lint), bukan saat next build.
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
