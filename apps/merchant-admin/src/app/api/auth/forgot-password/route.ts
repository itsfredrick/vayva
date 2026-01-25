import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
// Factory to ensure lazy loading of API key
function getResend() {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not defined");
    return new Resend(key);
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as Record<string, string>;
        const { email } = body;
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        // 1. Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });
        // 2. Security: Always return OK even if user doesn't exist to prevent enumeration
        if (!user) {
            return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
        }
        // 3. Generate stateless JWT token
        // Use user's password hash as part of secret to invalidate token if password changes naturally
        const secret = process.env.NEXTAUTH_SECRET + user.password;
        const token = jwt.sign({ id: user.id, email: user.email, type: "password_reset" }, secret, {
            expiresIn: "1h",
        });
        // 4. Construct Link
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}&id=${user.id}`;
        // 5. Send Email
        await getResend().emails.send({
            from: "Vayva Security <security@vayva.ng>",
            to: email,
            subject: "Reset your Vayva password",
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset Password</h2>
                    <p>You requested a password reset for your Vayva account. Click the button below to proceed.</p>
                    <a href="${resetLink}" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">Reset Password</a>
                    <p style="color: #666; font-size: 14px;">This link expires in 1 hour.</p>
                    <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });
        return NextResponse.json({ message: "If an account exists, a reset link has been sent." });
    }
    catch (error: any) {
        console.error("[FORGOT_PASSWORD_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
