import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { z } from "zod";
import { withVayvaAPI, APIContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

const DeliverySettingsSchema = z.object({
    isEnabled: z.boolean(),
    deliveryRadiusKm: z.coerce.number().min(1),
    baseDeliveryFee: z.coerce.number().min(0),
    deliveryFeeType: z.enum(["FLAT", "DISTANCE"]),
    allowSelfPickup: z.boolean(),
    selfDeliveryEnabled: z.boolean(),
});

type DeliverySettingsPayload = z.infer<typeof DeliverySettingsSchema>;

function getSettingsObject(raw: any) {
    if (!raw)
        return {};
    if (typeof raw === "object")
        return raw as any;
    return {};
}

function getDeliveryConfigFromStoreSettings(rawSettings: any): DeliverySettingsPayload {
    const settings = getSettingsObject(rawSettings);
    const cfg = (settings as any).deliveryConfig || {};

    return {
        isEnabled: false,
        deliveryRadiusKm: Number(cfg.deliveryRadiusKm ?? 10),
        baseDeliveryFee: Number(cfg.baseDeliveryFee ?? 1000),
        deliveryFeeType: (cfg.deliveryFeeType === "DISTANCE" ? "DISTANCE" : "FLAT"),
        allowSelfPickup: Boolean(cfg.allowSelfPickup ?? false),
        selfDeliveryEnabled: Boolean(cfg.selfDeliveryEnabled ?? false),
    };
}

export const GET = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (_req: NextRequest, { storeId, correlationId }: APIContext) => {
    try {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: {
                settings: true,
                deliverySettings: { select: { isEnabled: true } },
            },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found", correlationId }, { status: 404 });
        }

        const cfg = getDeliveryConfigFromStoreSettings(store.settings);
        return NextResponse.json({
            ...cfg,
            isEnabled: Boolean(store.deliverySettings?.isEnabled ?? false),
        });
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch delivery settings", correlationId }, { status: 500 });
    }
});

export const POST = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (req: NextRequest, { storeId, correlationId }: APIContext) => {
    try {
        const body = await req.json();
        const parsed = DeliverySettingsSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input", correlationId, details: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const data = parsed.data;

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: {
                settings: true,
                deliverySettings: { select: { provider: true } },
            },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found", correlationId }, { status: 404 });
        }

        const currentSettings = getSettingsObject(store.settings);
        const nextSettings = {
            ...currentSettings,
            deliveryConfig: {
                deliveryRadiusKm: data.deliveryRadiusKm,
                baseDeliveryFee: data.baseDeliveryFee,
                deliveryFeeType: data.deliveryFeeType,
                allowSelfPickup: data.allowSelfPickup,
                selfDeliveryEnabled: data.selfDeliveryEnabled,
            },
        };

        await prisma.$transaction([
            prisma.store.update({
                where: { id: storeId },
                data: { settings: nextSettings as any },
            }),
            prisma.storeDeliverySettings.upsert({
                where: { storeId },
                create: {
                    storeId,
                    isEnabled: data.isEnabled,
                    provider: store.deliverySettings?.provider || "CUSTOM",
                },
                update: {
                    isEnabled: data.isEnabled,
                },
            }),
        ]);

        return NextResponse.json({ success: true });
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to save delivery settings", correlationId }, { status: 500 });
    }
});
