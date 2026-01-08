import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    active: true,
    applied_rules: [
      {
        id: "mobile_cta_boost",
        name: "Mobile Hero CTA",
        impact: "high",
        type: "mobile",
      },
      {
        id: "checkout_simplified",
        name: "Simplified Checkout",
        impact: "medium",
        type: "conversion",
      },
    ],
    last_updated: new Date().toISOString(),
    metrics: {
      uplift_rate: 12.5,
      prevented_dropoff: 45,
    },
  });
}
