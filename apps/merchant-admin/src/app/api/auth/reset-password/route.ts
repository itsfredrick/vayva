import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
export async function POST(req: NextRequest) {
    try {
        const body = await req.json() as Record<string, string>;
        const { token, id, password } = body;
        if (!token || !id || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        // 1. Find User
        const user = await prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            return NextResponse.json({ error: "Invalid request" }, { status: 400 });
        }
        // 2. Verify Token
        // Must use same secret construction (app secret + old password hash)
        // This ensures one-time use effectively (once pass changes, secret changes, token invalid)
        const secret = process.env.NEXTAUTH_SECRET + user.password;
        try {
            jwt.verify(token, secret);
        }
        catch (e) {
            return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
        }
        // 3. Hash New Password
        const hashedPassword = await bcrypt.hash(password, 12);
        // 4. Update User
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
            },
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("[RESET_PASSWORD_ERROR]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
