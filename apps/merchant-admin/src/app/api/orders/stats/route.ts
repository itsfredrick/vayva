import { NextResponse } from "next/server";
import { OrderStats } from "@vayva/shared";

export async function GET() {
  const stats: OrderStats = {
    totalRevenue: 154000,
    countNew: 5,
    countInProgress: 3,
    countCompleted: 12,
    countPendingPayment: 2,
  };


  return NextResponse.json(stats);
}
