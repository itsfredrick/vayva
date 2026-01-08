import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { pin } = await request.json();

        if (!pin || pin.length !== 4 || !/^\d+$/.test(pin)) {
            return NextResponse.json(
                { error: "PIN must be 4 digits" },
                { status: 400 },
            );
        }

        const salt = await bcrypt.genSalt(10);
        const pinHash = await bcrypt.hash(pin, salt);

        // Upsert wallet for the store
        await prisma.wallet.upsert({
            where: { storeId: user.storeId },
            update: {
                pinHash,
                pinSet: true,
                isLocked: false,
                failedPinAttempts: 0,
                lockedUntil: null,
            },
            create: {
                storeId: user.storeId,
                pinHash,
                pinSet: true,
                isLocked: false,
            },
        });

        return NextResponse.json({ success: true, message: "PIN set successfully" });
    } catch (error) {
        console.error("Set PIN error:", error);
        return NextResponse.json(
            { error: "Failed to set PIN" },
            { status: 500 },
        );
    }
}
