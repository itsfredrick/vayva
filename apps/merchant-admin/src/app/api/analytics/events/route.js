import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const POST = withVayvaAPI(PERMISSIONS.COMMERCE_VIEW, async (req, { storeId, user }) => {
    try {
        const body = await req.json();
        const { category, action, label, value, metadata, anonymousId, path } = body;
        if (!category || !action) {
            return NextResponse.json({ error: "Missing defined category or action" }, { status: 400 });
        }
        const userAgent = req.headers.get("user-agent") || undefined;
        const forwardedFor = req.headers.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0] : "127.0.0.1";
        const event = await prisma.analyticsEvent.create({
            data: {
                category,
                action,
                label,
                value: value ? Number(value) : 0,
                metadata: metadata || {},
                userId: user.id,
                storeId,
                anonymousId,
                userAgent,
                path,
                ip,
                timestamp: new Date(),
            },
        });
        return NextResponse.json({ success: true, id: event.id });
    }
    catch (error) {
        console.error("Analytics Ingestion Error:", error);
        return NextResponse.json({ error: "Failed to ingest event" }, { status: 500 });
    }
});
