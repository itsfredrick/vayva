import { NextResponse } from "next/server";
import { WithdrawalQuote } from "@vayva/shared";

// Paystack standard transfer rate (simulated) -> 10 NGN if < 5000, 25 if < 50000, 50 otherwise
const calculateFee = (amount: number) => {
  if (amount <= 5000) return 10;
  if (amount <= 50000) return 25;
  return 50;
};

export async function POST(request: Request) {
  const body = await request.json();
  const { amount } = body;

  const fee = calculateFee(amount);

  await new Promise((resolve) => setTimeout(resolve, 500));

  const quote: WithdrawalQuote = {
    amount,
    fee,
    netAmount: amount - fee,
    currency: "NGN",
    estimatedArrival: "within 24 hours",
  };

  return NextResponse.json(quote);
}
