import React, { useState } from 'react';
import { useStorefrontProducts, useStorefrontStore } from '@/hooks/storefront/useStorefront';
import { useStorefrontCart } from '@/hooks/storefront/useStorefrontCart';
import { CheckoutModal } from './CheckoutModal';
import { ShoppingCart, X, Share2, Plus, Minus } from 'lucide-react';

export function EventTicketsPro({ storeName: initialStoreName, storeSlug }: { storeName: string, storeSlug?: string }) {
    const { store } = useStorefrontStore(storeSlug);
    const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 12 });

    const { cart, addToCart, removeFromCart, updateQuantity, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || '');
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    const displayName = store?.name || initialStoreName;

    return (
        <div className="bg-[#f8f7fa] min-h-screen font-sans text-[#1e0a3c]">
            <CheckoutModal
                isOpen={isCheckoutOpen}
                onClose={() => setIsCheckoutOpen(false)}
                cart={cart}
                total={total}
                storeSlug={storeSlug || ''}
                onSuccess={clearCart}
            />

            {/* Navbar */}
            <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="text-red-600 font-bold text-2xl tracking-tight">{displayName}</div>

                    <div className="flex-1 max-w-xl mx-8 hidden md:block">
                        <input type="text" placeholder="Search events..." className="w-full bg-[#f8f7fa] border border-gray-200 rounded-full px-5 py-2 text-sm focus:outline-none focus:border-red-300" />
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="text-sm font-medium hover:text-red-600">Find Events</button>
                        <button className="text-sm font-medium hover:text-red-600">Create Event</button>
                        <button
                            className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded relative"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart className="w-5 h-5 text-gray-600" />
                            {cart.length > 0 && <span className="absolute top-1 right-0 w-2 h-2 bg-red-600 rounded-full"></span>}
                        </button>
                        <button className="text-sm font-medium">Log In</button>
                    </div>
                </div>
            </nav>

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
                    <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-xl text-[#1e0a3c]">Order Summary</h2>
                            <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>

                        <div className="flex-1 overflow-auto p-6 space-y-6">
                            {cart.length === 0 ? (
                                <div className="text-center py-10 opacity-60">
                                    <p className="text-gray-500">No tickets selected.</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                            {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                                            <div className="absolute inset-0 border border-black/10 rounded-lg"></div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm text-[#1e0a3c] line-clamp-2 mb-1">{item.name}</h3>
                                            <div className="text-xs text-gray-500 mb-2">General Admission</div>
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center border border-gray-300 rounded">
                                                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-1 hover:bg-gray-100 text-gray-600 font-bold">-</button>
                                                    <span className="px-2 text-sm font-bold">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-1 hover:bg-gray-100 text-gray-600 font-bold">+</button>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-[#1e0a3c]">₦{(item.price * item.quantity).toLocaleString()}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50">
                                <div className="flex justify-between text-lg font-bold mb-4">
                                    <span>Total</span>
                                    <span>₦{total.toLocaleString()}</span>
                                </div>
                                <button
                                    onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
                                    className="w-full bg-[#d1410c] text-white py-4 font-bold rounded-lg hover:bg-[#b0370a] shadow transition-colors"
                                >
                                    Check out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Hero */}
            <div className="relative h-[500px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=2000"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e0a3c] via-transparent to-transparent opacity-90"></div>
                </div>
                <div className="relative h-full max-w-7xl mx-auto px-6 flex items-end pb-20">
                    <div className="max-w-3xl text-white">
                        <div className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded mb-4 uppercase tracking-wide">Trending</div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">Make memories<br />live.</h1>
                        <button className="bg-[#d1410c] text-white px-8 py-4 font-bold rounded hover:bg-[#b0370a] transition-colors text-lg">
                            Explore Events
                        </button>
                    </div>
                </div>
            </div>

            {/* Events Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold mb-8 text-[#1e0a3c]">Upcoming Events</h2>

                {isLoading && products.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">Loading events...</div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 border border-gray-200 rounded-lg">
                        <p className="text-gray-400">No upcoming events.</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-4 gap-8">
                        {products.map(event => (
                            <div key={event.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 overflow-hidden flex flex-col h-full" onClick={() => addToCart(event)}>
                                <div className="aspect-[3/2] bg-gray-100 relative overflow-hidden">
                                    <img
                                        src={event.image || `https://via.placeholder.com/400x300?text=${encodeURIComponent(event.name)}`}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500">
                                        <Share2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="font-bold text-[#d1410c] text-sm mb-1 uppercase tracking-wide">
                                        DEC 14 <span className="text-gray-400 font-normal ml-2">7:00 PM</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-[#1e0a3c] mb-2 leading-tight line-clamp-2 hover:underline">{event.name}</h3>
                                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>

                                    <div className="mt-auto pt-4 flex items-center justify-between">
                                        <div className="font-bold text-gray-700">From ₦{event.price.toLocaleString()}</div>
                                        <button className="p-2 border border-gray-200 rounded-full hover:bg-gray-50">
                                            <ShoppingCart className="w-4 h-4 text-gray-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <footer className="bg-[#1e0a3c] text-white py-16 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center text-sm opacity-60">
                    &copy; 2024 {displayName} Events.
                </div>
            </footer>
        </div>
    );
}
