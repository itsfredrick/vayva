import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        await OpsAuthService.requireSession();

        const start = Date.now();
        let dbStatus = "unknown";
        let dbLatency = 0;

        // Check Database
        try {
            await prisma.$queryRaw`SELECT 1`;
            dbStatus = "healthy";
            dbLatency = Date.now() - start;
        } catch (e) {
            console.error("Health check DB fail:", e);
            dbStatus = "unhealthy";
        }

        // Mock External API Checks (Simulating fast checks)
        const apiStatus = "healthy";

        const overallStatus = dbStatus === "healthy" ? "healthy" : "degraded";

        return NextResponse.json({
            status: overallStatus,
            timestamp: new Date().toISOString(),
            checks: {
                database: {
                    status: dbStatus,
                    latency: `${dbLatency}ms`,
                },
                external_apis: {
                    status: apiStatus,
                    latency: "N/A", // Mocked
                },
            },
            uptime: process.uptime(),
        });

    } catch (error) {
        return NextResponse.json({ error: "Health check failed" }, { status: 500 });
    }
}
