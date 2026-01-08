import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@vayva/db";
// @ts-ignore
import { generateDefaultPolicies } from "@vayva/policies";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!(session?.user as any)?.storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { id: (session!.user as any).storeId },
      select: { name: true, slug: true, settings: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Generate default policies
    const policies = generateDefaultPolicies({
      storeName: store.name,
      storeSlug: store.slug,
      merchantSupportWhatsApp: (store.settings as any)?.supportWhatsApp,
      supportEmail: (store.settings as any)?.supportEmail,
    });

    // Create policy records
    const created = await Promise.all(
      policies.map((policy: any) =>
        prisma.merchantPolicy.upsert({
          where: {
            storeId_type: {
              storeId: (session!.user as any).storeId,
              type: policy.type.toUpperCase().replace("-", "_"),
            },
          },
          create: {
            storeId: (session!.user as any).storeId,
            merchantId: (session!.user as any).id,
            storeSlug: store.slug,
            type: policy.type.toUpperCase().replace("-", "_"),
            title: policy.title,
            contentMd: policy.contentMd,
            status: "DRAFT",
          },
          update: {
            title: policy.title,
            contentMd: policy.contentMd,
          },
        }),
      ),
    );

    return NextResponse.json({ policies: created });
  } catch (error) {
    console.error("Error generating policies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
