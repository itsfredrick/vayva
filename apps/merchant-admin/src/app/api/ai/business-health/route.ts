import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    score: 74,
    status: "watch", // healthy, watch, risk
    trend: "down",
    factors: [
      { id: "f1", text: "Revenue growing steadily", sentiment: "positive" },
      {
        id: "f2",
        text: "Checkout failures slightly high",
        sentiment: "warning",
      },
      { id: "f3", text: "Stable withdrawals", sentiment: "positive" },
    ],
    primary_risk: {
      id: "stock_outs",
      text: "Stock-outs detected twice this week",
      severity: "high",
    },
    last_updated: new Date().toISOString(),
  });
}
