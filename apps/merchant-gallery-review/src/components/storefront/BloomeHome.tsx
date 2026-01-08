import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingBag, X } from "lucide-react";

export function BloomeHome({
  storeName: initialStoreName,
  storeSlug,
}: {
  storeName: string;
  storeSlug?: string;
}) {
  const { store } = useStorefrontStore(storeSlug);
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 8,
  });

  // Split products for layout
  const newArrivals = products.slice(0, 4);
  const collection = products.slice(4, 8);

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
    <div className="bg-[#FAFAF9] min-h-screen text-[#44403C] font-serif">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 sticky top-0 bg-[#FAFAF9]/90 backdrop-blur z-50 border-b border-[#E7E5E4]">
        <div className="text-sm font-sans tracking-widest uppercase flex gap-6">
          <a href="#" className="hover:text-black transition-colors">
            Shop
          </a>
          <a href="#" className="hover:text-black transition-colors">
            About
          </a>
          <a href="#" className="hover:text-black transition-colors">
            Journal
          </a>
        </div>
        <div className="text-3xl font-bold tracking-tight text-[#292524]">
          {displayName}
        </div>
        <div className="flex gap-4 items-center">
          <button className="text-sm font-sans tracking-widest uppercase hover:text-black">
            Account
          </button>
          <button
            className="text-sm font-sans tracking-widest uppercase hover:text-black flex items-center gap-2"
            onClick={() => setIsCartOpen(true)}
          >
            Cart ({cart.length})
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans">
          <div
            className="absolute inset-0 bg-[#292524]/20 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#FAFAF9] h-full p-8 flex flex-col shadow-2xl animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-[#292524]">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="opacity-50 hover:opacity-100 transition-opacity"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto space-y-8 pr-2">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-[#A8A29E]">
                  <p className="mb-4">Your cart is currently empty.</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="text-[#292524] underline underline-offset-4"
                  >
                    Continue Browsing
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-6">
                    <div className="w-24 h-32 bg-[#E7E5E4] flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          className="w-full h-full object-cover mix-blend-multiply"
                        />
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <h3 className="font-serif text-lg text-[#292524] leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-sm text-[#78716C] mt-1">
                          QTY: {item.quantity}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-[#A8A29E] hover:text-[#78716C] underline underline-offset-2"
                        >
                          Remove
                        </button>
                        <span className="font-serif text-lg">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#E7E5E4] pt-6 mt-6">
                <div className="flex justify-between items-center mb-6 text-[#292524]">
                  <span className="text-sm uppercase tracking-widest">
                    Subtotal
                  </span>
                  <span className="font-serif text-2xl">
                    ₦{total.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-[#292524] text-[#FAFAF9] py-4 text-sm font-bold uppercase tracking-widest hover:bg-[#1C1917] transition-colors"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="relative py-24 px-8 text-center max-w-4xl mx-auto">
        <span className="text-xs font-sans font-bold tracking-[0.2em] text-[#A8A29E] uppercase block mb-6">
          Est. 2024
        </span>
        <h1 className="text-6xl md:text-8xl mb-8 leading-none tracking-tight text-[#292524]">
          Objects for <br />{" "}
          <i className="font-serif font-light text-[#78716C]">Mindful Living</i>
        </h1>
        <p className="text-lg text-[#78716C] leading-relaxed max-w-xl mx-auto mb-10">
          Curated essentials designed to bring calm, balance, and beauty to your
          everyday rituals.
        </p>
        <div className="aspect-[16/9] bg-[#E7E5E4] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-[2s]"
          />
        </div>
      </header>

      {/* Products - Section 1 */}
      <section className="px-8 py-20 max-w-7xl mx-auto">
        <div className="flex justify-between items-baseline mb-12 border-b border-[#E7E5E4] pb-6">
          <h2 className="text-3xl text-[#292524]">New Arrivals</h2>
          <a
            href="#"
            className="font-sans text-xs font-bold uppercase tracking-widest hover:underline decoration-[#A8A29E] underline-offset-4"
          >
            View All
          </a>
        </div>

        {isLoading && newArrivals.length === 0 ? (
          <div className="text-center py-20 text-[#A8A29E]">
            Loading objects...
          </div>
        ) : newArrivals.length === 0 ? (
          <div className="text-center py-20 bg-[#F5F5F4]">
            <p className="text-[#A8A29E]">No products found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-x-8 gap-y-12">
            {newArrivals.map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="aspect-[4/5] bg-[#F5F5F4] mb-6 overflow-hidden relative">
                  <img
                    src={
                      product.image ||
                      `https://via.placeholder.com/400x500?text=${encodeURIComponent(product.name)}`
                    }
                    className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-sm hover:shadow-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#292524]" />
                  </button>
                </div>
                <h3 className="text-lg text-[#292524] mb-1 group-hover:underline underline-offset-4 decoration-[#D6D3D1] transition-all">
                  {product.name}
                </h3>
                <div className="flex justify-between items-baseline">
                  <p className="text-sm text-[#A8A29E] font-sans truncate pr-4">
                    {product.description}
                  </p>
                  <span className="text-[#57534E] font-medium">
                    ₦{product.price.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#292524] text-[#A8A29E] py-20 px-8 mt-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-2xl font-bold text-[#FAFAF9]">{displayName}</div>
          <div className="font-sans text-xs tracking-widest uppercase flex gap-8">
            <a href="#" className="hover:text-white transition-colors">
              Shipping
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Returns
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
          </div>
          <div className="font-serif italic text-sm">
            © 2024 Vayva Commerce.
          </div>
        </div>
      </footer>
    </div>
  );
}
