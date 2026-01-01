import React, { useState, useMemo } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingBag, Star, Clock, MapPin, X, Plus, Minus } from "lucide-react";

export function GourmetDiningFood({
  storeName: initialStoreName,
  storeSlug,
}: {
  storeName: string;
  storeSlug?: string;
}) {
  const { store } = useStorefrontStore(storeSlug);
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 50,
  });

  // Group by category (Starters, Mains, Desserts etc.)
  const menuSections = useMemo(() => {
    const sections: Record<string, typeof products> = {};
    products.forEach((p) => {
      const cat = p.category || "Mains";
      if (!sections[cat]) sections[cat] = [];
      sections[cat].push(p);
    });
    return sections;
  }, [products]);

  // Cart Hooks
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
    <div className="bg-[#1c1c1c] min-h-screen text-[#e5e5e5] font-serif">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Navigation */}
      <nav className="absolute top-0 w-full z-50 flex justify-between items-center px-8 md:px-16 py-8">
        <div className="text-2xl font-bold tracking-widest uppercase">
          {displayName}
        </div>
        <div className="hidden md:flex gap-8 text-xs font-sans tracking-[0.2em] uppercase text-gray-400">
          <a href="#menu" className="hover:text-white transition-colors">
            Menu
          </a>
          <a
            href="#reservations"
            className="hover:text-white transition-colors"
          >
            Reservations
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            Our Story
          </a>
        </div>
        <div className="flex gap-6">
          <button
            className="text-xs font-sans tracking-[0.2em] uppercase border border-gold px-6 py-2 hover:bg-[#d4af37] hover:text-black transition-colors"
            onClick={() =>
              document
                .getElementById("reservations")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Book Table
          </button>
          <button className="relative p-2" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-sans text-gray-900">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full p-8 flex flex-col animate-in slide-in-from-right duration-500">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-black">Your Order</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-auto space-y-6 pr-2">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  Your order is empty.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between font-bold mb-1">
                        <span>{item.name}</span>
                        <span>
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-full px-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                            className="p-1 hover:text-orange-500 disabled:opacity-30"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:text-orange-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:underline"
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
              <div className="pt-6 border-t border-gray-100">
                <div className="flex justify-between text-xl font-serif font-bold mb-6">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-[#1c1c1c] text-[#d4af37] py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-black transition-colors"
                >
                  Complete Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76690b67f61?auto=format&fit=crop&q=80&w=2000"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c] via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="text-[#d4af37] text-sm md:text-base font-sans tracking-[0.3em] uppercase mb-6 animate-fade-in">
            Fine Dining Experience
          </div>
          <h1 className="text-5xl md:text-8xl font-bold mb-8 tracking-tight">
            {displayName}
          </h1>
          <p className="max-w-xl mx-auto text-gray-400 mb-12 font-sans font-light leading-relaxed">
            A culinary journey through contemporary flavors and traditional
            techniques.
          </p>
          <button
            onClick={() =>
              document
                .getElementById("menu")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="border border-white/20 px-8 py-4 text-xs font-sans font-bold tracking-[0.2em] uppercase hover:border-[#d4af37] hover:text-[#d4af37] transition-all"
          >
            View Menu
          </button>
        </div>
      </header>

      {/* Info Metrics */}
      <div className="bg-[#161616] border-y border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-8 text-center font-sans">
          <div className="flex flex-col items-center">
            <div className="text-[#d4af37] mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
              Opening Hours
            </h3>
            <p className="text-gray-500 text-sm">Mon-Sun: 17:00 - 23:00</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[#d4af37] mb-4">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
              Location
            </h3>
            <p className="text-gray-500 text-sm">Victoria Island, Lagos</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-[#d4af37] mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2">
              Michelin Guide
            </h3>
            <p className="text-gray-500 text-sm">2024 Selection</p>
          </div>
        </div>
      </div>

      {/* Menu Section */}
      <section id="menu" className="py-24 max-w-5xl mx-auto px-8">
        <div className="text-center mb-20">
          <span className="text-[#d4af37] font-sans text-xs tracking-[0.2em] uppercase block mb-4">
            Our Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">Seasonal Menu</h2>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            Preparing menu...
          </div>
        ) : (
          <div className="space-y-20">
            {Object.entries(menuSections).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-3xl font-serif text-[#d4af37] mb-8 border-b border-white/10 pb-4 inline-block pr-12">
                  {category}
                </h3>
                <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
                  {items.map((dish) => (
                    <div key={dish.id} className="group cursor-pointer">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-xl font-bold group-hover:text-[#d4af37] transition-colors">
                          {dish.name}
                        </h4>
                        <div className="flex-1 mx-4 border-b border-white/10 border-dotted h-1"></div>
                        <span className="text-lg font-mono text-[#d4af37]">
                          ₦{dish.price.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-500 text-sm italic mb-3">
                        {dish.description}
                      </p>
                      <button
                        onClick={() => addToCart(dish)}
                        className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#d4af37] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                      >
                        + Add to Order
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reservation / CTA */}
      <section id="reservations" className="py-24 bg-[#161616] mt-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Reservations</h2>
          <p className="text-gray-400 mb-10 max-w-xl mx-auto">
            Book your table for an unforgettable evening. For private events,
            please contact us directly.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <input
              type="date"
              className="bg-[#1c1c1c] border border-white/10 text-white px-6 py-4 rounded-none focus:border-[#d4af37] outline-none"
            />
            <select className="bg-[#1c1c1c] border border-white/10 text-white px-6 py-4 rounded-none focus:border-[#d4af37] outline-none">
              <option>2 Guests</option>
              <option>4 Guests</option>
              <option>6+ Guests</option>
            </select>
            <button className="bg-[#d4af37] text-black px-10 py-4 font-bold font-sans tracking-widest uppercase hover:bg-white transition-colors">
              Find Table
            </button>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center text-gray-600 text-xs font-sans tracking-widest uppercase">
        <p>&copy; 2024 {displayName}.</p>
      </footer>
    </div>
  );
}
