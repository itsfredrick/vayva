import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
// Only allow in development or test env
const IS_TEST_ENV = process.env.NODE_ENV !== "production";
export async function POST(req: any) {
    if (!IS_TEST_ENV) {
        return new NextResponse("Not Allowed", { status: 403 });
    }
    try {
        const body = await req.json();
        const storeSlug = body.slug || "test-store-qa";
        // Check if exists
        let store = await prisma.store.findUnique({ where: { slug: storeSlug } });
        if (!store) {
            // Create Merchant User
            const email = `owner-${Date.now()}@example.com`;
            const hashedPassword = await hash("password123", 10);
            const user = await prisma.user.create({
                data: {
                    email,
                    password: hashedPassword,
                },
            });
            // Create Store
            store = await prisma.store.create({
                data: {
                    name: "QA Test Store",
                    slug: storeSlug,
                    onboardingCompleted: true, // Bypass onboarding
                    memberships: {
                        create: { userId: user.id, role_enum: "OWNER" },
                    },
                },
            });
            // Create Product
            await prisma.product.create({
                data: {
                    storeId: store.id,
                    title: "QA Test Product",
                    handle: "qa-test-product",
                    price: 5000,
                    status: "ACTIVE",
                },
            });
        }
        return NextResponse.json({
            success: true,
            storeId: store.id,
            slug: store.slug,
        });
    }
    catch (e) {
        return new NextResponse(e.message, { status: 500 });
    }
}
