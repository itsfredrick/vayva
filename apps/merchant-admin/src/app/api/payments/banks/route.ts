import { NextResponse } from "next/server";
import { PaystackService } from "@/lib/payment/paystack";
export const dynamic = "force-dynamic";
export async function GET() {
    try {
        const banks = await PaystackService.getBanks();
        // Filter for active banks only and sort alphabetically
        const activeBanks = banks
            .filter((b: any) => b.active)
            .sort((a: any, b: any) => a.name.localeCompare(b.name))
            .map((b: any) => ({ name: b.name, code: b.code }));
        return NextResponse.json(activeBanks);
    }
    catch (error: any) {
        console.error("[BANKS_GET]", error);
        return NextResponse.json({ error: "Failed to fetch banks" }, { status: 500 });
    }
}
