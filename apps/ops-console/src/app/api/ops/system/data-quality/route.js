import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
/**
 * Data Quality Audit API for Ops Console.
 * Scans for orphaned records, negative totals, and stale drafts.
 */
export async function GET(req) {
    // Note: Ops Middleware handles session verification
    try {
        const results = {
            orphanedOrders: 0,
            negativeWallets: [],
            staleDrafts: 0,
            orphanedItems: 0,
            discrepancies: []
        };
        // 1. Scan for Orders without Customers (if customerId is non-nullable in business logic but nullable in DB)
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
        // 4. Scan for Products without a Store (Items with null storeId if applicable)
        const orphanedItems = await prisma.product.count({
            where: {
                storeId: null // Type safety may vary
            }
        });
        results.orphanedItems = orphanedItems;
        return NextResponse.json({
            success: true,
            timestamp: new Date().toISOString(),
            data: results
        });
    }
    catch (error) {
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
export async function POST(req) {
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
    }
    catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
