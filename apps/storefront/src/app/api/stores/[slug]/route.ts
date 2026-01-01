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

    // Transform to PublicStore format if necessary
    const publicStore = {
      id: store.id,
      name: store.name,
      slug: store.slug,
      logo: store.logoUrl, // Check schema for actual field name
      theme: (store.settings as any)?.theme || {},
      plan: "FREE", // tested/derived
    };

    return NextResponse.json(publicStore);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch store" },
      { status: 500 },
    );
  }
}
