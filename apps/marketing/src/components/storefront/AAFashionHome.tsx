"use client";

import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { CountdownTimer } from "./features/CountdownTimer";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { Button } from "@vayva/ui";

export interface AAFashionHomeProps {
  storeName?: string;
  storeSlug?: string;
  heroText?: string;
  heroSubtext?: string;
  showTimer?: boolean;
  timerDate?: string;
  heroVideo?: string;
}

export function AAFashionHome({
  storeName: initialStoreName,
  storeSlug,
  heroText,
  heroSubtext,
  showTimer = false,
  timerDate,
  heroVideo = "https://cdn.coverr.co/videos/coverr-fashion-photoshoot-with-a-model-5343/1080p.mp4",
}: AAFashionHomeProps) {
  const { store } = useStorefrontStore(storeSlug);
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 12,
  });

  // Cart Integration
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    total,
    isOpen: isCartOpen,
    setIsOpen: setIsCartOpen,
    clearCart,
  } = useStorefrontCart(storeSlug || "");
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const displayName = store?.name || initialStoreName || "Fashion Store";
  const mainHeadline = heroText || "DARK\nMATTER";
  const subHeadline = heroSubtext || "Season 04 / 24";

  const [raffleItem, setRaffleItem] = useState<unknown>(null);

  const handleRaffleEntry = async (data: unknown) => {
    // Data contains { customer: { ... } }
    await fetch(`/api/storefront/${storeSlug}/raffles/enter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        raffleId: raffleItem.id, // The product ID acting as raffle ID
        customerEmail: data.customer.email,
        metadata: {
          name: data.customer.name,
          phone: data.customer.phone
        }
      })
    });
    setRaffleItem(null);
  };

  const isRaffleMode = !!raffleItem;

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black">
      <CheckoutModal
        isOpen={isCheckoutOpen || !!raffleItem}
        onClose={() => {
          setIsCheckoutOpen(false);
          setRaffleItem(null);
        }}
        cart={raffleItem ? [raffleItem] : cart}
        total={raffleItem ? 0 : total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
        requireAddress={!isRaffleMode}
        submitFn={isRaffleMode ? handleRaffleEntry : undefined}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-50 mix-blend-difference px-8 py-6 flex justify-between items-center backdrop-blur-sm bg-black/10">
        <div className="text-2xl font-bold tracking-tighter uppercase">
          {displayName}
        </div>
        <div className="flex gap-8 text-sm font-medium tracking-wide items-center">
          <Button variant="link" className="hidden md:block hover:underline underline-offset-4 text-white h-auto" aria-label="View collection">
            Collection
          </Button>
          <Button variant="link" className="hidden md:block hover:underline underline-offset-4 text-white h-auto" aria-label="View editorial">
            Editorial
          </Button>
          <Button
            variant="link"
            className="hover:underline underline-offset-4 flex items-center gap-2 text-white h-auto"
            onClick={() => setIsCartOpen(true)}
            aria-label={`View cart with ${cart.length} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span className="hidden md:inline">Cart</span>
            <span className="bg-white text-black text-xs px-2 py-0.5 rounded-full font-bold">
              {cart.length}
            </span>
          </Button>
        </div>
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#111] border-l border-gray-800 h-full p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold uppercase tracking-widest">
                Your Bag
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} className="text-white hover:bg-white/10 h-auto" aria-label="Close bag">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto space-y-8 pr-2 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p>Your bag is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-24 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2 items-start">
                        <h3 className="font-medium text-sm leading-tight pr-4">{item.name}</h3>
                        <span className="text-sm font-mono opacity-80">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-800 rounded">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8 hover:bg-white hover:text-black transition-colors rounded-none h-auto"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="px-3 text-xs font-mono">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 hover:bg-white hover:text-black transition-colors rounded-none h-auto"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="link"
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-gray-500 hover:text-red-400 transition-colors p-0 h-auto"
                          aria-label={`Remove ${item.name} from bag`}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-gray-800 pt-6 mt-6">
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="font-mono">₦{total.toLocaleString()}</span>
                </div>
                <Button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-white text-black py-6 h-auto font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-none h-auto"
                  aria-label="Proceed to checkout"
                >
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/50 z-10"></div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-80"
            src={heroVideo}
          />
        </div>

        <div className="relative z-20 text-center max-w-5xl mx-auto px-6 animate-in fade-in zoom-in duration-1000">
          <p className="text-sm md:text-base mb-6 font-bold tracking-[0.3em] uppercase opacity-80 text-shadow">
            {subHeadline}
          </p>
          <h1 className="text-5xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.9] whitespace-pre-line">
            {mainHeadline}
          </h1>

          {showTimer && (
            <div className="mb-12">
              <CountdownTimer targetDate={timerDate} />
            </div>
          )}

          <Button className="border border-white bg-transparent hover:bg-white hover:text-black px-12 py-6 h-auto text-sm font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded-none h-auto" aria-label="View seasonal collection">
            View Collection
          </Button>
        </div>
      </header>

      {/* Product Grid */}
      <section className="py-32 px-4 md:px-8 max-w-[1800px] mx-auto">
        <div className="flex justify-between items-end mb-16 border-b border-gray-900 pb-8">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
            Latest Drops
          </h2>
          <div className="text-right hidden md:block">
            <p className="text-gray-400 text-sm tracking-widest uppercase">
              {displayName} x Collection
            </p>
          </div>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="flex justify-center py-40">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-40 border border-gray-900 border-dashed rounded-xl">
            <p className="text-gray-500 mb-4">No products dropped yet.</p>
            <Button variant="link" className="text-xs uppercase tracking-widest border-b border-gray-500 p-0 h-auto rounded-none text-gray-400 h-auto" aria-label="Check back later for products">Check back later</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {products.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-900 mb-6 overflow-hidden relative">
                  <img
                    src={
                      product.image ||
                      `https://via.placeholder.com/600x800/111/444?text=${encodeURIComponent(product.name)}`
                    }
                    alt={product.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out transform group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {/* Simulating Raffle items if price is high or random logic for demo */}
                    {product.price > 50000 || product.id.includes('raffle') ? (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRaffleItem(product);
                        }}
                        className="w-full bg-white text-black py-3 h-auto text-xs font-bold uppercase tracking-widest hover:bg-yellow-400 transition-colors rounded-none h-auto"
                        aria-label={`Enter raffle for ${product.name}`}
                      >
                        Enter Raffle — Free
                      </Button>
                    ) : (
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-full bg-white text-black py-3 h-auto text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors rounded-none h-auto"
                        aria-label={`Add ${product.name} to bag`}
                      >
                        Add to Bag — ₦{product.price.toLocaleString()}
                      </Button>
                    )}
                  </div>
                  {/* Stock tag / Raffle tag */}
                  {(product.price > 50000 || product.id.includes('raffle')) && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                      Raffle Entry
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-1 group-hover:underline decoration-1 underline-offset-4">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {product.category || "Available Now"}
                    </p>
                  </div>
                  <span className="font-mono text-sm opacity-60">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="py-20 border-t border-gray-900 text-center opacity-50 text-xs tracking-widest uppercase">
        &copy; {new Date().getFullYear()} {displayName}. All Rights Reserved.
      </footer>
    </div>
  );
}
