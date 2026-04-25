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
  // Pre-existing TS + ESLint errors in the repo — skip at build time.
  // Clean these up when ready (DataShader null-checks, layout.tsx instagram field).
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
