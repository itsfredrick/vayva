const path = require('path');

if (process.env.NODE_ENV === 'development' && process.env.PORT && process.env.PORT !== '3000') {
    throw new Error(`[SECURITY/PORT_GUARD] The web app is strictly restricted to port 3000. Detected port: ${process.env.PORT}. Please stop other servers and use port 3000.`);
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ["@vayva/ui", "@vayva/theme", "@vayva/db"],
    typescript: {
        ignoreBuildErrors: true,
    },
    turbopack: {
        // Point to the workspace root (2 levels up from apps/web)
        root: path.resolve(__dirname, '../../'),
    }
};

module.exports = nextConfig;
