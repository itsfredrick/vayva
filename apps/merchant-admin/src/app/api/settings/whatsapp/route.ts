import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { getIntegrationHealth } from "@/lib/integration-health";

export async function GET() {
    try {
        const session = await requireAuth();
        // Use the function
        const health = await getIntegrationHealth(session.user.storeId);
        const status = health["whatsapp"]?.status || "UNKNOWN";

        return NextResponse.json({ status });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
