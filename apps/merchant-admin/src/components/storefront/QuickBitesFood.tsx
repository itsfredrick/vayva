import React, { useState, useMemo } from 'react';
import { useStorefrontProducts, useStorefrontStore } from '@/hooks/storefront/useStorefront';
import { useStorefrontCart } from '@/hooks/storefront/useStorefrontCart';
import { CheckoutModal } from './CheckoutModal';
import { ShoppingBag, ChevronRight, Search, Star, Clock, Heart, Plus, Minus, X } from 'lucide-react';

export function QuickBitesFood({ storeName: initialStoreName, storeSlug }: { storeName: string, storeSlug?: string }) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 100 }); // Fetch more for categorized menu

    // Cart Logic
    const { cart, addToCart, removeFromCart, updateQuantity, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || '');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Category Logic
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Generate categories from products
    const categories = useMemo(() => {
        const unique = new Set(products.map(p => p.category || 'Popular'));
        return ['All', ...Array.from(unique)];
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(() => {
        if (selectedCategory === "All") return products;
        return products.filter(p => p.category === selectedCategory);
    }, [selectedCategory, products]);

    const displayName = store?.name || initialStoreName;

    return (
        <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">

            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ''}
                onSuccess={clearCart}
            />

            {/* Sidebar Navigation */}
            <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col justify-between p-6 overflow-y-auto hidden md:flex">
                <div>
                    <div className="flex items-center gap-3 mb-10 text-orange-500">
                        <div className="bg-orange-100 p-2 rounded-xl">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <span className="font-extrabold text-xl tracking-tight text-black">{displayName}</span>
                    </div>

                    <nav className="space-y-2">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menu</div>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-8 bg-blue-500 rounded-2xl p-6 text-white text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Star className="w-12 h-12" /></div>
                    <div className="relative z-10">
                        <div className="font-bold text-lg mb-1">Free Delivery</div>
                        <p className="text-xs text-blue-100 mb-3">On all orders over ₦5,000</p>
                        <button className="text-xs bg-white text-blue-500 px-4 py-2 rounded-lg font-bold">Details</button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 flex-shrink-0">
                    <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-xl w-96">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input type="text" placeholder={`Search ${displayName}...`} className="bg-transparent border-none text-sm w-full focus:outline-none" />
                    </div>

                    <button
                        className="md:hidden p-2 bg-orange-100 text-orange-600 rounded-lg"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </header>

                {/* Content Scroll Area */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="bg-orange-500 rounded-3xl p-8 mb-10 text-white flex items-center justify-between shadow-xl shadow-orange-200">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Get 20% off your first order!</h2>
                            <p className="text-orange-100">Use code: <span className="font-mono bg-white/20 px-2 rounded">VAYVA20</span></p>
                        </div>
                        <div className="text-4xl">🍔</div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">{selectedCategory} Menu</h2>
                        <div className="flex gap-2">
                            <button className="p-2 border rounded-lg hover:bg-gray-50"><Clock className="w-4 h-4" /></button>
                            <button className="p-2 border rounded-lg hover:bg-gray-50"><Heart className="w-4 h-4" /></button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="py-20 text-center">Loading menu...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                            {filteredProducts.map(p => (
                                <div key={p.id} className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group cursor-pointer" onClick={() => addToCart(p)}>
                                    <div className="aspect-video bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
                                        <img src={p.image || `https://via.placeholder.com/300x200?text=${p.name}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <button className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Plus className="w-4 h-4 text-orange-500" />
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-gray-900">{p.name}</h3>
                                        <span className="font-bold text-orange-500">₦{p.price.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2">{p.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            {/* Cart Sidebar (Right) */}
            {(isCartOpen || true) && ( // Always show on desktop if we want that persistent layout
                <aside className={`fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-100 shadow-2xl transform transition-transform duration-300 z-40 ${isCartOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} md:static flex flex-col`}>
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h3 className="font-bold text-lg">My Order</h3>
                        <div className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold">{cart.length}</div>
                        <button className="md:hidden" onClick={() => setIsCartOpen(false)}><X className="w-5 h-5" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {cart.length === 0 ? (
                            <div className="text-center text-gray-400 py-10">
                                🥣 Empty Plate
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-sm mb-1 truncate">{item.name}</div>
                                        <div className="text-xs text-gray-400">₦{(item.price * item.quantity).toLocaleString()}</div>
                                    </div>
                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded"><Minus className="w-3 h-3" /></button>
                                        <span className="text-xs font-bold w-3 text-center">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded"><Plus className="w-3 h-3" /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-6 bg-gray-50 mt-auto">
                        <div className="space-y-2 mb-6">
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Subtotal</span>
                                <span>₦{total.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <span>Delivery</span>
                                <span>₦0</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span>₦{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <button
                            disabled={cart.length === 0}
                            onClick={() => setIsCheckoutOpen(true)}
                            className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            Checkout <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </aside>
            )}
        </div>
    );
}
