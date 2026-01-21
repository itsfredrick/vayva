import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/security/keys";
// DELETE: Revoke Key
export async function DELETE(req, { params } // Fix for Next.js 15+ param handling
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    try {
        // Verify ownership
        const existing = await prisma.apiKey.findFirst({
            where: { id, storeId: session.user.storeId }
        });
        if (!existing)
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        await prisma.apiKey.update({
            where: { id },
            data: {
                status: "REVOKED",
                revokedAt: new Date()
            }
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to revoke key" }, { status: 500 });
    }
}
// POST: Rotate Key
// Generates a new key, and optionally sets expiry on old one.
export async function POST(req, { params }) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.storeId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await params;
    const storeId = session.user.storeId;
    try {
        const existing = await prisma.apiKey.findFirst({
            where: { id, storeId }
        });
        if (!existing)
            return NextResponse.json({ error: "Key not found" }, { status: 404 });
        if (existing.status !== "ACTIVE")
            return NextResponse.json({ error: "Key not active" }, { status: 400 });
        // Generate Replacement
        const { key: newKey, hash: newHash } = generateApiKey();
        // 1. Create New Key
        const replacement = await prisma.apiKey.create({
            data: {
                storeId,
                name: `${existing.name} (Rotated)`,
                keyHash: newHash,
                scopes: existing.scopes,
                status: "ACTIVE"
            }
        });
        // 2. Revoke Old Key (Immediately for now, or set expiry?)
        // Requirement: "prevent key reuse after rotation". Immediate revocation is safest/simplest.
        await prisma.apiKey.update({
            where: { id },
            data: {
                status: "REVOKED",
                revokedAt: new Date()
            }
        });
        return NextResponse.json({
            success: true,
            message: "Key rotated successfully. Old key revoked.",
            apiKey: {
                id: replacement.id,
                name: replacement.name,
                key: newKey
            }
        });
    }
    catch (error) {
        return NextResponse.json({ error: "Failed to rotate key" }, { status: 500 });
    }
}
