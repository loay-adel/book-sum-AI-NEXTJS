// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'covers.openlibrary.org',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },

    
  // Enable compression
  compress: true,
  
  // Optimize production builds
  swcMinify: true,
  
  // SEO: Add trailing slashes
  trailingSlash: true,
  
  // Internationalized Routing
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
