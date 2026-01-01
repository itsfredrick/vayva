import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = (session.user as any).storeId;
    if (!storeId) {
      return NextResponse.json({ error: "No store context" }, { status: 400 });
    }

    const body = await req.json();
    const { scope, sectionId } = body;
    // scope: 'ALL' | 'THEME' | 'SECTION'

    const draft = await prisma.storefrontDraft.findUnique({
      where: { storeId },
      include: { template: true },
    });

    if (!draft) {
      return NextResponse.json({ error: "No draft to reset" }, { status: 404 });
    }

    if (scope === "ALL") {
      // Revert to template defaults
      // Ideally we parse draft.template.configSchema for defaults
      // For now we just empty the configs, assuming internal defaults take over
      await prisma.storefrontDraft.update({
        where: { storeId },
        data: {
          themeConfig: {},
          sectionConfig: {},
          // sectionOrder: ... // Should we reset order? "Reset entire template" implies yes.
          // But we need the DEFAULT section order.
          // Let's assume we keep the 'sectionOrder' as is OR reset to empty if the template defines a structure?
          // If the template defines structure, we'd need that info.
          // For V1, let's reset theme and section configs to empty.
        },
      });
    } else if (scope === "THEME") {
      await prisma.storefrontDraft.update({
        where: { storeId },
        data: { themeConfig: {} },
      });
    } else if (scope === "SECTION") {
      if (!sectionId)
        return NextResponse.json(
          { error: "Missing sectionId" },
          { status: 400 },
        );

      // Reset specific section config
      const currentSectionConfig =
        (draft.sectionConfig as Record<string, any>) || {};
      const newSectionConfig = { ...currentSectionConfig };
      delete newSectionConfig[sectionId]; // Removing it reverts to default

      await prisma.storefrontDraft.update({
        where: { storeId },
        data: { sectionConfig: newSectionConfig },
      });
    } else {
      return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/storefront/reset error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
