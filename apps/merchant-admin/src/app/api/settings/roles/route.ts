import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/settings/roles
 * List custom roles for the current store.
 */
export async function GET(req: NextRequest) {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const roles = await prisma.role.findMany({
        where: { storeId: session.storeId },
        include: {
            rolePermissions: {
                include: {
                    permission: true
                }
            },
            _count: {
                select: { memberships: true }
            }
        }
    });

    return NextResponse.json(roles);
}

/**
 * POST /api/settings/roles
 * Create or update a custom role.
 */
export async function POST(req: NextRequest) {
    const session = await getSessionUser();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { id, name, description, permissionIds } = await req.json();

        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const role = await prisma.$transaction(async (tx) => {
            // 1. Create/Update the role
            const r = await tx.role.upsert({
                where: { id: id || "new-role" },
                update: { name, description },
                create: {
                    storeId: session.storeId,
                    name,
                    description
                }
            });

            // 2. Sync permissions
            if (permissionIds && Array.isArray(permissionIds)) {
                // Delete old
                await tx.rolePermission.deleteMany({ where: { roleId: r.id } });

                // Map permission strings to Permission table IDs (or create them)
                // Note: Our permission strings are stored in Permission.name
                for (const permName of permissionIds) {
                    let p = await tx.permission.findFirst({ where: { key: permName } });
                    if (!p) {
                        p = await tx.permission.create({ data: { key: permName, group: "custom" } });
                    }
                    await tx.rolePermission.create({
                        data: {
                            roleId: r.id,
                            permissionId: p.id
                        }
                    });
                }
            }

            return r;
        });

        return NextResponse.json(role);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
