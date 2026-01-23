import { NextResponse } from "next/server";
import { PaystackService } from "@/services/PaystackService";
// POST /api/payments/resolve-account
export async function POST(request: unknown) {
    try {
        const body = await request.json();
        const { accountNumber, bankCode } = body || {};
        if (!accountNumber || !bankCode) {
            return NextResponse.json({ error: "accountNumber and bankCode are required" }, { status: 400 });
        }
        const data = await PaystackService.resolveBankAccount(accountNumber, bankCode);
        return NextResponse.json({ data });
    }
    catch (error) {
        console.error("Resolve account error:", error);
        return NextResponse.json({ error: error?.message || "Failed to resolve account" }, { status: 400 });
    }
}
