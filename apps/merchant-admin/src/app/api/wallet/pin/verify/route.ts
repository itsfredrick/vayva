import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
// POST /api/wallet/pin/verify
export async function POST(request: unknown) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const { pin } = body;
        if (!pin) {
            return NextResponse.json({ error: "PIN is required" }, { status: 400 });
        }
        const store = await prisma.store.findUnique({
            where: { id: user.storeId }
        });
        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }
        if (!store.walletPin) {
            // If no PIN set, technically verification passes or we inform frontend to set one.
            // For "Gatekeeper", we might want to allow access if no PIN is set (open mode),
            // OR force them to set one.
            // The prompt says "if a PIN is set, show a numeric keypad".
            // So if no PIN, we return specific status.
            return NextResponse.json({ success: true, status: "no_pin_set" });
        }
        const isValid = await bcrypt.compare(pin, store.walletPin);
        if (isValid) {
            return NextResponse.json({ success: true, status: "valid" });
        }
        else {
            return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
        }
    }
    catch (error) {
        console.error("Wallet PIN Verify Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
