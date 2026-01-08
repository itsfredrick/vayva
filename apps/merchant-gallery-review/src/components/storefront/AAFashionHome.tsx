import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";

export function AAFashionHome({
  storeName: initialStoreName,
  storeSlug,
}: {
  storeName: string;
  storeSlug?: string;
}) {
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

  const displayName = store?.name || initialStoreName;

  return (
    <div className="bg-black text-white min-h-screen font-sans selection:bg-white selection:text-black">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-50 mix-blend-difference px-8 py-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter uppercase">
          {displayName}
        </div>
        <div className="flex gap-8 text-sm font-medium tracking-wide">
          <button className="hover:underline underline-offset-4">
            Collection
          </button>
          <button className="hover:underline underline-offset-4">
            Editorial
          </button>
          <button
            className="hover:underline underline-offset-4 flex items-center gap-2"
            onClick={() => setIsCartOpen(true)}
          >
            Cart ({cart.length})
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#111] border-l border-gray-800 h-full p-6 flex flex-col animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold uppercase tracking-widest">
                Your Bag
              </h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <p>Your bag is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-gray-900 rounded overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-medium text-sm">{item.name}</h3>
                        <span className="text-sm">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-gray-800 rounded">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:bg-white hover:text-black transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:bg-white hover:text-black transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-gray-500 hover:text-white underline"
                        >
                          Remove
                        </button>
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
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 scale-105"
            src="https://cdn.coverr.co/videos/coverr-fashion-photoshoot-with-a-model-5343/1080p.mp4"
          />
        </div>

        <div className="relative z-20 text-center max-w-4xl mx-auto px-6">
          <p className="text-sm md:text-base mb-4 font-bold tracking-[0.3em] uppercase opacity-80">
            Season 04 / 24
          </p>
          <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-8 leading-[0.8]">
            DARK
            <br />
            MATTER
          </h1>
          <button className="border border-white px-12 py-4 text-sm font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-all duration-500">
            View Lookbook
          </button>
        </div>
      </header>

      {/* Product Grid */}
      <section className="py-32 px-4 md:px-8 max-w-[1600px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
            New Arrivals
          </h2>
          <div className="text-right hidden md:block">
            <p className="text-gray-400 text-sm tracking-widest uppercase">
              Limited Edition Drop
            </p>
          </div>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Loading collection...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-gray-800 rounded">
            <p className="text-gray-500">No products available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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
                    <button
                      onClick={() => addToCart(product)}
                      className="w-full bg-white text-black py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-200"
                    >
                      Add to Bag — ₦{product.price.toLocaleString()}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold uppercase tracking-tight mb-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs">
                      {product.category || "Apparel"}
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
    </div>
  );
}
