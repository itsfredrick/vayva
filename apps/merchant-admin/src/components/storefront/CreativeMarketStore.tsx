import React, { useState } from 'react';
import { useStorefrontProducts, useStorefrontStore } from '@/hooks/storefront/useStorefront';
import { useStorefrontCart } from '@/hooks/storefront/useStorefrontCart';
import { CheckoutModal } from './CheckoutModal';
import { ShoppingCart, X, Heart, Eye } from 'lucide-react';

export function CreativeMarketStore({ storeName: initialStoreName, storeSlug }: { storeName: string, storeSlug?: string }) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 12 });

    const { cart, addToCart, removeFromCart, updateQuantity, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || '');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-[#fcfcfc] min-h-screen font-sans text-[#333]">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ''}
                onSuccess={clearCart}
            />

            {/* Header */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="font-serif text-2xl font-bold italic tracking-tight">{displayName}</div>

                    <div className="hidden md:flex gap-6 text-sm font-medium text-gray-500">
                        <a href="#" className="hover:text-black">Graphics</a>
                        <a href="#" className="hover:text-black">Fonts</a>
                        <a href="#" className="hover:text-black">Templates</a>
                        <a href="#" className="hover:text-black">Add-ons</a>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-red-500"><Heart className="w-5 h-5" /></button>
                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 relative text-gray-700"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cart.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                    {cart.length}
                                </span>
                            )}
                        </button>
                        <button className="bg-green-500 text-white px-4 py-2 rounded text-sm font-bold hover:bg-green-600 transition-colors">Sign In</button>
                    </div>
                </div>
            </nav>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-lg text-gray-800">Shopping Cart</h2>
                            <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
                        </div>

                        <div className="flex-1 overflow-auto p-5 space-y-5">
                            {cart.length === 0 ? (
                                <div className="text-center py-10 opacity-60">
                                    <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p className="text-gray-500">Your cart is empty.</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                                        <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                            {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm text-gray-800 line-clamp-2 mb-1">{item.name}</h3>
                                            <div className="text-xs text-gray-400 mb-2">Commercial License</div>
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-bold text-green-600">₦{item.price.toLocaleString()}</span>
                                                <button onClick={() => removeFromCart(item.id)} className="text-xs text-red-500 hover:underline">Remove</button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-5 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between items-center mb-4 text-sm font-medium text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="text-lg font-bold text-gray-900">₦{total.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                                    className="w-full bg-green-500 text-white py-3 rounded-md font-bold hover:bg-green-600 shadow-md transition-colors"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Hero */}
            <div className="bg-[#f0f5f3] py-20 border-b border-gray-200 text-center px-6">
                <h1 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-6">World-class design assets</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">Bring your creative projects to life with ready-to-use design assets from independent creators around the world.</p>

                <div className="max-w-2xl mx-auto bg-white p-2 rounded-lg shadow-sm flex items-center border border-gray-200">
                    <input type="text" placeholder="Search fonts, graphics, and more..." className="flex-1 px-4 py-2 outline-none text-gray-700" />
                    <button className="bg-red-500 text-white px-6 py-2 rounded-md font-bold hover:bg-red-600">Search</button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="max-w-[1400px] mx-auto px-6 py-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold text-gray-900">Trending Now</h2>
                    <a href="#" className="text-sm font-bold text-green-600 hover:underline">View All</a>
                </div>

                {isLoading && products.length === 0 ? (
                    <div className="text-center py-20 text-gray-400">Loading assets...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 border border-gray-200 rounded-lg">
                        <p className="text-gray-400">No assets found.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-4 gap-6">
                        {products.map(product => (
                            <div key={product.id} className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-lg transition-all overflow-hidden cursor-pointer" onClick={() => addToCart(product)}>
                                <div className="aspect-[4/3] bg-gray-100 relative">
                                    <img
                                        src={product.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="bg-white p-2 rounded-md text-gray-600 hover:text-red-500 shadow-sm"><Heart className="w-4 h-4" /></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{product.name}</h3>
                                    <p className="text-xs text-gray-500 mb-4">by <span className="underline">Vayva Creators</span> in {product.category || 'Graphics'}</p>

                                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                        <div className="font-bold text-lg text-gray-900">₦{product.price.toLocaleString()}</div>
                                        <button
                                            className="bg-gray-100 hover:bg-green-500 hover:text-white px-3 py-1 rounded text-xs font-bold transition-colors flex items-center gap-1"
                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                        >
                                            <ShoppingCart className="w-3 h-3" /> Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="bg-white border-t border-gray-200 mt-20 py-12 text-center text-gray-400 text-sm">
                &copy; 2024 {displayName} Market.
            </footer>
        </div>
    );
}
