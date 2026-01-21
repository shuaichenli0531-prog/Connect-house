/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Disable static export for API routes that need database
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
