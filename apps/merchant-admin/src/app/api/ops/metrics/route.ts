import { NextResponse } from "next/server";
import { getOpsMetrics } from "@/lib/ops-metrics";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET() {
  const session = await OpsAuthService.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const metrics = await getOpsMetrics();
    return NextResponse.json(metrics);
  } catch (err: any) {
    console.error("Ops Metrics Error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
