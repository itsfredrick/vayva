import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

/**
 * GET /api/appeals
 * Fetch merchant's appeal cases and current restrictions
 */
export const GET = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (req, { storeId }) => {
    try {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: {
                id: true,
                settings: true,
            },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const settings = (store.settings as any) || {};
        const appeals = Array.isArray(settings.appeals) ? settings.appeals : [];
        const warnings = Array.isArray(settings.warnings) ? settings.warnings : [];

        // Get current restrictions (assuming stored in settings or separate field)
        const restrictions = settings.restrictions || {};

        return NextResponse.json({
            success: true,
            data: {
                appeals,
                warnings,
                restrictions: {
                    ordersDisabled: restrictions.ordersDisabled || false,
                    productsDisabled: restrictions.productsDisabled || false,
                    marketingDisabled: restrictions.marketingDisabled || false,
                    settingsEditsDisabled: restrictions.settingsEditsDisabled || false,
                    salesDisabled: restrictions.salesDisabled || false,
                    paymentsDisabled: restrictions.paymentsDisabled || false,
                    uploadsDisabled: restrictions.uploadsDisabled || false,
                    aiDisabled: restrictions.aiDisabled || false,
                }
            }
        });
    } catch (error: any) {
        console.error("Get appeals error:", error);
        return NextResponse.json({ error: "Failed to fetch appeals" }, { status: 500 });
    }
});

/**
 * POST /api/appeals
 * Submit a new appeal case
 */
export const POST = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (req, { storeId }) => {
    try {
        const body = await req.json();
        const { reason, message, channel, customerEmail, customerPhone, evidenceUrls } = body;

        if (!reason || reason.length < 10) {
            return NextResponse.json(
                { error: "Reason must be at least 10 characters" },
                { status: 400 }
            );
        }

        if (!message || message.length < 5) {
            return NextResponse.json(
                { error: "Message must be at least 5 characters" },
                { status: 400 }
            );
        }

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { id: true, name: true, settings: true },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const prevSettings = (store.settings as any) || {};
        const prevAppeals = Array.isArray(prevSettings.appeals) ? prevSettings.appeals : [];

        const appealId = `appeal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const nowIso = new Date().toISOString();

        const appeal = {
            id: appealId,
            status: "OPEN",
            createdAt: nowIso,
            createdBy: "merchant", // Since it's from merchant side
            severity: "MEDIUM", // Default
            channel: channel || undefined,
            reason,
            message,
            customerEmail: customerEmail || undefined,
            customerPhone: customerPhone || undefined,
            evidenceUrls: Array.isArray(evidenceUrls) ? evidenceUrls : [],
            history: [
                {
                    at: nowIso,
                    by: "merchant",
                    type: "SUBMITTED",
                    status: "OPEN",
                    notes: message,
                },
            ],
        };

        const nextSettings = {
            ...prevSettings,
            appeals: [...prevAppeals, appeal],
        };

        await prisma.store.update({
            where: { id: storeId },
            data: { settings: nextSettings },
        });

        // TODO: Send notification to ops team about new appeal

        return NextResponse.json({
            success: true,
            appeal
        });
    } catch (error: any) {
        console.error("Submit appeal error:", error);
        return NextResponse.json({ error: "Failed to submit appeal" }, { status: 500 });
    }
});
