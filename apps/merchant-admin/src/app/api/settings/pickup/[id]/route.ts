import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { z } from "zod";
import { withVayvaAPI, APIContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

const PickupLocationSchema = z.object({
    name: z.string().min(2),
    address: z.string().min(5),
    city: z.string().min(2),
    state: z.string().min(2),
    isPickupPoint: z.boolean(),
    isDefault: z.boolean().optional(),
});

type PickupLocationPayload = z.infer<typeof PickupLocationSchema>;

type StoredPickupLocation = PickupLocationPayload & {
    id: string;
    createdAt?: string;
    updatedAt?: string;
};

function getSettingsObject(raw: any) {
    if (!raw)
        return {};
    if (typeof raw === "object")
        return raw as any;
    return {};
}

function normalizeLocations(rawSettings: any): StoredPickupLocation[] {
    const settings = getSettingsObject(rawSettings);
    const list = (settings as any).pickupLocations;
    if (!Array.isArray(list))
        return [];
    return list.filter(Boolean);
}

export const PUT = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (req: NextRequest, { storeId, params, correlationId }: APIContext) => {
    try {
        const id = params?.id;
        if (!id) {
            return NextResponse.json({ error: "Missing id", correlationId }, { status: 400 });
        }

        const body = await req.json();
        const parsed = PickupLocationSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input", correlationId, details: parsed.error.flatten().fieldErrors }, { status: 400 });
        }

        const data = parsed.data;

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { settings: true },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found", correlationId }, { status: 404 });
        }

        const currentSettings = getSettingsObject(store.settings);
        const existing = normalizeLocations(store.settings);
        const now = new Date().toISOString();

        const idx = existing.findIndex((l) => l.id === id);
        if (idx === -1) {
            return NextResponse.json({ error: "Not found", correlationId }, { status: 404 });
        }

        const updated: StoredPickupLocation = {
            ...existing[idx],
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            isPickupPoint: data.isPickupPoint,
            isDefault: Boolean(data.isDefault),
            updatedAt: now,
        };

        const nextList = existing.map((loc) => {
            if (loc.id === id) {
                return updated;
            }
            if (updated.isDefault) {
                return { ...loc, isDefault: false, updatedAt: now };
            }
            return loc;
        });

        await prisma.store.update({
            where: { id: storeId },
            data: {
                settings: {
                    ...currentSettings,
                    pickupLocations: nextList,
                } as any,
            },
        });

        return NextResponse.json({ success: true });
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to update pickup location", correlationId }, { status: 500 });
    }
});

export const DELETE = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (_req: NextRequest, { storeId, params, correlationId }: APIContext) => {
    try {
        const id = params?.id;
        if (!id) {
            return NextResponse.json({ error: "Missing id", correlationId }, { status: 400 });
        }

        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { settings: true },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found", correlationId }, { status: 404 });
        }

        const currentSettings = getSettingsObject(store.settings);
        const existing = normalizeLocations(store.settings);
        const nextList = existing.filter((l) => l.id !== id);

        if (nextList.length === existing.length) {
            return NextResponse.json({ error: "Not found", correlationId }, { status: 404 });
        }

        await prisma.store.update({
            where: { id: storeId },
            data: {
                settings: {
                    ...currentSettings,
                    pickupLocations: nextList,
                } as any,
            },
        });

        return NextResponse.json({ success: true });
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to delete pickup location", correlationId }, { status: 500 });
    }
});
