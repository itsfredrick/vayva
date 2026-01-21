import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma, PolicyType } from "@/lib/prisma";
import { generateDefaultPolicies } from "@vayva/policies";

interface StoreSettings {
  supportWhatsApp?: string;
  supportEmail?: string;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    const user = session?.user as { storeId?: string; id: string } | undefined;

    if (!user?.storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.store.findUnique({
      where: { id: user.storeId },
      select: { name: true, slug: true, settings: true },
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Generate default policies
    const settings = (store.settings as unknown as StoreSettings) || {};
    const policies = generateDefaultPolicies({
      storeName: store.name,
      storeSlug: store.slug,
      merchantSupportWhatsApp: settings?.supportWhatsApp,
      supportEmail: settings?.supportEmail,
    });

    // Create policy records
    const created = await Promise.all(
      policies.map((policy: { type: string; title: string; contentMd: string }) =>
        prisma.merchantPolicy.upsert({
          where: {
            storeId_type: {
              storeId: user.storeId!,
              type: policy.type.toUpperCase().replace("-", "_") as PolicyType,
            },
          },
          create: {
            storeId: user.storeId!,
            merchantId: user.id,
            storeSlug: store.slug,
            type: policy.type.toUpperCase().replace("-", "_") as PolicyType,
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
