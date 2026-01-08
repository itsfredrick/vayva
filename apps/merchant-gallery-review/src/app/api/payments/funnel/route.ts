import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    period: "30d",
    steps: [
      { name: "Checkout Started", count: 1250, dropoff: 0 },
      { name: "Method Selected", count: 980, dropoff: 21.6 },
      { name: "Payment Attempted", count: 910, dropoff: 7.1 },
      { name: "Payment Success", count: 885, dropoff: 2.7 },
    ],
    optimization_impact: {
      step: "Payment Attempted",
      uplift: "+5.2%", // Attributed to AI
    },
  });
}
