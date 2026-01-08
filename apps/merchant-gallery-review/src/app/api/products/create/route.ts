import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@vayva/db";
import { z } from "zod";

// Validation Schemas
const BaseProductSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.number().min(0),
    description: z.string().optional(),
    images: z.array(z.string()).optional(),
});

import { SCHEMA_MAP } from "@/lib/product-schemas";

export async function POST(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // 1. Fetch Merchant to know Category
        const store = await prisma.store.findUnique({
            where: { id: sessionUser.storeId },
            select: { category: true } // "food", "retail", "real-estate"
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const body = await request.json();

        // 2. Validate Base Fields
        const parseResult = BaseProductSchema.safeParse(body);
        if (!parseResult.success) {
            return NextResponse.json({ error: "Invalid product data", details: parseResult.error.flatten() }, { status: 400 });
        }
        const { name, price, description, images } = parseResult.data;
        const attributes = body.attributes || {};

        // 3. Validate Category Specific Attributes using Universal Schemas
        const schema = SCHEMA_MAP[store.category] || SCHEMA_MAP["retail"]; // Fallback to retail

        const attrParse = schema.safeParse(attributes);
        if (!attrParse.success) {
            return NextResponse.json({
                error: `Invalid attributes for category: ${store.category}`,
                details: attrParse.error.flatten()
            }, { status: 400 });
        }

        // 4. Create Product
        // We map 'name' to 'title' as per Prisma schema
        // We store 'attributes' in 'metadata' (JSONB)
        const product = await prisma.product.create({
            data: {
                storeId: sessionUser.storeId,
                title: name,
                handle: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(), // Simple slug generation
                price: price,
                description: description,
                metadata: attributes,
                // Default images handling would go here (creating ProductImage relations)
            }
        });

        return NextResponse.json({
            success: true,
            product: {
                id: product.id,
                name: product.title,
                metadata: product.metadata
            }
        });

    } catch (error) {
        console.error("Create product error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
