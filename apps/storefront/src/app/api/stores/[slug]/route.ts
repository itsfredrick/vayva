
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const store = await prisma.store.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        settings: true,
        plan: true,
        isLive: true,
        isActive: true,
      },
    });

    if (!store || !store.isActive || !store.isLive) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Public API only serves published storefront config
    let activeConfig: any = null;

    const published = await prisma.storefrontPublished.findUnique({
      where: { storeId: store.id },
    });
    if (published) {
      activeConfig = {
        theme: published.themeConfig,
        sections: published.sectionConfig,
        order: (published as any).sectionOrder || [],
        templateId: published.activeTemplateId,
      };
    }

    // Transform to PublicStore format
    const publicStore = {
      id: store.id,
      name: store.name,
      slug: store.slug,
      logo: store.logoUrl,
      theme: activeConfig || ((store.settings as any) as any)?.theme || { templateId: "vayva-standard" },
      plan: store.plan,
      isLive: store.isLive,
    };

    return NextResponse.json(publicStore);
  } catch (error: any) {
    console.error("Storefront API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 },
    );
  }
}
