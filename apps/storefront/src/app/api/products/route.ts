import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { PublicProduct } from '@/types/storefront';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    if (!storeId) {
        return NextResponse.json({ error: 'Store ID is required' }, { status: 400 });
    }

    try {
        const products = await prisma.product.findMany({
            where: { storeId: storeId as string },
            include: {
                ProductImage: true
            }
        });

        // Transform to PublicProduct format with explicit typing
        const publicProducts: PublicProduct[] = products.map((p: any) => ({
            id: p.id,
            storeId: p.storeId,
            name: p.title,
            description: p.description || '',
            price: Number(p.price),
            compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : undefined,
            // Explicitly cast the image map to avoid implicit any errors on 'a', 'b', 'img'
            images: p.ProductImage
                ?.sort((a: any, b: any) => a.position - b.position)
                .map((img: any) => img.url) || [],
            variants: [],
            inStock: true,
            handle: p.handle,
            type: 'physical'
        }));

        return NextResponse.json(publicProducts);
    } catch (error) {
        console.error('Failed to fetch products:', error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}
