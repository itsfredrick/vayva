import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type Handler = (req: NextRequest, context: any) => Promise<NextResponse>;

export function withPermission(permission: string) {
    return function (handler: Handler): Handler {
        return async (req: NextRequest, context: any): Promise<NextResponse> => {
            const session = await getSessionUser();
            if (!session) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            // Implement actual permission check using session.storeId/userId
            const membership = await (prisma as any).membership.findUnique({
                where: {
                    userId_storeId: {
                        userId: session.id,
                        storeId: session.storeId,
                    },
                },
                include: {
                    role: {
                        include: {
                            permissions: true,
                        },
                    },
                },
            });

            if (!membership) {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }

            const hasPermission = membership.role?.permissions.some(
                (p: any) => p.code === permission
            );

            if (!hasPermission && membership.role_enum !== "OWNER") {
                return NextResponse.json({ error: "Forbidden" }, { status: 403 });
            }

            return handler(req, context);
        };
    };
}
