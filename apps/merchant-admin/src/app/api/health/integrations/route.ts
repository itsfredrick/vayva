import { NextResponse } from "next/server";
import { getIntegrationHealth } from "@/lib/integration-health";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = (session.user as any).storeId;

    // Ensure env var is set for library logic
    process.env.OPS_INTEGRATION_HEALTH_ENABLED = "true";

    const health = await getIntegrationHealth(storeId);

    return NextResponse.json({ health });
  } catch (error: any) {
    console.error("Integration health error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
