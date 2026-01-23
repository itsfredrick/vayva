
import { prisma } from "@/lib/prisma";
import { MobileCategoryHeader } from "@/components/mobile/MobileCategoryHeader";
import { Star, Clock, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MarketProduct } from "@vayva/shared";

interface CategoryPageProps {
    params: { slug: string };
}

interface Store {
    id: string;
    name: string;
    slug: string;
    bannerUrl?: string | null;
    bio?: string | null;
}


export default async function CategoryPage({ params }: CategoryPageProps) {
    const slug = params.slug;
    const isFood = slug === "food";
    const title = slug.charAt(0).toUpperCase() + slug.slice(1);

    // Dynamic Data Fetching
    let items: Store[] | MarketProduct[] = [];

    if (isFood) {
        // Fetch Restaurants
        const stores = await prisma.store.findMany({
            where: {
                OR: [
                    { category: 'food' },
                    { category: 'restaurant' },
                    { industrySlug: 'food-beverage' }
                ],
                isLive: true
            },
            take: 20
        });
        items = stores as unknown as Store[];
    } else {
        // Fetch Products
        const products = await prisma.product.findMany({
            where: {
                productType: { contains: slug, mode: 'insensitive' }, // Simple keyword match
                status: 'PUBLISHED'
            },
            include: {
                productImages: true,
                store: true
            },
            take: 20
        });
        items = products as unknown as MarketProduct[];
    }

    return (
        <div className="pb-24">
            <MobileCategoryHeader title={title} />

            <div className="p-4">
                {isFood ? (
                    <div className="space-y-6">
                        {/* Food View: Vertical List of Restuarants */}
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold text-lg">Featured Restaurants</h2>
                        </div>

                        {items.length === 0 ? (
                            <p className="text-gray-500 text-center py-10">No restaurants found.</p>
                        ) : (
                            (items as Store[]).map((store) => (
                                <Link href={`/store/${store.slug}`} key={store.id} className="block group">
                                    <div className="relative h-40 bg-gray-100 rounded-xl overflow-hidden mb-3">
                                        {store.bannerUrl ? (
                                            <Image
                                                src={store.bannerUrl}
                                                alt={store.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <span className="text-4xl font-bold opacity-20">{store.name ? store.name[0] : ''}</span>
                                            </div>
                                        )}
                                        {/* Overlay Info */}
                                        <div className="absolute bottom-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                                            <Clock size={12} className="text-[#22C55E]" />
                                            30-45 min
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{store.name}</h3>
                                            <p className="text-sm text-gray-500 truncate max-w-[250px]">
                                                {store.bio || "African • Fast Food • Drinks"}
                                            </p>
                                        </div>
                                        <div className="bg-gray-100 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                            <Star size={10} className="fill-orange-400 text-orange-400" />
                                            4.5
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {/* Product Grid View */}
                        {items.length === 0 ? (
                            <div className="col-span-2 text-center py-20 text-gray-500">
                                No products found in {title}.
                            </div>
                        ) : (
                            (items as MarketProduct[]).map((product) => (
                                <Link href={`/listing/${product.id}`} key={product.id} className="bg-white border border-gray-100 rounded-xl overflow-hidden block">
                                    <div className="aspect-square bg-gray-50 relative">
                                        {product.productImages?.[0] ? (
                                            <Image
                                                src={product.productImages[0].url}
                                                alt={product.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="p-3">
                                        <div className="text-xs text-[#22C55E] font-medium mb-1 line-clamp-1">{product.store?.name}</div>
                                        <h3 className="font-medium text-sm text-gray-900 line-clamp-2 h-10">{product.title}</h3>
                                        <div className="mt-2 font-bold">₦{Number(product.price).toLocaleString()}</div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
