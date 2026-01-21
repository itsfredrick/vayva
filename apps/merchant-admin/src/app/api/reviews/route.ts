import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
    PERMISSIONS.PRODUCTS_VIEW,
    async (req: NextRequest, { storeId }: HandlerContext) => {
        try {
            const reviews = await prisma.review.findMany({
                where: { storeId },
                orderBy: { createdAt: "desc" },
            });

            // Fetch basic product info manually since relation might not be established in schema
            const productIds = reviews
                .map((r: any) => r.productId)
                .filter((id: string | null): id is string => id !== null);

            const products = await prisma.product.findMany({
                where: { id: { in: productIds } },
                select: { id: true, title: true, handle: true },
            });

            const productMap = new Map(products.map((p: any) => [p.id, p]));

            const formatted = reviews.map((review: any) => ({
                id: review.id,
                rating: review.rating,
                title: review.title,
                status: review.status,
                customerName: "Anonymous Customer", // Schema has customerId but no relation shown in snippet
                product: review.productId ? productMap.get(review.productId)?.title : "Unknown Product",
                createdAt: review.createdAt,
            }));

            return NextResponse.json({ success: true, data: formatted });
        } catch (error) {
            console.error("Reviews API Error:", error);
            return NextResponse.json(
                { error: "Failed to fetch reviews" },
                { status: 500 }
            );
        }
    }
);
