/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true, // Allow data URIs and unoptimized images
  },
  eslint: {
    // Allow build to continue even with ESLint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow build to continue even with TypeScript errors (for now)
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
