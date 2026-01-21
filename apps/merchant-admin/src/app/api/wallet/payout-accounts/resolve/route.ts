import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { accountNumber, bankCode } = await request.json();



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
