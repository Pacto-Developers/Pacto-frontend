import type { NextConfig } from "next";

const backendUrl = (
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  ""
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pacto/types",
    "@pacto/auth",
    "@pacto/api-client",
    "@pacto/assets",
  ],
  async rewrites() {
    if (!backendUrl) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
