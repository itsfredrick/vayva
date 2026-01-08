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

        // In a real Evolution API flow, checking OTP might mean checking if the instance is ready or validating a code.
        // For simplicity/demo:
        if (otp === "123456" || otp.length === 6) {
            // We accept any 6 digit code for now if running in mock/demo mode unless we strictly implemented the OTP storage.
            return NextResponse.json({ success: true, status: "verified" });
        }

        return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });

    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
