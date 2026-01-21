const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@vayva/ui", "@vayva/theme", "@vayva/schemas", "@vayva/api-client"],
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};
module.exports = nextConfig;
