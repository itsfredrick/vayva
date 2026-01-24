import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { generateDefaultPolicies } from "@vayva/policies";
export async function POST(req: any) {
    try {
        const session = await getServerSession();
        const user = session?.user;
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
        const settings = (store.settings as any) || {};
        const policies = generateDefaultPolicies({
            storeName: store.name,
            storeSlug: store.slug,
            merchantSupportWhatsApp: settings?.supportWhatsApp,
            supportEmail: settings?.supportEmail,
        });
        // Create policy records
        const created = await Promise.all(policies.map((policy: any) => prisma.merchantPolicy.upsert({
            where: {
                storeId_type: {
                    storeId: user.storeId,
                    type: policy.type.toUpperCase().replace("-", "_"),
                },
            },
            create: {
                storeId: user.storeId,
                merchantId: user.id,
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
        })));
        return NextResponse.json({ policies: created });
    }
    catch (error: any) {
        console.error("Error generating policies:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
