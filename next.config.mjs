/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Increase static generation performance
  staticPageGenerationTimeout: 120,
  // Improve asset caching
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Prevent ERR_ABORTED errors during development
  onDemandEntries: {
    // Keep pages in memory for longer during development
    maxInactiveAge: 60 * 60 * 1000,
    // Have more pages open at once
    pagesBufferLength: 5,
  },
  // Improve static file serving
  compress: true,
  // Improve page loading performance
  reactStrictMode: true,
  // Improve production performance
  productionBrowserSourceMaps: false,
  // Improve development experience
  devIndicators: {
    position: 'bottom-right',
  },
};

export default nextConfig;
