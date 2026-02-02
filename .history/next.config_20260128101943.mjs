/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
    // Add this to allow jsonwebtoken in server components
  experimental: {
    serverComponentsExternalPackages: ['jsonwebtoken'],
  },
  
  // If using webpack 5
  webpack: (config) => {
    config.externals.push({
      'jsonwebtoken': 'commonjs jsonwebtoken',
    });
    return config;
  },
};

export default nextConfig;