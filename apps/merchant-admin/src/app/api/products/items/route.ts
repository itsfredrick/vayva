import { NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { withRBAC } from '@/lib/team/rbac';
import { PERMISSIONS } from '@/lib/team/permissions';

export const GET = withRBAC(PERMISSIONS.COMMERCE_VIEW, async (session: any, request: Request) => {
    try {
        const storeId = session.user.storeId;
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const where: any = { storeId };
        if (status) where.status = status;

        const products = await prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        });

        const formattedProducts = products.map((product: any) => ({
            id: product.id,
            merchantId: product.storeId,
            type: 'RETAIL',
            name: product.title,
            description: product.description || '',
            price: Number(product.price),
            currency: 'NGN',
            status: product.status,
            inventory: {
                enabled: product.trackInventory,
                quantity: 0,
            },
            itemsSold: 0,
            createdAt: product.createdAt.toISOString(),
        }));

        return NextResponse.json(formattedProducts);
    } catch (error) {
        console.error("Fetch Products Error:", error);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
});

export const POST = withRBAC(PERMISSIONS.COMMERCE_MANAGE, async (session: any, request: Request) => {
    try {
        const storeId = session.user.storeId;
        const userId = session.user.id;
        const body = await request.json();

        const product = await prisma.product.create({
            data: {
                storeId,
                title: body.name,
                description: body.description,
                handle: body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.random().toString(36).substring(2, 7),
                price: body.price,
                status: 'ACTIVE',
                productType: body.type,
            }
        });

        const activationEvent = null; // Deprecated firstProductAt logic

        return NextResponse.json(product);
    } catch (error: any) {
        console.error("Create Product Error:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
});
