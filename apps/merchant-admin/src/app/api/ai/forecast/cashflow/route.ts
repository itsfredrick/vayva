import { NextResponse } from "next/server";

export async function GET() {
  // Determine next Friday for the message
  const today = new Date();
  const nextFriday = new Date(today);
  nextFriday.setDate(today.getDate() + ((5 + 7 - today.getDay()) % 7));

  return NextResponse.json({
    expected_available: 180000,
    currency: "NGN",
    withdrawable_date: nextFriday.toISOString(),
    pending_settlements: 45000,
    message: "You're likely to have ₦180k withdrawable by Friday.",
  });
}
