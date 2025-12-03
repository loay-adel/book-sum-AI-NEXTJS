/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Add these for App Router static export
  distDir: 'out',
  experimental: {
    appDir: true,
  },
}

export default nextConfig