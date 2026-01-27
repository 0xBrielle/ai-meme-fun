import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Only enable static export for mobile builds
  ...(process.env.BUILD_TARGET === 'mobile' && {
    output: 'export',
    images: {
      unoptimized: true,
    },
  }),

  // Always enable trailing slash for Capacitor compatibility
  trailingSlash: true,

  // Environment-based API URL
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.BUILD_TARGET === 'mobile'
        ? process.env.NEXT_PUBLIC_PRODUCTION_API_URL // Your Vercel URL
        : '/api', // Local API routes
  },
};

export default nextConfig;
