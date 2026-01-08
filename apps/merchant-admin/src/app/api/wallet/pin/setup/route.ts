import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/wallet/pin/setup
export async function POST(request: NextRequest) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { currentPin, newPin, confirmPin } = body;

        // 1. Validation
        if (!newPin || newPin.length < 4 || newPin.length > 6 || isNaN(Number(newPin))) {
            return NextResponse.json({ error: "PIN must be 4-6 digits." }, { status: 400 });
        }

        if (newPin !== confirmPin) {
            return NextResponse.json({ error: "PINs do not match." }, { status: 400 });
        }

        // 2. Fetch Store to check existing PIN
        const store = await prisma.store.findUnique({
            where: { id: user.storeId }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const isChange = !!store.walletPin;

        // 3. If changing PIN, verify old PIN
        if (isChange) {
            if (!currentPin) {
                return NextResponse.json({ error: "Current PIN is required to change it." }, { status: 400 });
            }
            const isValid = await bcrypt.compare(currentPin, store.walletPin || "");
            if (!isValid) {
                return NextResponse.json({ error: "Incorrect current PIN." }, { status: 400 });
            }
        }

        // 4. Hash new PIN
        const hashedPin = await bcrypt.hash(newPin, 10);

        // 5. Update Database
        await prisma.store.update({
            where: { id: user.storeId },
            data: { walletPin: hashedPin }
        });

        // 6. Security Alert: Notify Merchant via Email
        if (process.env.RESEND_API_KEY) {
            await resend.emails.send({
                from: process.env.RESEND_FROM_EMAIL || "security@vayva.app",
                to: user.email, // Assuming user.email exists in session or fetch from user profile
                subject: `Security Alert: Wallet PIN ${isChange ? "Changed" : "Set"}`,
                html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Wallet Security Alert</h2>
                        <p>Hello,</p>
                        <p>Your Vayva Wallet PIN was just <strong>${isChange ? "updated" : "set"}</strong>.</p>
                        <p>If this was you, no further action is needed.</p>
                        <p style="color: red; font-weight: bold;">If you did not authorize this change, please contact support and secure your account immediately.</p>
                        <p>Time: ${new Date().toLocaleString()}</p>
                    </div>
                `
            });
        }

        return NextResponse.json({ success: true, message: "PIN set successfully" });

    } catch (error) {
        console.error("Wallet PIN Setup Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
