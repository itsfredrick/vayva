import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET() {
    try {
        // 1. Check Database
        await prisma.$queryRaw`SELECT 1`;

        // 2. Check Evolutionary API (WhatsApp Gateway)
        // In a real scenario, we'd ping the actual URL from env
        const gatewayUrl = process.env.WHATSAPP_GATEWAY_URL || "http://localhost:8080";
        let gatewayStatus = "UP";
        try {
            const res = await fetch(`${gatewayUrl}/health`, { signal: AbortSignal.timeout(3000) });
            if (!res.ok) gatewayStatus = "DOWN";
        } catch (e) {
            gatewayStatus = "DOWN";
        }

        // 3. Log Critical Alert if Gateway is DOWN
        if (gatewayStatus === "DOWN") {
            console.error("CRITICAL: WhatsApp Gateway is DOWN!");
            // In a production app, we would trigger a WhatsApp alert to Ops here
            // via a backup channel or Resend email.
        }

        return NextResponse.json({
            status: "HEALTHY",
            timestamp: new Date().toISOString(),
            checks: {
                database: "UP",
                whatsapp_gateway: gatewayStatus,
            }
        });

    } catch (error: any) {
        return NextResponse.json(
            { status: "UNHEALTHY", error: error.message },
            { status: 500 }
        );
    }
}
