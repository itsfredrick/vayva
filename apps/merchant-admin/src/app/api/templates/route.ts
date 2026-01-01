import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withRBAC } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withRBAC(PERMISSIONS.COMMERCE_VIEW, async (session: any) => {
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: { stars: "desc" },
    });

    const formatted = templates.map((t) => ({
      id: t.id,
      key: t.slug,
      name: t.name,
      description: t.description,
      isFree: t.isFree,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("Fetch Templates Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 },
    );
  }
});
