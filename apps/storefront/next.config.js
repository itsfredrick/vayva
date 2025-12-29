/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@vayva/ui", "@vayva/theme", "@vayva/schemas", "@vayva/api-client", "@vayva/content"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
};
module.exports = nextConfig;
