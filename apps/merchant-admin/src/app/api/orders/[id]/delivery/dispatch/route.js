import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@/lib/prisma";
import { getDeliveryProvider, } from "@/lib/delivery/DeliveryProvider";
import { FEATURES } from "@/lib/env-validation";
import { z } from "zod";
// Helper to bypass stale client types if models/fields are missing in generated client
const db = prisma;
// Zod Schema
const DispatchSchema = z.object({
    recipientName: z.string().min(2, "Receiver name required"),
    recipientPhone: z.string().regex(/^[0-9+ ]{10,15}$/, "Invalid phone number"),
    addressLine1: z.string().min(5, "Valid street address required"),
    addressCity: z.string().min(2, "City required"),
});
export const POST = withVayvaAPI(PERMISSIONS.COMMERCE_MANAGE, async (request, { storeId, params }) => {
    try {
        // NOTE: Next.js Route Handlers with generic wrappers might pass context slightly differently
        // but assuming withRBAC standardizes insertion of session.
        // We need to parse params from context.
        // The third arg in withRBAC handler is the original remaining args.
        const { id: orderId } = await params;
        // 1. Feature Flag Check
        if (!FEATURES.DELIVERY_ENABLED) {
            return NextResponse.json({
                code: "feature_not_configured",
                feature: "DELIVERY_ENABLED",
                message: "Delivery is disabled.",
            }, { status: 503 });
        }
        // 2. Load Store Settings
        const settings = await db.storeDeliverySettings.findUnique({
            where: { storeId },
        });
        if (!settings?.isEnabled) {
            return NextResponse.json({ error: "Delivery feature is not enabled for this store." }, { status: 400 });
        }
        if (!settings.pickupAddressLine1) {
            return NextResponse.json({
                error: "Store pickup address is missing. Please configure it in Delivery Settings.",
            }, { status: 400 });
        }
        // 3. Load Order with Shipment and Customer
        const order = await db.order.findUnique({
            where: { id: orderId, storeId },
            include: {
                Shipment: true,
                Customer: true,
            },
        });
        if (!order)
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        // Check if shipment is in terminal state
        if (order.Shipment) {
            const status = order.Shipment.status;
            if (["DELIVERED", "CANCELED", "FAILED"].includes(status)) {
                return NextResponse.json({ error: "Delivery is already finished (Terminal State)." }, { status: 409 });
            }
            if (["REQUESTED", "ACCEPTED", "PICKED_UP", "IN_TRANSIT"].includes(status)) {
                return NextResponse.json({ success: true, shipment: order.Shipment });
            }
        }
        // 4. Prepare Dispatch Data
        const recipientName = order.Shipment?.recipientName || order.Customer?.name || "Customer";
        const recipientPhone = order.Shipment?.recipientPhone ||
            order.customerPhone ||
            order.Customer?.phone ||
            "";
        const addressLine1 = order.Shipment?.addressLine1 || "";
        const addressCity = order.Shipment?.addressCity || "";
        // Kwik Validation
        if (settings.provider === "KWIK") {
            if (!recipientPhone || !addressLine1) {
                return NextResponse.json({
                    error: "Missing recipient phone or address required for Kwik dispatch.",
                }, { status: 400 });
            }
        }
        // ZOD VALIDATION
        const validation = DispatchSchema.safeParse({
            recipientName,
            recipientPhone,
            addressLine1,
            addressCity
        });
        if (!validation.success) {
            return NextResponse.json({
                error: "Validation Failed",
                details: validation.error.flatten().fieldErrors
            }, { status: 400 });
        }
        const dispatchData = {
            id: orderId,
            recipientName,
            recipientPhone,
            addressLine1,
            addressCity,
            parcelDescription: `Order #${order.orderNumber || order.refCode}`,
        };
        // 5. Get Provider and Dispatch
        let provider;
        try {
            provider = getDeliveryProvider(settings.provider);
        }
        catch (e) {
            return NextResponse.json({ error: `Invalid delivery provider configured: ${settings.provider}` }, { status: 400 });
        }
        const result = await provider.dispatch(dispatchData, settings);
        if (!result.success) {
            return NextResponse.json({ error: `Dispatch Failed: ${result.error}` }, { status: 502 });
        }
        // 6. Upsert Shipment
        const shipment = await db.shipment.upsert({
            where: { orderId },
            create: {
                storeId,
                orderId,
                provider: settings.provider,
                status: "REQUESTED",
                recipientName,
                recipientPhone,
                addressLine1,
                addressCity,
                trackingCode: result.providerJobId,
                trackingUrl: result.trackingUrl,
                notes: result.rawResponse
                    ? JSON.stringify(result.rawResponse)
                    : undefined,
            },
            update: {
                provider: settings.provider,
                status: "REQUESTED",
                trackingCode: result.providerJobId,
                trackingUrl: result.trackingUrl,
                notes: result.rawResponse
                    ? JSON.stringify(result.rawResponse)
                    : undefined,
            },
        });
        // 7. Log Event
        try {
            if (db.deliveryEvent) {
                await db.deliveryEvent.create({
                    data: {
                        shipmentId: shipment.id,
                        status: "REQUESTED",
                        note: `Dispatched via ${settings.provider} (Job: ${result.providerJobId})`,
                        providerStatus: "REQUESTED",
                    },
                });
            }
        }
        catch (e) {
            console.warn("Failed to create delivery event log:", e);
        }
        return NextResponse.json({ success: true, shipment });
    }
    catch (error) {
        console.error("Dispatch error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
});
