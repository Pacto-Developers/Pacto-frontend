import type { NextConfig } from "next";

const backendUrl = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  transpilePackages: ["@pacto/types", "@pacto/api-client", "@pacto/assets"],
  async rewrites() {
    if (!backendUrl) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
