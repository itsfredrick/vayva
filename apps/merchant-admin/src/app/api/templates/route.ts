import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
export const GET = withVayvaAPI(PERMISSIONS.COMMERCE_VIEW, async (request: NextRequest, { storeId }: HandlerContext) => {
  try {
    const templates = await prisma.template.findMany({
      where: { isActive: true },
      orderBy: { stars: "desc" },
    });

    const formatted = templates.map((t: unknown) => ({
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
