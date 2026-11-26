import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  output:
    process.env.STANDALONE_BUILD === "1" ? "standalone" : undefined,
};

export default nextConfig;
