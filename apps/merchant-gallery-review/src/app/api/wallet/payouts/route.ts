import { NextResponse } from "next/server";
// Using same types, maybe a specific Payout type if needed, but LedgerEntry covers history.
// This endpoint can return payout config/summary data.

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return NextResponse.json({
    lastPayout: {
      amount: 500000,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: "COMPLETED",
    },
    nextPayout: {
      eligibleDate: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      estimatedAmount: 250000,
    },
    config: {
      bankName: "Access Bank",
      accountNumber: "**** 1234",
      schedule: "Daily",
    },
  });
}
