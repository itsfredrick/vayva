
import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const { user } = await OpsAuthService.requireSession();
        if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status") || "OPEN";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "20");
        const skip = (page - 1) * limit;

        const where: any = {
            status,
            // Fetch conversations tagged with SUPPORT or any conversation for support staff
            // In a real system, we might filter by a specific tag
            // tags: { has: "SUPPORT" } // Prisma has check for Json but requires it to be defined as String[] in schema or use raw
        };

        const [conversations, total] = await Promise.all([
            prisma.conversation.findMany({
                where,
                take: limit,
                skip,
                orderBy: { lastMessageAt: "desc" },
                include: {
                    store: { select: { name: true } },
                    contact: { select: { displayName: true, phoneE164: true } }
                }
            }),
            prisma.conversation.count({ where })
        ]);

        return NextResponse.json({
            data: conversations.map(c => ({
                id: c.id,
                storeName: c.store.name,
                customerName: c.contact.displayName || c.contact.phoneE164,
                lastMessageAt: c.lastMessageAt,
                status: c.status,
                unreadCount: c.unreadCount
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error: any) {
        if (error.message === "Unauthorized") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
