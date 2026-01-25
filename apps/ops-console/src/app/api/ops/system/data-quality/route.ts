import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

/**
 * Data Quality Audit API for Ops Console.
 * Scans for orphaned records, negative totals, and stale drafts.
 */
export async function GET(_req: NextRequest) {
    try {
        const { user } = await OpsAuthService.requireSession();
        OpsAuthService.requireRole(user, "OPS_OWNER");
        interface QualityResults {
            orphanedOrders: number;
            negativeWallets: { storeId: string; storeName: string; balance: number }[];
            staleDrafts: number;
            orphanedItems: number;
            discrepancies: any[];
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
            storeId: (w as any).storeId,
            storeName: (w as any).store.name,
            balance: Number((w as any).availableKobo) / 100
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
                storeId: null as any as string
            }
        });
        results.orphanedItems = orphanedItems;

        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: results
        });

    } catch (error: any) {
        console.error("[DataQuality Job] Failed:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to perform data quality scan"
        }, { status: 500 });
    }
}

/**
 * Trigger remediation for a specific issue
 */
export async function POST(req: NextRequest) {
    try {
        const { user } = await OpsAuthService.requireSession();
        OpsAuthService.requireRole(user, "OPS_OWNER");
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

    } catch (error: any) {
        const err = error as Error;
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
