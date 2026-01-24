import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { prisma } from "@vayva/db";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (req, { storeId }) => {
    try {
        const prefs = await prisma.notificationPreference.findUnique({
            where: { storeId },
        });
        // Default UI state
        const defaultState = {
            orders_email: true,
            orders_push: true,
            payouts_email: true,
            payouts_push: false,
            security_email: true,
            security_push: true,
            marketing_email: false,
        };
        if (!prefs || !prefs.categories) {
            return NextResponse.json(defaultState);
        }
        // Map DB nested JSON back to UI flat keys
        // Assuming db.categories structure: { orders: { email: boolean, push: boolean }, ... }
        const cats: any = prefs.categories;
        const response = {
            orders_email: cats.orders?.email ?? defaultState.orders_email,
            orders_push: cats.orders?.push ?? defaultState.orders_push,
            payouts_email: cats.payouts?.email ?? defaultState.payouts_email,
            payouts_push: cats.payouts?.push ?? defaultState.payouts_push,
            security_email: true, // Always true
            security_push: true, // Always true
            marketing_email: cats.marketing?.email ?? defaultState.marketing_email,
        };
        return NextResponse.json(response);
    }
    catch (error: any) {
        console.error("[NOTIFICATIONS_GET]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
export const POST = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (req, { storeId }) => {
    try {
        const body = await req.json();
        // Construct DB structure
        const categories = {
            orders: {
                email: body.orders_email,
                push: body.orders_push,
            },
            payouts: {
                email: body.payouts_email,
                push: body.payouts_push,
            },
            marketing: {
                email: body.marketing_email,
                push: false
            },
            security: {
                email: true,
                push: true
            }
        };
        // Ensure creation of preference record if missing
        await prisma.notificationPreference.upsert({
            where: { storeId },
            create: {
                storeId,
                categories,
                channels: {
                    email: true,
                    push: true,
                    whatsapp: true,
                    in_app: true
                }
            },
            update: {
                categories,
            },
        });
        return NextResponse.json({ success: true, message: "Preferences saved" });
    }
    catch (error: any) {
        console.error("[NOTIFICATIONS_POST]", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
});
