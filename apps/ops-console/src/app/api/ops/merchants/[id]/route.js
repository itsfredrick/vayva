import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";
import { validateStoreCompliance } from "@vayva/compliance";
export const dynamic = "force-dynamic";
export async function GET(request, { params }) {
    try {
        const { user } = await OpsAuthService.requireSession();
        if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const [store, complianceReport] = await Promise.all([
            prisma.store.findUnique({
                where: { id },
                include: {
                    tenant: {
                        include: {
                            tenantMemberships: {
                                include: {
                                    user: { select: { id: true, firstName: true, lastName: true, email: true } }
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            orders: true,
                            products: true,
                            customers: true
                        }
                    }
                }
            }),
            validateStoreCompliance(id)
        ]);
        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }
        const gmvAggregate = await prisma.order.aggregate({
            where: { storeId: id, paymentStatus: "SUCCESS" },
            _sum: { total: true }
        });
        const wallet = await prisma.wallet.findUnique({
            where: { storeId: id }
        });
        const ownerMember = store.tenant?.tenantMemberships.find((m) => m.role === "OWNER");
        const ownerEmail = ownerMember?.user.email;
        // Parse settings for notes
        const settings = store.settings || {};
        const notes = settings.internalNotes || [];
        return NextResponse.json({
            profile: {
                id: store.id,
                name: store.name,
                slug: store.slug,
                logoUrl: store.logoUrl,
                isLive: store.isLive,
                createdAt: store.createdAt,
                ownerEmail,
            },
            stats: {
                ordersCount: store._count.orders,
                productsCount: store._count.products,
                customersCount: store._count.customers,
                gmv: gmvAggregate._sum.total || 0,
                walletBalance: wallet ? Number(wallet.availableKobo) / 100 : 0,
            },
            users: store.tenant?.tenantMemberships.map((m) => ({
                id: m.user.id,
                name: `${m.user.firstName || ""} ${m.user.lastName || ""}`.trim() || "Unknown",
                email: m.user.email,
                role: m.role
            })) || [],
            notes,
            compliance: complianceReport
        });
    }
    catch (error) {
        console.error("Fetch Merchant Detail Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
export async function PATCH(request, { params }) {
    try {
        const { user } = await OpsAuthService.requireSession();
        // Notes can be added by Support as well
        if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        const resolvedParams = await params;
        const { id } = resolvedParams;
        const body = await request.json();
        const { note } = body;
        if (!note || typeof note !== "string") {
            return NextResponse.json({ error: "Invalid note" }, { status: 400 });
        }
        // 1. Fetch current settings
        const store = await prisma.store.findUnique({
            where: { id },
            select: { settings: true }
        });
        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }
        const currentSettings = store.settings || {};
        const currentNotes = Array.isArray(currentSettings.internalNotes) ? currentSettings.internalNotes : [];
        // 2. Append new note
        const newNoteEntry = {
            id: Date.now().toString(),
            text: note,
            author: user.email, // Or name if available
            date: new Date().toISOString()
        };
        const updatedNotes = [newNoteEntry, ...currentNotes];
        // 3. Save back to DB
        await prisma.store.update({
            where: { id },
            data: {
                settings: {
                    ...currentSettings,
                    internalNotes: updatedNotes
                }
            }
        });
        // Audit Log
        await OpsAuthService.logEvent(user.id, "MERCHANT_NOTE_ADDED", {
            storeId: id,
            notePreview: note.substring(0, 50)
        });
        return NextResponse.json({ success: true, notes: updatedNotes });
    }
    catch (error) {
        console.error("Update Merchant Note Error:", error);
        return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
}
