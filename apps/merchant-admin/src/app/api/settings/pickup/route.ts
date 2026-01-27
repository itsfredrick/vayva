import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { z } from "zod";
import { withVayvaAPI, APIContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { v4 as uuidv4 } from "uuid";

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
    createdAt: string;
    updatedAt: string;
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

export const GET = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (_req: NextRequest, { storeId, correlationId }: APIContext) => {
    try {
        const store = await prisma.store.findUnique({
            where: { id: storeId },
            select: { settings: true },
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found", correlationId }, { status: 404 });
        }

        const locations = normalizeLocations(store.settings);
        return NextResponse.json(locations);
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch pickup locations", correlationId }, { status: 500 });
    }
});

export const POST = withVayvaAPI(PERMISSIONS.SETTINGS_EDIT, async (req: NextRequest, { storeId, correlationId }: APIContext) => {
    try {
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
        const newLocation: StoredPickupLocation = {
            id: uuidv4(),
            name: data.name,
            address: data.address,
            city: data.city,
            state: data.state,
            isPickupPoint: data.isPickupPoint,
            isDefault: Boolean(data.isDefault),
            createdAt: now,
            updatedAt: now,
        };

        const nextList = existing.map((loc) => {
            if (newLocation.isDefault) {
                return { ...loc, isDefault: false, updatedAt: now };
            }
            return loc;
        });
        nextList.push(newLocation);

        await prisma.store.update({
            where: { id: storeId },
            data: {
                settings: {
                    ...currentSettings,
                    pickupLocations: nextList,
                } as any,
            },
        });

        return NextResponse.json({ success: true, id: newLocation.id });
    }
    catch (error: any) {
        return NextResponse.json({ error: "Failed to create pickup location", correlationId }, { status: 500 });
    }
});
