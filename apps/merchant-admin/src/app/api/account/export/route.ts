import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
  PERMISSIONS.SETTINGS_VIEW,
  async (req: NextRequest, { user: sessionUser }: HandlerContext) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: sessionUser.id },
        include: {
          memberships: {
            include: {
              store: true,
            },
          },
        },
      });

      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const exportData = {
        generatedAt: new Date().toISOString(),
        user: {
          id: user.id,
          email: user.email,
          name: (user as any).name || `${(user as any).firstName || ""} ${(user as any).lastName || ""}`.trim(),
          createdAt: user.createdAt,
          memberships: user.memberships.map((m: any) => ({
            role: m.role,
            store: {
              id: m.store.id,
              name: m.store.name,
              slug: m.store.slug,
              createdAt: m.store.createdAt,
            },
          })),
        },
      };

      return NextResponse.json(exportData);
    } catch (error) {
      console.error("Export failed:", error);
      return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
  }
);
