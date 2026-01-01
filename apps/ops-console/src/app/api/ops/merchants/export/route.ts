import { NextRequest, NextResponse } from "next/server";
import { OpsAuthService } from "@/lib/ops-auth";
import { prisma } from "@vayva/db";

export async function GET(req: NextRequest) {
    try {
        await OpsAuthService.requireSession();

        // 1. Fetch Data
        const merchants = await prisma.store.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                isLive: true,
                plan: true,
                category: true,
                createdAt: true,
                tenantId: true, // Owner ID usually
            },
            orderBy: { createdAt: "desc" },
        });

        // 2. CSV Header
        const header = ["ID,Name,Slug,Live Status,Plan,Category,Created At,Owner ID"];

        // 3. Map Rows
        const rows = merchants.map(m => {
            return [
                m.id,
                `"${m.name.replace(/"/g, '""')}"`, // Escape quotes
                m.slug,
                m.isLive ? "Active" : "Inactive",
                m.plan,
                m.category,
                m.createdAt.toISOString(),
                m.tenantId || "N/A"
            ].join(",");
        });

        const csvContent = [header, ...rows].join("\n");

        // 4. Return as csv file
        return new NextResponse(csvContent, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="merchants_export_${new Date().toISOString().split('T')[0]}.csv"`,
            },
        });

    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
