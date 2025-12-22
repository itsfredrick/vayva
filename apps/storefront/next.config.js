/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@vayva/ui", "@vayva/theme", "@vayva/schemas", "@vayva/api-client", "@vayva/content"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};
module.exports = nextConfig;
