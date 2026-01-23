import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
export async function POST(req: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { email, role } = await req.json();
        if (!email || !role) {
            return NextResponse.json({ error: "Email and Role required" }, { status: 400 });
        }
        // Check existing membership
        const existingMember = await prisma.membership.findFirst({
            where: {
                storeId: session.user.storeId,
                user: { email }
            }
        });
        if (existingMember) {
            return NextResponse.json({ error: "User is already a member" }, { status: 409 });
        }
        // Check if User exists in DB
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            // Direct Add
            await prisma.membership.create({
                data: {
                    storeId: session.user.storeId,
                    userId: existingUser.id,
                    role_enum: role,
                    status: "ACTIVE" // Auto-add for simplicity in MVP
                }
            });
            return NextResponse.json({ status: "added" });
        }
        else {
            // Invite
            const store = await prisma.store.findUnique({ where: { id: session.user.storeId }, select: { settings: true } });
            const currentSettings = store?.settings || {};
            const currentInvites = currentSettings.invites || [];
            // Check if already invited
            if (currentInvites.find((i: any) => i.email === email)) {
                return NextResponse.json({ error: "User already invited" }, { status: 409 });
            }
            const newInvite = {
                email,
                role,
                token: crypto.randomBytes(16).toString("hex"),
                invitedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
            };
            await prisma.store.update({
                where: { id: session.user.storeId },
                data: {
                    settings: {
                        ...currentSettings,
                        invites: [...currentInvites, newInvite]
                    }
                }
            });
            // Send Email via EmailService
            const inviteUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/signup?invite=${newInvite.token}&email=${email}`;
            try {
                const { EmailProvider } = await import("@/lib/providers/email");
                await EmailProvider.sendEmail(email, "Invitation to join team on Vayva", `<p>You have been invited to join a store on Vayva as a <strong>${role}</strong>.</p>
                     <p>Click the link below to accept the invitation and set up your account:</p>
                     <p><a href="${inviteUrl}">${inviteUrl}</a></p>
                     <p>This link expires in 7 days.</p>`);
            }
            catch (e) {
                console.error("Email Dispatch Failed:", e);
                // We still Return success for the invite record, but log the error.
                // In production, we'd retry or notify the user.
            }
            return NextResponse.json({ status: "invited", invite: newInvite });
        }
    }
    catch (error) {
        console.error("Invite Error:", error);
        return NextResponse.json({ error: "Failed to invite" }, { status: 500 });
    }
}
export async function DELETE(req: any) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { searchParams } = new URL(req.url);
        const email = searchParams.get("email");
        if (!email)
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        const store = await prisma.store.findUnique({ where: { id: session.user.storeId }, select: { settings: true } });
        const currentSettings = store?.settings || {};
        const currentInvites = currentSettings.invites || [];
        const newInvites = currentInvites.filter((i: any) => i.email !== email);
        await prisma.store.update({
            where: { id: session.user.storeId },
            data: {
                settings: {
                    ...currentSettings,
                    invites: newInvites
                }
            }
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to undo invite" }, { status: 500 });
    }
}
