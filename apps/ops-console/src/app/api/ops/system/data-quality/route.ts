import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withOpsAuth } from "@/lib/withOpsAuth";

/**
 * Data Quality Audit API for Ops Console.
 * Scans for orphaned records, negative totals, and stale drafts.
 */
export const GET = withOpsAuth(async (_req: NextRequest) => {
    try {
        interface QualityResults {
            orphanedOrders: number;
            negativeWallets: { storeId: string; storeName: string; balance: number }[];
            staleDrafts: number;
            orphanedItems: number;
            discrepancies: unknown[];
        }

        const results: QualityResults = {
            orphanedOrders: 0,
            negativeWallets: [],
            staleDrafts: 0,
            orphanedItems: 0,
            discrepancies: []
        };

        // 1. Scan for Orders without Customers
        const orphanedOrders = await prisma.order.count({
            where: {
                customerId: null,
                status: { not: "DRAFT" }
            }
        });
        results.orphanedOrders = orphanedOrders;

        // 2. Scan for Negative Wallet Balances
        const negativeWallets = await prisma.wallet.findMany({
            where: {
                availableKobo: { lt: 0 }
            },
            include: {
                store: {
                    select: { name: true }
                }
            }
        });
        results.negativeWallets = negativeWallets.map(w => ({
            storeId: w.storeId,
            storeName: w.store.name,
            balance: Number(w.availableKobo) / 100
        }));

        // 3. Scan for Stale Drafts (> 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const staleDrafts = await prisma.order.count({
            where: {
                status: "DRAFT",
                createdAt: { lt: thirtyDaysAgo }
            }
        });
        results.staleDrafts = staleDrafts;

        // 4. Scan for Products without a Store
        const orphanedItems = await prisma.product.count({
            where: {
                storeId: null as unknown as string
            }
        });
        results.orphanedItems = orphanedItems;

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: results
        });

    } catch (error: unknown) {
        console.error("[DataQuality Job] Failed:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to perform data quality scan"
        }, { status: 500 });
    }
}, { requiredRole: "OPS_OWNER" });

/**
 * Trigger remediation for a specific issue
 */
export const POST = withOpsAuth(async (req: NextRequest) => {
    try {
        const body = await req.json();
        const { type, action } = body;

        if (type === "cleanup-stale-drafts" && action === "DELETE") {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const deleted = await prisma.order.deleteMany({
                where: {
                    status: "DRAFT",
                    createdAt: { lt: thirtyDaysAgo }
                }
            });

            return NextResponse.json({ success: true, count: deleted.count });
        }

        return NextResponse.json({ error: "Unsupported remediation action" }, { status: 400 });

    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}, { requiredRole: "OPS_OWNER" });
