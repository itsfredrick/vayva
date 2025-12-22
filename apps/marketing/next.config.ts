import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@vayva/db", "@vayva/template-service"],
};

export default nextConfig;
