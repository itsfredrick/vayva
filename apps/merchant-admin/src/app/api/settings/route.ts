import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI, APIContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { sanitizeHTML } from "@/lib/sanitization";
import { z } from "zod";

const SettingsSchema = z.object({
    name: z.string().min(1).optional(),
    supportEmail: z.string().email().optional(),
    businessCategory: z.string().optional(),
});

export const PATCH = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (req: NextRequest, { storeId, correlationId }: APIContext) => {
    try {
        const body = await req.json();
        const parsed = SettingsSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: "Invalid input", correlationId }, { status: 400 });
        }
        const data = parsed.data;
        await prisma.store.update({
            where: { id: storeId },
            data: {
                ...(data.name && { name: sanitizeHTML(data.name) }),
                ...(data.supportEmail && { supportEmail: data.supportEmail }),
                ...(data.businessCategory && { category: sanitizeHTML(data.businessCategory || "") }),
            }
        });
        return NextResponse.json({ success: true });
    }
    catch (error) {
        console.error("Settings update error:", error);
        return NextResponse.json({ error: "Internal server error", correlationId }, { status: 500 });
    }
});
