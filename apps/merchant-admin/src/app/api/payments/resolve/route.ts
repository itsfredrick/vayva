import { NextResponse } from "next/server";
import { PaystackService } from "@/lib/payment/paystack";
export const dynamic = "force-dynamic";
export async function GET(req: any) {
    const { searchParams } = new URL(req.url);
    const accountNumber = searchParams.get("account_number");
    const bankCode = searchParams.get("bank_code");
    if (!accountNumber || !bankCode) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }
    try {
        const data = await PaystackService.resolveAccount(accountNumber, bankCode);
        return NextResponse.json(data);
    }
    catch (error) {
        console.error("[BANK_RESOLVE]", error);
        return NextResponse.json({ error: "Could not resolve account" }, { status: 422 });
    }
}
