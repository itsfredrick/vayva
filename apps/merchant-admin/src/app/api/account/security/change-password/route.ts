import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { logAuditEvent as logAudit, AuditEventType } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";
export async function POST(req: any) {
    try {
        const session = await requireAuth();
        const userId = session.user.id;
        const storeId = session.user.storeId;
        // 1. Rate Limiting (Security Guard)
        try {
            await checkRateLimit(userId, "password_change", 5, 3600, storeId);
        }
        catch (error) {
            return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
        }
        const { currentPassword, newPassword, confirmPassword } = await req.json();
        // 2. Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        if (newPassword !== confirmPassword) {
            return NextResponse.json({ error: "New passwords do not match" }, { status: 400 });
        }
        if (newPassword.length < 8) {
            return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
        }
        // 3. Verify Current Password
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { password: true, email: true },
        });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Incorrect current password" }, { status: 401 });
        }
        // 4. Update Password
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
        // 5. Audit Logging
        await logAudit(storeId, userId, AuditEventType.SETTINGS_CHANGED, {
            targetType: "USER",
            targetId: userId,
            meta: {
                ip: req.headers.get("x-forwarded-for") || "unknown",
                actor: { type: "USER", label: user.email }
            }
        });
        // 6. Security Notification
        const { ResendEmailService } = await import("@/lib/email/resend");
        await ResendEmailService.sendPasswordChangedEmail(user.email);
        return NextResponse.json({ message: "Password updated successfully" });
    }
    catch (error) {
        console.error("Password change error:", error);
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }
}
