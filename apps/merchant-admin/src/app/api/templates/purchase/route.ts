import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { templateId } = await request.json();

  // Simulate purchase
  return NextResponse.json({
    success: true,
    purchaseId: "pur_" + Math.random().toString(36).substr(2, 9),
    amount: 25000,
    currency: "NGN",
    purchasedAt: new Date().toISOString(),
  });
}
