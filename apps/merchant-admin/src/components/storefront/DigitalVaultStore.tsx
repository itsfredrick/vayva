import React, { useState } from 'react';
import { useStorefrontProducts, useStorefrontStore } from '@/hooks/storefront/useStorefront';
import { useStorefrontCart } from '@/hooks/storefront/useStorefrontCart';
import { CheckoutModal } from './CheckoutModal';
import { ShoppingCart, X, Download, ShieldCheck } from 'lucide-react';

export function DigitalVaultStore({ storeName: initialStoreName, storeSlug }: { storeName: string, storeSlug?: string }) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 12 });

    const { cart, addToCart, removeFromCart, updateQuantity, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || '');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-[#fff] min-h-screen font-sans text-[#24292e]">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ''}
                onSuccess={clearCart}
            />

            {/* Header */}
            <header className="border-b border-gray-100 py-6 px-6 sticky top-0 bg-white/90 backdrop-blur z-50">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#FF90E8] border-2 border-black rounded-full flex items-center justify-center font-bold text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            DV
                        </div>
                        <span className="font-bold text-xl tracking-tight">{displayName}</span>
                    </div>
                    <button
                        className="bg-black text-white px-4 py-2 rounded-lg font-bold hover:translate-y-px hover:shadow-none transition-all flex items-center gap-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                        onClick={() => setIsCartOpen(true)}
                    >
                        <ShoppingCart className="w-5 h-5" />
                        <span>Cart ({cart.length})</span>
                    </button>
                </div>
            </header>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l-4 border-black animate-in slide-in-from-right">
                        <div className="p-6 border-b-2 border-dashed border-gray-200 flex justify-between items-center bg-gray-50">
                            <h2 className="font-bold text-xl">Your Downloads</h2>
                            <button onClick={() => setIsCartOpen(false)}><X className="w-6 h-6 hover:rotate-90 transition-transform" /></button>
                        </div>

                        <div className="flex-1 overflow-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="text-center py-20 opacity-50 border-2 border-dashed border-gray-200 rounded-xl">
                                    <Download className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                    <p>Cart is empty.</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="bg-white border-2 border-black rounded-xl p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-lg leading-tight">{item.name}</h3>
                                            <div className="bg-[#FF90E8] px-2 py-1 border border-black text-xs font-bold rounded">₦{item.price.toLocaleString()}</div>
                                        </div>
                                        <div className="flex justify-between items-center mt-4">
                                            <button onClick={() => removeFromCart(item.id)} className="text-xs font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded">Remove</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t-2 border-black bg-gray-50">
                                <div className="flex justify-between text-xl font-bold mb-4">
                                    <span>Total</span>
                                    <span>₦{total.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                                    className="w-full bg-[#23A094] text-white py-4 font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all"
                                >
                                    Pay {total > 0 ? `₦${total.toLocaleString()}` : ''}
                                </button>
                                <div className="text-center mt-3 text-xs text-gray-500 flex items-center justify-center gap-1">
                                    <ShieldCheck className="w-3 h-3" /> Secure checkout
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="w-20 h-2 bg-[#FF90E8] mb-8 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
                <h1 className="text-5xl font-black mb-6 leading-none">High-quality digital assets <br />for creators.</h1>
                <p className="text-xl text-gray-500 mb-16 max-w-2xl">
                    Premium fonts, mockups, templates, and textures. Carefully curated for professional designers. Instant download.
                </p>

                {isLoading && products.length === 0 ? (
                    <div className="py-20 text-center text-gray-500 font-bold">Loading assets...</div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center border-2 border-dashed border-gray-300 rounded-2xl">
                        <p className="text-gray-400 font-bold text-xl">No products found.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {products.map(product => (
                            <div key={product.id} className="group cursor-pointer">
                                <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all duration-200">
                                    <div className="aspect-[4/3] bg-gray-100 border-b-2 border-black relative">
                                        <img
                                            src={product.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(product.name)}`}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-3 left-3 bg-white px-3 py-1 text-xs font-black uppercase tracking-widest border-2 border-black rounded-lg">
                                            {product.category || 'Asset'}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2 leading-tight">{product.name}</h3>
                                        <p className="text-gray-500 text-sm mb-6 line-clamp-2 h-10">{product.description}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="text-2xl font-black">₦{product.price.toLocaleString()}</div>
                                            <button
                                                onClick={() => addToCart(product)}
                                                className="bg-[#FF90E8] text-black px-6 py-2 rounded-lg font-bold border-2 border-black hover:bg-[#ff70e0] transition-colors"
                                            >
                                                I want this!
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="border-t border-gray-100 mt-20 py-12 text-center text-gray-400 font-bold text-sm">
                Powered by Vayva Digital.
            </footer>
        </div>
    );
}
