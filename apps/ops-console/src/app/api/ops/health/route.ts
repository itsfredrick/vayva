import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        // Require authentication
        await OpsAuthService.requireSession();

        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Check database connectivity
        let dbStatus: "healthy" | "degraded" | "down" = "healthy";
        try {
            await prisma.$queryRaw`SELECT 1`;
        } catch (error) {
            dbStatus = "down";
        }

        // Check webhook health
        const webhookProviders = ["Paystack", "WhatsApp", "Kwik"];
        const webhookHealth = await Promise.all(
            webhookProviders.map(async (provider) => {
                const [lastEvent, failCount] = await Promise.all([
                    prisma.webhookEvent.findFirst({
                        where: { provider: { equals: provider, mode: "insensitive" } },
                        orderBy: { receivedAt: "desc" },
                        select: { receivedAt: true },
                    }),
                    prisma.webhookEvent.count({
                        where: {
                            provider: { equals: provider, mode: "insensitive" },
                            status: "failed",
                            receivedAt: { gte: last24h },
                        },
                    }),
                ]);

                return {
                    provider,
                    lastEvent: lastEvent?.receivedAt.toISOString() || null,
                    failCount24h: failCount,
                    signatureValid: true, // TODO: Implement signature validation check
                };
            })
        );

        // Service status
        const services = [
            {
                name: "API Gateway",
                status: "healthy" as const,
                uptime: 99.9,
                lastCheck: now.toISOString(),
            },
            {
                name: "Database",
                status: dbStatus,
                uptime: dbStatus === "healthy" ? 99.9 : 0,
                lastCheck: now.toISOString(),
            },
            {
                name: "Payment Processing",
                status: "healthy" as const,
                uptime: 99.5,
                lastCheck: now.toISOString(),
            },
            {
                name: "Worker Queue",
                status: "healthy" as const,
                uptime: 99.8,
                lastCheck: now.toISOString(),
            },
            {
                name: "Storefront",
                status: "healthy" as const,
                uptime: 99.7,
                lastCheck: now.toISOString(),
            },
        ];

        // Config warnings
        const warnings: string[] = [];
        const missingEnvVars: string[] = [];

        // Check critical env vars
        const criticalEnvVars = [
            "DATABASE_URL",
            "NEXTAUTH_SECRET",
            "PAYSTACK_SECRET_KEY",
            "WHATSAPP_API_KEY",
        ];

        criticalEnvVars.forEach((envVar) => {
            if (!process.env[envVar]) {
                missingEnvVars.push(envVar);
            }
        });

        // Check for test mode flags
        if (process.env.IS_TEST_MODE === "true") {
            warnings.push("IS_TEST_MODE is enabled - not suitable for production");
        }

        if (process.env.SKIP_EMAIL_VERIFICATION === "true") {
            warnings.push("Email verification is disabled");
        }

        // Calculate Webhook Stats
        const [received24h, failed24h] = await Promise.all([
            prisma.webhookEvent.count({
                where: { receivedAt: { gte: last24h } },
            }),
            prisma.webhookEvent.count({
                where: {
                    status: "failed",
                    receivedAt: { gte: last24h },
                },
            }),
        ]);

        const successRate = received24h > 0
            ? Math.round(((received24h - failed24h) / received24h) * 100)
            : 100;

        // Overall status
        const status = dbStatus === "healthy" ? "ok" : "degraded";

        return NextResponse.json({
            status,
            timestamp: now.toISOString(),
            uptime: process.uptime(),
            upstream: {
                database: dbStatus === "down" ? "down" : "up",
                paystack: "up", // Mocked for now
                resend: "up",   // Mocked for now
                redis: "up",    // Mocked for now
            },
            webhooks: {
                received_24h: received24h,
                failed_24h: failed24h,
                success_rate: successRate,
                signature_valid: true,
            },
        });
    } catch (error: any) {
        console.error("Health check error:", error);
        return NextResponse.json(
            { error: "Failed to fetch health status" },
            { status: 500 }
        );
    }
}
