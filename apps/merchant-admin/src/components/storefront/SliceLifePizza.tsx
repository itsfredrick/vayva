import { StorefrontCart } from "@/components/storefront/StorefrontCart";
import { StorefrontSEO } from "@/components/storefront/StorefrontSEO";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { useStorefrontProducts, useStorefrontStore } from "@/hooks/storefront/useStorefront";
import { Button } from "@vayva/ui";
import { motion } from "framer-motion";

export default function SliceLifePizza() {
    const { store } = useStorefrontStore("slice-life");
    const { products, isLoading } = useStorefrontProducts("slice-life");
    const { addToCart, cart } = useStorefrontCart("slice-life");

    if (!store || isLoading) {
        return (
            <div className="min-h-screen bg-[#FFF5E1] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-stone-500 font-bold uppercase tracking-widest">Loading Slice Life...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF5E1] font-sans text-stone-800">
            <StorefrontSEO
                title={`${store.name} - Fresh Artisanal Pizza`}
                description="The best pizza in town, delivered hot to your doorstep."
            />

            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#FF6B35] text-white shadow-lg">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="text-2xl font-black tracking-tighter uppercase italic">
                        {store.name}
                    </div>
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6 text-sm font-bold uppercase tracking-wide">
                            <a href="#menu" className="hover:opacity-80 transition-opacity">Menu</a>
                            <a href="#about" className="hover:opacity-80 transition-opacity">About</a>
                        </nav>
                        <StorefrontCart storeSlug="slice-life" />
                    </div>
                </div>
            </header>

            {/* Hero */}
            <section className="relative h-[500px] bg-stone-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <motion.div
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 z-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop")' }}
                />
                <div className="relative z-20 text-center text-white px-4">
                    <motion.h1
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-6xl md:text-8xl font-black mb-6 uppercase leading-none italic tracking-tighter"
                    >
                        Hot & Fresh
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl font-light opacity-90 max-w-2xl mx-auto"
                    >
                        Artisanal slices baked to perfection and delivered within 30 minutes.
                    </motion.p>
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-10"
                    >
                        <a href="#menu" className="bg-[#FF6B35] text-white px-10 py-4 rounded-full text-lg font-black uppercase tracking-tighter hover:scale-105 transition-transform shadow-xl">
                            Start Your Order
                        </a>
                    </motion.div>
                </div>
            </section>

            {/* Menu */}
            <main id="menu" className="container mx-auto px-4 py-20">
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 border-b-4 border-[#FF6B35] pb-4">
                    <h2 className="text-4xl font-black uppercase italic text-stone-900 tracking-tighter">The Pizza Menu</h2>
                    <span className="text-stone-400 font-bold uppercase tracking-widest text-sm">{products?.length || 0} Specialties Available</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {products?.map((product: any) => (
                        <motion.div
                            key={product.id}
                            layout
                            className="group bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(255,107,53,0.3)] transition-all duration-500 border border-stone-100"
                        >
                            <div className="h-64 bg-stone-100 relative overflow-hidden">
                                <img
                                    src={product.imageUrl || "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop"}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                {product.isFeatured && (
                                    <div className="absolute top-4 left-4 bg-yellow-400 text-stone-900 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        Best Seller
                                    </div>
                                )}
                            </div>
                            <div className="p-8">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase group-hover:text-[#FF6B35] transition-colors">
                                        {product.name}
                                    </h3>
                                </div>
                                <p className="text-stone-500 mb-6 line-clamp-2 text-sm leading-relaxed">
                                    {product.description || "Crafted with hand-picked ingredients and our secret dough recipe."}
                                </p>
                                <div className="flex items-center justify-between mt-auto">
                                    <span className="text-3xl font-black tracking-tighter">
                                        ₦{product.price?.toLocaleString()}
                                    </span>
                                    <Button
                                        onClick={() => addToCart(product)}
                                        className="bg-[#FF6B35] hover:bg-stone-900 text-white rounded-2xl px-6 py-6 h-auto font-black shadow-lg shadow-[#FF6B35]/20"
                                    >
                                        ADD
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Quality Statement */}
            <section className="bg-white py-20 border-y border-stone-200">
                <div className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center">
                    <div>
                        <div className="text-4xl mb-4">🏠</div>
                        <h4 className="font-bold uppercase tracking-widest mb-2">House-Made</h4>
                        <p className="text-stone-500 text-sm">Every crust is kneaded by hand daily.</p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">🍅</div>
                        <h4 className="font-bold uppercase tracking-widest mb-2">Fresh Sourced</h4>
                        <p className="text-stone-500 text-sm">Locally grown tomatoes and fresh mozzarella.</p>
                    </div>
                    <div>
                        <div className="text-4xl mb-4">🔥</div>
                        <h4 className="font-bold uppercase tracking-widest mb-2">Wood Fired</h4>
                        <p className="text-stone-500 text-sm">Baked at 800 degrees for that perfect char.</p>
                    </div>
                </div>
            </section>

            <footer className="bg-stone-900 text-white py-20 text-center">
                <div className="container mx-auto px-4">
                    <div className="text-3xl font-black italic tracking-tighter uppercase mb-6">{store.name}</div>
                    <p className="max-w-md mx-auto text-stone-500 text-sm mb-10 leading-relaxed">
                        The ultimate destination for pizza lovers. Quality you can taste, service you can trust.
                    </p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                        &copy; {new Date().getFullYear()} {store.name} - Powered by Vayva
                    </p>
                </div>
            </footer>
        </div>
    );
}
