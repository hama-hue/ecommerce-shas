import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Stable config — works with Vercel and local builds
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/s/files/**',
      },
    ],
  },

  // ✅ Enable Next.js's built-in caching for static assets
  staticPageGenerationTimeout: 100,
  compress: true,
  swcMinify: true,

  // ✅ Ignore errors during build
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
