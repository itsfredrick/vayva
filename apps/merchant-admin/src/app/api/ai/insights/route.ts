import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
export async function GET() {
    const user = await getSessionUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json([
        {
            id: "ins_001",
            type: "conversion",
            title: "Mobile conversion dropped",
            description: "Switching to Bold theme may recover ~8%.",
            impact: "high",
            action_label: "Preview Bold Theme",
            action_url: "/admin/control-center?tab=gallery&preview=bold",
        },
        {
            id: "ins_002",
            type: "finance",
            title: "High wallet holds detected",
            description: "Delaying withdrawals reduces failure risk of future transactions.",
            impact: "medium",
            action_label: "View Wallet Health",
            action_url: "/admin/wallet",
        },
        {
            id: "ins_003",
            type: "ops",
            title: "Slow WhatsApp replies",
            description: "Auto-replies could boost repeat orders by 15%.",
            impact: "low",
            action_label: "Setup Automation",
            action_url: "/admin/control-center",
        },
    ]);
}
