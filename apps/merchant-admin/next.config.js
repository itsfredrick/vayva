/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@vayva/ui", "@vayva/theme", "@vayva/schemas", "@vayva/shared", "@vayva/api-client", "@vayva/content"],
    experimental: {
        turbo: {
            root: "../../"
        }
    }
};

module.exports = nextConfig;
