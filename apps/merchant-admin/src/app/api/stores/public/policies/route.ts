import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const storeId = searchParams.get("storeId");

  if (!slug && !storeId) {
    return NextResponse.json(
      { error: "Store identifier required" },
      { status: 400 },
    );
  }

  try {
    const store = await prisma.store.findFirst({
      where: {
        OR: [slug ? { slug } : {}, storeId ? { id: storeId } : {}],
      },
      select: { settings: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const settings: unknown = store.settings || {};
    const policies = settings.policies || {
      refundPolicy: "",
      shippingPolicy: "",
      termsOfService: "",
      privacyPolicy: "",
    };

    return NextResponse.json({
      ...policies,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch policies" },
      { status: 500 },
    );
  }
}
