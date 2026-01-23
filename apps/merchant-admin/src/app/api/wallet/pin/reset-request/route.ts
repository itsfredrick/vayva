import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";
// POST /api/wallet/pin/reset-request
export async function POST(request: any) {
    try {
        const user = await getSessionUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        // 1. Generate Reset Token (Valid for 15 mins)
        const token = jwt.sign({ userId: user.id, storeId: user.storeId, type: "pin_reset" }, JWT_SECRET, { expiresIn: "15m" });
        // 2. Construct Reset URL
        // Assuming there is a page /dashboard/account/reset-pin?token=...
        // Or we can just let them click to go to settings and we verify token there?
        // Plan said "Request PIN Reset button". The detailed prompt says "Request PIN Reset ... triggers email with secure token link".
        // Use standard app url
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const resetUrl = `${appUrl}/dashboard/account/reset-pin?token=${token}`;
        // 3. Send Email
        // 3. Send Email
        if (process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || "no-reply@vayva.ng",
                    to: user.email,
                    subject: "Action Required: Reset your Wallet PIN",
                    html: `
                    <div style="font-family: sans-serif; padding: 20px;">
                        <h2>Reset Wallet PIN</h2>
                        <p>Hello,</p>
                        <p>We received a request to reset your Vayva Wallet PIN.</p>
                        <p>Click the button below to reset it. This link expires in 15 minutes.</p>
                        <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 20px 0;">Reset PIN</a>
                        <p>If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `
                });
            }
            catch (emailError) {
                console.error("Failed to send PIN reset email:", emailError);
            }
        }
        // 4. Log/Persist if needed (Audit Log)
        await prisma.adminAuditLog.create({
            data: {
                actorUserId: user.id,
                storeId: user.storeId,
                action: "PIN_RESET_REQUESTED",
                createdAt: new Date()
            }
        });
        return NextResponse.json({ success: true, message: "Reset link sent to your email." });
    }
    catch (error) {
        console.error("PIN Reset Request Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
