import { NextResponse } from "next/server";
import { PaystackService } from "@/lib/payment/paystack";
export const dynamic = "force-dynamic";
export async function GET() {
    try {
        const banks = await PaystackService.getBanks();
        // Filter for active banks only and sort alphabetically
        const activeBanks = banks
            .filter(b => b.active)
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(b => ({ name: b.name, code: b.code }));
        return NextResponse.json(activeBanks);
    }
    catch (error) {
        console.error("[BANKS_GET]", error);
        return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
    }
}
