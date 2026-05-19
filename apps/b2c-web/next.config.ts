import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@pacto/types", "@pacto/api-client"],
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
