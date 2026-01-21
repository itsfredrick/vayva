import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
// NOTE: Disabled - aiSubscription and invoice models do not exist in current schema
// This route needs to be refactored to use the correct billing models
export async function GET(req) {
    const user = await getSessionUser();
    if (!user?.storeId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // Return placeholder response until proper billing models are implemented
    return NextResponse.json({
        planKey: "growth",
        status: "active",
        periodEnd: null,
        cancelAtPeriodEnd: false,
        invoices: [],
        message: "Billing management not fully implemented"
    });
}
