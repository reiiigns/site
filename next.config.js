/** @type {import('next').NextConfig} */

// basePath must match your GitHub repo name.
// Site will be served at: reiiigns.github.io/site
// Remove basePath + assetPrefix if using a custom domain.
const BASE_PATH = '/site';

const nextConfig = {
  output: 'export',
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH + '/',
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: BASE_PATH,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
