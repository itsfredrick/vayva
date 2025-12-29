import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { PublicMenu, PublicWeek, PublicProduct } from '@/types/storefront';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug') || 'chopnow-demo'; // Default for demo

    try {
        const store = await prisma.store.findUnique({
            where: { slug }
        });

        if (!store) {
            return NextResponse.json({ error: 'Store not found' }, { status: 404 });
        }

        const collections = await prisma.collection.findMany({
            where: { storeId: store.id },
            include: {
                CollectionProduct: {
                    include: {
                        Product: true
                    }
                }
            }
        });

        const products = await prisma.product.findMany({
            where: { storeId: store.id },
            include: {
                ProductImage: true
            }
        });

        const weeks: PublicWeek[] = collections
            .filter((c: any) => c.handle.startsWith('week-'))
            .map((c: any) => {
                const datePart = c.handle.replace('week-', '');
                const deliveryDate = new Date(datePart);
                const cutoffDate = new Date(deliveryDate);
                cutoffDate.setDate(deliveryDate.getDate() - 5);

                return {
                    id: c.id,
                    label: { tr: c.title, en: c.title },
                    deliveryDate: datePart,
                    cutoffDate: cutoffDate.toISOString(),
                    isLocked: new Date() > cutoffDate
                };
            })
            .sort((a, b) => a.deliveryDate.localeCompare(b.deliveryDate));

        const meals: PublicProduct[] = products.map((p: any) => {
            const tagsObj: any = {};
            // Parse tags... logic remains same but typed output
            p.tags.forEach((tag: string) => {
                const [key, val] = tag.split(':');
                if (key !== 'allergen' && key !== 'isPro') {
                    tagsObj[key] = val;
                    // Try parse number
                    if (['prepTime', 'kcal', 'protein'].includes(key)) {
                        tagsObj[key] = parseInt(val) || 0;
                    }
                }
            });

            // Default if missing
            if (!tagsObj.category) tagsObj.category = 'General';

            return {
                id: p.id,
                storeId: p.storeId,
                name: p.title,
                description: p.description || '',
                price: Number(p.price) || 0,
                images: p.ProductImage?.map((img: any) => img.url) || [],
                variants: [],
                inStock: true,
                category: tagsObj.category,
                // Extra fields stored in tags for specific template can be part of 'specs' or custom fields
                // For now mapping to PublicProduct standard fields
                handle: p.handle
            };
        });

        const response: PublicMenu = {
            weeks,
            meals
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
    }
}
