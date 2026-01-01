import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { accountNumber, bankCode } = await request.json();

  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate bank lookup

  if (accountNumber.length !== 10) {
    return NextResponse.json(
      { error: "Invalid account number" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    account_name: "FRED ADAMS - VERIFIED",
    account_number: accountNumber,
    bank_id: bankCode,
  });
}
