/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    // Suppress dynamic require warning from Supabase
    config.module.exprContextCritical = false;

    // Prevent Webpack errors related to optional native modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bufferutil: false,
        'utf-8-validate': false,
      };
    }

    return config;
  },
};

module.exports = nextConfig;
