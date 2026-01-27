"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart, MessageCircle, Share2, ShoppingCart, ShieldCheck, Truck, MapPin } from "lucide-react";
import { Button } from "@vayva/ui";
import { useCart } from "@/context/CartContext";
import { MarketProduct, MarketProductImage, MarketProductVariant, MarketProductPricingTier } from "@vayva/shared";
import { BrandLogo } from "@/components/BrandLogo";

export default function ListingDetailPage(): React.JSX.Element {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { addItem } = useCart();
    const [product, setProduct] = useState<MarketProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<MarketProductVariant | null>(null);
    const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
    const [tab, setTab] = useState<"overview" | "details" | "supplier" | "reviews">("overview");
    const [chatLoading, setChatLoading] = React.useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${id}`);
                if (res.ok) {
                    const payload = await res.json();
                    const nextProduct = (payload?.data?.product ?? payload?.product ?? null) as MarketProduct | null;
                    setProduct(nextProduct);
                    if (nextProduct?.productVariants?.length) {
                        setSelectedVariant(nextProduct.productVariants[0]);
                    }
                    if (nextProduct?.productImages?.[0]?.url) {
                        setActiveImageUrl(nextProduct.productImages[0].url);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    const handleAddToCart = async (): Promise<void> => {
        if (!selectedVariant || !product) return;
        setIsAddingToCart(true);
        try {
            await addItem(selectedVariant.id, product.moq || 1);
        } catch (error) {
            console.error("Add to cart error", error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleBuyNow = async (): Promise<void> => {
        if (!selectedVariant || !product) return;
        setIsAddingToCart(true);
        try {
            await addItem(selectedVariant.id, product.moq || 1);
            router.push("/checkout");
        } catch (error) {
            console.error("Buy now error", error);
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleChat = async (): Promise<void> => {
        if (!product) return;
        setChatLoading(true);
        try {
            const res = await fetch("/api/conversations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listingId: product.id,
                    message: "Hi, is this item still available?"
                })
            });

            const data = await res.json();

            if (res.ok) {
                router.push(`/chat/${data.conversationId}`);
            } else {
                router.push("/chat");
            }
        } catch (error) {
            console.error("Chat Error", error);
        } finally {
            setChatLoading(false);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading product...</div>;
    if (!product) return <div className="p-10 text-center">Product not found</div>;

    const isChinaBulk = product.store?.type === "CHINA_SUPPLIER";
    const mainImage = product.productImages?.[0]?.url || selectedVariant?.productImage?.url || "/placeholder.png";
    const displayImage = activeImageUrl || mainImage;

    return (
        <div className="min-h-screen bg-white flex flex-col pb-20">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                    <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full text-gray-500" aria-label="Go back" title="Go back">
                        <ArrowLeft size={20} />
                    </Button>

                    <Link href="/" className="shrink-0">
                        <BrandLogo className="h-5" />
                    </Link>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="rounded-full text-gray-500" aria-label="Share" title="Share">
                            <Share2 size={20} />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full text-gray-500" aria-label="Save" title="Save">
                            <Heart size={20} />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto w-full p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Media */}
                <div className="space-y-4">
                    <div className="aspect-[4/3] bg-gray-200 rounded-xl overflow-hidden relative shadow-sm">
                        <img src={displayImage} alt={product.title} className="w-full h-full object-cover" />

                        <div className={`absolute top-4 left-4 px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide text-white ${isChinaBulk ? "bg-primary" : "bg-black"}`}>
                            {isChinaBulk ? "China Bulk" : "In Stock"}
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
                        {product.productImages?.map((img: MarketProductImage) => (
                            <Button
                                key={img.id}
                                variant="ghost"
                                className={`w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border transition-colors p-0 ${
                                    (activeImageUrl || mainImage) === img.url
                                        ? "border-primary"
                                        : "border-transparent hover:border-black"
                                }`}
                                onClick={() => setActiveImageUrl(img.url)}
                                aria-label="Select image"
                                title="Select image"
                            >
                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Right Column: Details */}
                <div className="space-y-6">

                    {/* Header Data */}
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span>{product.productType || "Product"}</span> • <span>{product.condition}</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                            {product.title}
                        </h1>
                        <p className="text-primary text-3xl font-bold">
                            ₦{Number(selectedVariant?.price || product.price).toLocaleString()}
                        </p>

                        {/* Bulk Logic Badges */}
                        <div className="flex gap-2 mt-2">
                            {(product.moq || 0) > 1 && (
                                <span className="text-xs bg-primary/10 text-foreground px-2 py-0.5 rounded font-medium">
                                    Min Order: {product.moq} items
                                </span>
                            )}
                            {product.depositRequired && (
                                <span className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded font-medium">
                                    Deposit
                                </span>
                            )}
                        </div>

                        <div className="mt-4 flex gap-2 border-b border-gray-100">
                            {(
                                [
                                    { id: "overview", label: "Overview" },
                                    { id: "details", label: "Details" },
                                    { id: "supplier", label: "Supplier" },
                                    { id: "reviews", label: "Reviews" },
                                ] as const
                            ).map((t) => (
                                <Button
                                    key={t.id}
                                    variant="ghost"
                                    onClick={() => setTab(t.id)}
                                    className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors ${
                                        tab === t.id
                                            ? "border-primary text-primary"
                                            : "border-transparent text-gray-500 hover:text-gray-900"
                                    }`}
                                >
                                    {t.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {tab === "overview" && product.pricingTiers && product.pricingTiers.length > 0 && (
                        <div className="bg-gray-100 rounded-lg p-4">
                            <h4 className="text-sm font-bold mb-2">Wholesale Pricing</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {product.pricingTiers.map((tier: MarketProductPricingTier) => (
                                    <div key={tier.id} className="bg-white p-2 rounded border text-xs">
                                        <p className="font-bold">{tier.minQty}+ units</p>
                                        <p className="text-gray-500">₦{Number(tier.unitPrice).toLocaleString()}/unit</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === "overview" && product.productVariants && product.productVariants.length > 1 && (
                        <div>
                            <h3 className="font-bold text-sm mb-2">Select Variant</h3>
                            <div className="flex flex-wrap gap-2">
                                {product.productVariants.map((v: MarketProductVariant) => (
                                    <Button
                                        key={v.id}
                                        onClick={() => setSelectedVariant(v)}
                                        variant={selectedVariant?.id === v.id ? "primary" : "outline"}
                                        size="sm"
                                        className="text-xs"
                                    >
                                        {v.title}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === "overview" && (
                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-start gap-3">
                            <ShieldCheck className="text-primary mt-0.5" size={18} />
                            <div>
                                <div className="flex items-center gap-2">
                                    <BrandLogo className="h-4" />
                                    <span className="text-sm font-bold text-gray-900">Protected</span>
                                </div>
                                <p className="text-xs text-gray-700">Money held in escrow until you confirm delivery.</p>
                            </div>
                        </div>
                    )}

                    {tab === "supplier" && (
                        <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold">
                                    {product.store?.name?.[0] || "M"}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1">
                                        <h3 className="font-bold text-xs text-gray-900">{product.store?.name}</h3>
                                        <ShieldCheck size={12} className="text-primary" />
                                    </div>
                                    <p className="text-xs text-gray-400">Supplier</p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="text-xs font-bold text-gray-900 border-gray-200">
                                View Profile
                            </Button>
                        </div>
                    )}

                    {tab === "details" && (
                        <div>
                            <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                                {product.description || "No description provided."}
                            </p>
                        </div>
                    )}

                    {tab === "reviews" && (
                        <div className="rounded-xl border border-gray-100 bg-white p-4">
                            <div className="text-sm font-bold text-gray-900">Reviews</div>
                            <div className="mt-1 text-sm text-gray-600">Reviews will appear here as buyers complete purchases.</div>
                        </div>
                    )}

                    {tab === "overview" && (
                        <>
                            <div className="flex items-center gap-3 text-sm text-gray-600 py-4 border-t border-gray-100">
                                <MapPin size={18} />
                                <span>Ships to Lagos & nationwide</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-gray-600 pb-4">
                                <Truck size={18} />
                                <span>Estimated delivery: {product.shippingEstimate || (isChinaBulk ? "30-45" : "1-3")} days</span>
                            </div>

                            <div className="hidden lg:block sticky bottom-4">
                                <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            onClick={handleAddToCart}
                                            disabled={isAddingToCart}
                                            variant="secondary"
                                            className="h-12 font-extrabold"
                                        >
                                            {isAddingToCart ? "..." : "Add to Cart"}
                                        </Button>
                                        <Button
                                            onClick={handleBuyNow}
                                            disabled={isAddingToCart}
                                            className="h-12 font-extrabold glow-primary"
                                        >
                                            {isAddingToCart ? "Processing..." : (product.depositRequired ? "Pay Deposit" : "Buy Now")}
                                        </Button>
                                    </div>

                                    <Button
                                        onClick={handleChat}
                                        disabled={chatLoading}
                                        variant="outline"
                                        className="w-full h-11 mt-3 font-bold"
                                    >
                                        <MessageCircle size={16} />
                                        {chatLoading ? "Opening chat..." : "Chat supplier"}
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </main>

            {/* Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-xl z-50 lg:hidden">
                <div className="max-w-7xl mx-auto flex gap-3">
                    <Button
                        onClick={handleAddToCart}
                        disabled={isAddingToCart}
                        variant="secondary"
                        className="flex-1 font-bold py-6 rounded-lg"
                    >
                        {isAddingToCart ? "..." : "Add to Cart"}
                    </Button>
                    <Button
                        onClick={handleBuyNow}
                        disabled={isAddingToCart}
                        className="flex-[2] font-bold py-6 rounded-lg gap-2 glow-primary"
                    >
                        <ShoppingCart size={18} />
                        {isAddingToCart ? "Processing..." : (product.depositRequired ? "Pay Deposit" : "Buy Now")}
                    </Button>
                </div>
            </div>
        </div>
    );
}
