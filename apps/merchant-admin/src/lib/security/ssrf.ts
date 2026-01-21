
import * as dns from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Validates if a URL is safe to request (prevention of SSRF).
 * Blocks:
 * - Non-HTTP/HTTPS protocols
 * - Localhost / Loopback
 * - Private IP ranges (10.x, 192.168.x, 172.16-31.x)
 * - Link-local (169.254.x)
 * - AWS Metadata service
 */
export async function isSafeUrl(inputUrl: string): Promise<boolean> {
    try {
        const url = new URL(inputUrl);

        // 1. Protocol Check
        if (!["http:", "https:"].includes(url.protocol)) {
            return false;
        }

        const hostname = url.hostname;

        // 2. Localhost Check
        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1") {
            // Allow in development only
            if (process.env.NODE_ENV === "development") return true;
            return false;
        }

        // 3. IP Check (if hostname is IP)
        if (isIP(hostname)) {
            return isPublicIP(hostname);
        }

        // 4. DNS Resolution (Protection against DNS rebinding / internal domains)
        // We resolve the hostname to an IP and check that IP.
        try {
            const addresses = await dns.lookup(hostname, { all: true });
            for (const addr of addresses) {
                if (!isPublicIP(addr.address)) {
                    if (process.env.NODE_ENV === "development") continue;
                    return false;
                }
            }
        } catch (e) {
            // If DNS fails, it's safer to reject or decide based on policy.
            // If we can't resolve it, we can't fetch it anyway, so safe? 
            // Or it might resolve internally in the worker.
            // Let's allow fail (fetch will fail later) BUT strictly we should return false if we want "Safe URL".
            return false;
        }

        return true;
    } catch (e) {
        return false;
    }
}

function isPublicIP(ip: string): boolean {
    // IPv4 Checks
    if (ip.includes(".")) {
        const parts = ip.split(".").map(Number);
        // 127.0.0.0/8 (Loopback)
        if (parts[0] === 127) return false;
        // 10.0.0.0/8 (Private)
        if (parts[0] === 10) return false;
        // 192.168.0.0/16 (Private)
        if (parts[0] === 192 && parts[1] === 168) return false;
        // 172.16.0.0/12 (Private)
        if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return false;
        // 169.254.0.0/16 (Link Local)
        if (parts[0] === 169 && parts[1] === 254) return false;
        // 0.0.0.0/8 (Current network)
        if (parts[0] === 0) return false;

        return true;
    }

    // IPv6 Checks (Basic)
    // ::1 (Loopback)
    if (ip === "::1") return false;
    // fc00::/7 (Unique Local)
    if (ip.toLowerCase().startsWith("fc") || ip.toLowerCase().startsWith("fd")) return false;
    // fe80::/10 (Link Local)
    if (ip.toLowerCase().startsWith("fe80")) return false;

    return true;
}
