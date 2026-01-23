import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { WhatsappManager } from "@/services/whatsapp";
// POST: Create Instance
// GET: Connect (Get QR)
export async function POST(req: any) {
    const user = await getSessionUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const instanceName = `merchant_${user.storeId}`; // Standardize
    const result = await WhatsappManager.createInstance(instanceName);
    return NextResponse.json(result);
}
export async function GET(req: any) {
    const user = await getSessionUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const instanceName = `merchant_${user.storeId}`;
    // Connect/Fetch QR
    const result = await WhatsappManager.connectInstance(instanceName);
    return NextResponse.json(result);
}
