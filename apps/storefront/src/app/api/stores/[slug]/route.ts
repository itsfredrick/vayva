
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
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const isPreview = searchParams.get("preview") === "true";

    // Fetch published version or draft
    let activeConfig: unknown = null;

    if (isPreview) {
      const draft = await prisma.storefrontDraft.findUnique({
        where: { storeId: store.id },
      });
      if (draft) {
        activeConfig = {
          theme: draft.themeConfig,
          sections: draft.sectionConfig,
          order: draft.sectionOrder,
          templateId: draft.activeTemplateId,
        };
      }
    } else {
      const published = await prisma.storefrontPublished.findUnique({
        where: { storeId: store.id },
      });
      if (published) {
        activeConfig = {
          theme: published.themeConfig,
          sections: published.sectionConfig,
          order: (published as unknown).sectionOrder || [],
          templateId: published.activeTemplateId,
        };
      }
    }

    // Transform to PublicStore format
    const publicStore = {
      id: store.id,
      name: store.name,
      slug: store.slug,
      logo: store.logoUrl,
      theme: activeConfig || (store.settings as unknown)?.theme || { templateId: "vayva-standard" },
      plan: store.plan,
      isLive: store.isLive,
    };

    return NextResponse.json(publicStore);
  } catch (error) {
    console.error("Storefront API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 },
    );
  }
}
