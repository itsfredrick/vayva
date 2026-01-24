import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
export async function POST(request: Request) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { pin } = await request.json();
        const wallet = await prisma.wallet.findUnique({
            where: { storeId: user.storeId },
        });
        const w = wallet as any;
        if (!w || !w.pinHash) {
            return NextResponse.json({ error: "PIN not set" }, { status: 400 });
        }
        if (w.isLocked) {
            if (w.lockedUntil && new Date() < w.lockedUntil) {
                return NextResponse.json({ error: "Wallet is locked due to too many failed attempts. Try again later." }, { status: 403 });
            }
            // Unlock if time passed
            await prisma.wallet.update({
                where: { storeId: user.storeId },
                data: { isLocked: false, failedPinAttempts: 0, lockedUntil: null }
            });
        }
        const isValid = await bcrypt.compare(pin, w.pinHash);
        if (!isValid) {
            const attempts = w.failedPinAttempts + 1;
            const updateData: any = { failedPinAttempts: attempts };
            if (attempts >= 5) {
                updateData.isLocked = true;
                updateData.lockedUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 mins
            }
            await prisma.wallet.update({
                where: { storeId: user.storeId },
                data: updateData,
            });
            return NextResponse.json({ error: "Invalid PIN" }, { status: 400 });
        }
        // Success - reset counters
        if (w.failedPinAttempts > 0) {
            await prisma.wallet.update({
                where: { storeId: user.storeId },
                data: { failedPinAttempts: 0, isLocked: false, lockedUntil: null }
            });
        }
        return NextResponse.json({ success: true });
    }
    catch (error: any) {
        console.error("Verify PIN error:", error);
        return NextResponse.json({ error: "Failed to verify PIN" }, { status: 500 });
    }
}
