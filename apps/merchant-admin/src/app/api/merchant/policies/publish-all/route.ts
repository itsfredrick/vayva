import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { generateDefaultPolicies } from "@vayva/policies";
export async function POST(req: any) {
    try {
        const session = await getServerSession();
        if (!session?.user?.storeId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const body = await req.json();
        const { publishMissing = false } = body;
        // Get all policies for this store
        const policies = await prisma.merchantPolicy.findMany({
            where: { storeId: session.user.storeId },
        });
        // If publishMissing and we don't have 5 policies, generate them first
        if (publishMissing && policies.length < 5) {
            const user = session.user as any;
            if (!user?.id) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const store = await prisma.store.findUnique({
                where: { id: session.user.storeId },
                select: { name: true, slug: true, settings: true },
            });

            if (!store) {
                return NextResponse.json({ error: "Store not found" }, { status: 404 });
            }

            const settings = (store.settings as any) || {};
            const storeSlug = store.slug || `${store.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${session.user.storeId.slice(0, 8)}`;
            const generated = generateDefaultPolicies({
                storeName: store.name,
                storeSlug,
                merchantSupportWhatsApp: settings?.supportWhatsApp,
                supportEmail: settings?.supportEmail,
                pickupAddress: settings?.pickupAddress,
                deliveryCities: settings?.deliveryCities,
                returnsWindowDays: settings?.returnsWindowDays,
                refundWindowDays: settings?.refundWindowDays,
                dispatchMode: settings?.dispatchMode,
                partnerName: settings?.partnerName,
            });

            await prisma.$transaction(
                generated.map((policy: any) =>
                    prisma.merchantPolicy.upsert({
                        where: {
                            storeId_type: {
                                storeId: session.user.storeId,
                                type: policy.type.toUpperCase().replace("-", "_") as any,
                            },
                        },
                        create: {
                            storeId: session.user.storeId,
                            merchantId: user.id,
                            storeSlug,
                            type: policy.type.toUpperCase().replace("-", "_") as any,
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
        }
        // Publish all policies
        const policyTypes = [
            "TERMS",
            "PRIVACY",
            "RETURNS",
            "REFUNDS",
            "SHIPPING_DELIVERY",
        ];
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const results = await prisma.$transaction(policyTypes.map((type: any) => prisma.merchantPolicy.updateMany({
            where: {
                storeId: session.user.storeId,
                type: type,
            },
            data: {
                status: "PUBLISHED",
                publishedAt: new Date(),
                lastUpdatedLabel: today,
                publishedVersion: { increment: 1 },
            },
        })));
        const publishedCount = results.reduce((sum: number, r: any) => sum + (r?.count || 0), 0);
        return NextResponse.json({ ok: true, publishedCount });
    }
    catch (error: any) {
        console.error("Error publishing policies:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
