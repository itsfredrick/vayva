const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@vayva/ui", "@vayva/theme", "@vayva/schemas", "@vayva/api-client", "@vayva/db", "@vayva/shared", "@vayva/redis"],
  reactCompiler: false,
  experimental: {
    optimizePackageImports: ["lucide-react", "@vayva/ui", "date-fns", "framer-motion"],
    staleTimes: {
      dynamic: 30,
      static: 180,
    },
  },
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};
module.exports = nextConfig;
