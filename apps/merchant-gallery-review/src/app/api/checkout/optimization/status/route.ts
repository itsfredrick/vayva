import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    active: true,
    rules: [
      {
        id: "smart_retry",
        name: "Smart Logic Retry",
        type: "retry",
        status: "active",
        impact: "high",
      },
      {
        id: "method_reordering",
        name: "Dynamic Method Ordering",
        type: "ordering",
        status: "active",
        impact: "medium",
      },
      {
        id: "friction_reduction",
        name: "Address Field Reduction",
        type: "ux",
        status: "active",
        impact: "low",
      },
    ],
    metrics: {
      success_rate_uplift: 15.4,
      failed_transactions_prevented: 128,
      disputes_reduced: 40,
    },
    last_updated: new Date().toISOString(),
  });
}
