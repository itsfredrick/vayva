import { NextResponse } from "next/server";
import { RescueService } from "@/lib/rescue/rescue-service";
import { OpsAuthService } from "@/lib/ops-auth";
export async function POST(req, { params }) {
    try {
        const { user } = await OpsAuthService.requireSession();
        const { actionType } = await req.json();
        if (!actionType) {
            return NextResponse.json({ error: "actionType is required" }, { status: 400 });
        }
        const { id } = await params;
        const result = await RescueService.performAction(id, actionType, user.id);
        return NextResponse.json(result);
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
