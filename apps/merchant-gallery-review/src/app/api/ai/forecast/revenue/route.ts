import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    period: "30d",
    range_min: 420000,
    range_max: 480000,
    currency: "NGN",
    confidence: 0.85,
    trend_direction: "up",
    trend_percentage: 12,
  });
}
