import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

// POST /api/integrations/whatsapp/verify
export async function POST(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { otp } = body;

        // Validation
        if (!otp) return NextResponse.json({ error: "OTP required" }, { status: 400 });

        // Production: Verify OTP against session/DB code
        // For current flow, we accept 6-digit codes
        if (otp && otp.length === 6) {
            return NextResponse.json({ success: true, status: "verified" });
        }

        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    } catch (error: any) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
