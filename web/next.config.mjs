/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  images: { unoptimized: true },
  // Mirror uber.com's locale-prefixed URLs: /gh/en/business -> /business
  async rewrites() {
    return [
      { source: "/gh/:locale(en|fr)/:path+", destination: "/:path+" },
    ];
  },
};

export default nextConfig;
