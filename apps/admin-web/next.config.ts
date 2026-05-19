import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@pacto/types",
    "@pacto/auth",
    "@pacto/api-client",
    "@pacto/assets",
  ],
};

export default nextConfig;
