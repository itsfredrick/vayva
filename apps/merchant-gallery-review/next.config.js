/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
    output: "standalone", // Ensures Vercel generates required .nft.json artifacts for middleware tracing
    transpilePackages: ["@vayva/ui", "@vayva/theme", "@vayva/schemas", "@vayva/shared", "@vayva/api-client", "@vayva/content"],
    serverExternalPackages: ["@prisma/client", "bcryptjs", "@vayva/db", "bullmq", "ioredis"],
    reactCompiler: true,
    experimental: {
        optimizePackageImports: ["lucide-react", "@vayva/ui", "@vayva/shared", "@vayva/api-client", "date-fns", "framer-motion", "recharts"],
        staleTimes: {
            dynamic: 30,
            static: 180,
        },
    },
    async rewrites() {
        return [
            {
                source: "/ops",
                destination: `${process.env.OPS_CONSOLE_URL || "http://localhost:3002"}/ops`,
            },
            {
                source: "/ops/:path*",
                destination: `${process.env.OPS_CONSOLE_URL || "http://localhost:3002"}/ops/:path*`,
            },
        ];
    },
};

const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    // Optimized for dashboard data freshness
    cacheOnFrontEndNav: false,
    aggressiveFrontEndNavCaching: false,
    reloadOnOnline: true,
    swcMinify: true,
    disable: process.env.NODE_ENV === "development",
    workboxOptions: {
        disableDevLogs: true,
        skipWaiting: true,
        clientsClaim: true,
    },
});

module.exports = withSentryConfig(
    withPWA(nextConfig),
    {
        // For all available options, see:
        // https://github.com/getsentry/sentry-webpack-plugin#options

        // Suppresses source map uploading logs during build
        silent: true,
    },
    {
        // For all available options, see:
        // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

        // Upload a larger set of source maps for prettier stack traces (increases build time)
        widenClientFileUpload: true,

        // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
        tunnelRoute: "/monitoring",

        // Hides source maps from generated client bundles
        hideSourceMaps: true,

        // Automatically tree-shake Sentry logger statements to reduce bundle size
        disableLogger: true,
    }
);
