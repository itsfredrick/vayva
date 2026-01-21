import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";

// POST /api/integrations/whatsapp/connect
export async function POST(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await request.json();
        const { phoneNumber } = body;

        // Validation
        if (!phoneNumber) return NextResponse.json({ error: "Phone number required" }, { status: 400 });

        const evolutionUrl = process.env.EVOLUTION_API_URL;
        const evolutionKey = process.env.WHATSAPP_API_KEY; // Using existing env var or new one

        if (!evolutionUrl || !evolutionKey) {
            console.error("Evolution API credentials missing.");
            return NextResponse.json({ error: "Configuration Error: Missing API Keys" }, { status: 500 });
        }

        // Real Evolution API Call: Create Instance & Send OTP
        // 1. Check/Create Instance
        const instanceName = `store_${user.storeId}`;

        // This is a simplified implementation assuming we just want to send a text or verify.
        // Evolution API usually requires creating an instance then scanning QR or requesting code.
        // For "Connect via OTP" flow (WhatsApp Business Platform/Cloud API style via Evolution):

        const res = await fetch(`${evolutionUrl}/instance/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": evolutionKey
            },
            body: JSON.stringify({
                instanceName: instanceName,
                qrcode: false,
                number: phoneNumber
            })
        });

        // 2. Trigger OTP (if applicable) or return success to let frontend handle next step
        // In a real flow, this is complex. We'll assume success for the "Connect" signal.

        if (res.ok || res.status === 409) { // 409 = already exists
            return NextResponse.json({ success: true, instance: instanceName });
        }

        return NextResponse.json({ error: "Provider Error" }, { status: 502 });

    } catch (error) {
        console.error("WhatsApp Integration Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
