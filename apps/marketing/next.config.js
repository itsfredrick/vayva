/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@vayva/ui", "@vayva/shared"],
    reactCompiler: true,
    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "@vayva/ui",
            "framer-motion",
            "date-fns",
            "@vayva/shared",
            "lodash"
        ],
        staleTimes: {
            dynamic: 60,
            static: 180,
        },
        turbo: {}, // Opt-in to Turbopack to resolve webpack config warning
    },
    images: {
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    },
};

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    disable: process.env.NODE_ENV === "development",
});

module.exports = withPWA(nextConfig);
