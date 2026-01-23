import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
// POST /api/integrations/kyc/verify
export async function POST(request: any) {
    try {
        const user = await getSessionUser();
        if (!user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const body = await request.json();
        const { nin, bvn, cacNumber, phone } = body; // Data from KycPage.formData
        const apiKey = process.env.YOUVERIFY_API_KEY;
        const baseUrl = process.env.YOUVERIFY_BASE_URL || "https://api.youverify.co";
        if (!apiKey) {
            console.error("KYC API credentials missing.");
            return NextResponse.json({ error: "Configuration Error: Missing API Key" }, { status: 500 });
        }
        // Real YouVerify Call (Simplified v2 identity verification)
        // Adjust endpoint based on specific YouVerify product (e.g. /v2/api/identity/ng/nin)
        let endpoint = "/v2/api/identity/ng/nin";
        let payload = { id: nin, isSubjectConsent: true };
        if (!nin && bvn) {
            endpoint = "/v2/api/identity/ng/bvn";
            payload = { id: bvn, isSubjectConsent: true };
        }
        const res = await fetch(`${baseUrl}${endpoint}`, {
            method: "POST",
            headers: {
                "token": apiKey,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        if (!res.ok) {
            console.error("KYC Provider Error", await res.text());
            return NextResponse.json({ error: "Verification Failed" }, { status: 400 });
        }
        const data = await res.json();
        // Map provider status to internal status
        // YouVerify usually returns { success: true, data: { ... } }
        const status = data.success ? "verified" : "failed";
        return NextResponse.json({
            success: data.success,
            status: status,
            details: data.data
        });
    }
    catch (error) {
        console.error("KYC Integration Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
