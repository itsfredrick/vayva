"use client";

import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingBag, Menu, X, ArrowRight, ShieldCheck, Truck, RotateCcw, Plus, Minus } from "lucide-react";

export function StandardRetailHome({
  storeName: initialStoreName,
  storeSlug
}: {
  storeName?: string;
  storeSlug?: string
}) {
  const { store } = useStorefrontStore(storeSlug);
  const { products, isLoading } = useStorefrontProducts(storeSlug, { limit: 20 });
  const { cart, addToCart, removeFromCart, updateQuantity, total, isOpen: isCartOpen, setIsOpen: setIsCartOpen, clearCart } = useStorefrontCart(storeSlug || "");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const displayName = store?.name || initialStoreName || "Modern Store";

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} cart={cart} total={total} storeSlug={storeSlug || ""} onSuccess={clearCart} />

      {/* Modern Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="md:hidden"><Menu className="w-5 h-5" /></button>
            <span className="text-xl font-bold tracking-tight">{displayName}</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-black transition-colors">Shop</a>
            <a href="#" className="hover:text-black transition-colors">New Arrivals</a>
            <a href="#" className="hover:text-black transition-colors">About</a>
          </nav>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Minimal Hero */}
      <section className="bg-gray-50 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900">
            Timeless Essentials.
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Discover our curated collection of premium goods designed for modern living.
          </p>
          <button className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2 mx-auto">
            Shop Collection <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Trust Badges */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-gray-600">
            <Truck className="w-5 h-5 text-gray-400" />
            <span>Free Shipping on Orders over $50</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-gray-600">
            <ShieldCheck className="w-5 h-5 text-gray-400" />
            <span>Secure Checkout Guaranteed</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-4 text-sm font-medium text-gray-600">
            <RotateCcw className="w-5 h-5 text-gray-400" />
            <span>30-Day Easy Returns</span>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-black">View all</a>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-gray-400">Loading essentials...</div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center bg-gray-50 rounded-2xl">
            <p className="text-gray-500">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-square bg-gray-100 rounded-2xl mb-4 overflow-hidden relative">
                  <img
                    src={product.image || `https://via.placeholder.com/400?text=${product.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => addToCart(product)}
                    className="absolute bottom-4 right-4 bg-white shadow-lg p-3 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1">₦{product.price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Cart Drawer Reuse */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="relative w-full max-w-sm bg-white h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Your Bag</h2>
              <button onClick={() => setIsCartOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            <div className="flex-1 overflow-auto space-y-6">
              {cart.map(item => (
                <div key={item.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image && <img src={item.image} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between font-medium text-sm">
                      <span>{item.name}</span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-100 rounded"><Minus className="w-3 h-3" /></button>
                      <span className="text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-100 rounded"><Plus className="w-3 h-3" /></button>
                      <button onClick={() => removeFromCart(item.id)} className="ml-auto text-xs text-red-500">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-6 mt-6">
              <div className="flex justify-between text-lg font-bold mb-4">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
              <button onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
