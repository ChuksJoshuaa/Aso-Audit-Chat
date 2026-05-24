import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@mastra/core"],
  eslint: {
    ignoreDuringBuilds: false,
  },
  output: "standalone",
};

export default nextConfig;
