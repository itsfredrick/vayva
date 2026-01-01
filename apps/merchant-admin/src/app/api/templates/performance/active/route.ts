import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Simulate real data processing
  return NextResponse.json({
    template_id: "tmpl_retail_simple",
    health_score: 85,
    metrics: {
      conversion_rate: 2.4,
      revenue: 450000,
      orders: 36,
      aov: 12500,
      bounce_rate: 41,
      checkout_completion: 68,
    },
    delta: {
      conversion_rate: 0.4,
      revenue: 12,
      orders: 5,
      aov: -2.1,
    },
    updatedAt: new Date().toISOString(),
  });
}
