import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    primary_risk: "cancellation_spike",
    probability: 0.65,
    potential_impact: "12% revenue drop",
    message:
      "If current cancellation trend continues, next week’s revenue may drop ~12%.",
  });
}
