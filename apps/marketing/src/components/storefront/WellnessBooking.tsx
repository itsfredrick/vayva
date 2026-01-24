import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingBag, X, Plus, Minus } from "lucide-react";
import { Button } from "@vayva/ui";

export function WellnessBooking({
  storeName: initialStoreName,
  storeSlug,
}: {
  storeName: string;
  storeSlug?: string;
}): React.JSX.Element {
  const { store } = useStorefrontStore(storeSlug);
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 12,
  });

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
    <div className="font-sans bg-[#FAF7F5] text-[#5D5D5D] min-h-screen">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="text-2xl font-serif text-[#8B7355] font-bold">
          {displayName}
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium uppercase tracking-wider text-[#8B7355]">
          <a href="#" className="hover:text-[#5D5D5D]">
            Treatments
          </a>
          <a href="#" className="hover:text-[#5D5D5D]">
            About
          </a>
          <a href="#" className="hover:text-[#5D5D5D]">
            Contact
          </a>
        </div>
        <Button
          variant="primary"
          className="flex items-center gap-2 bg-[#8B7355] text-white px-5 py-2 rounded-full hover:bg-[#6F5B43] transition-colors h-auto"
          onClick={() => setIsCartOpen(true)}
          aria-label={`View ${cart.length} bookings`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Bookings ({cart.length})
          </span>
        </Button>
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-[#8B7355]/30 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#FAF7F5] h-full p-8 flex flex-col shadow-2xl animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-8 border-b border-[#D8CFC4] pb-6">
              <h2 className="text-2xl font-serif text-[#8B7355]">
                Your Sessions
              </h2>
              <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)} aria-label="Close bookings side bar">
                <X className="w-6 h-6 text-[#8B7355]" />
              </Button>
            </div>

            <div className="flex-1 overflow-auto space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-20 text-[#A8A29E] italic">
                  No treatments selected.
                </div>
              ) : (
                cart.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 rounded-xl shadow-sm flex flex-col gap-2"
                  >
                    <div className="flex justify-between font-bold text-[#5D5D5D]">
                      <span>{item.name}</span>
                      <span className="text-[#8B7355]">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="text-xs text-[#8B7355] font-medium uppercase tracking-wider flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:bg-[#FAF7F5] rounded h-6 w-6"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span>{item.quantity} Session(s)</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:bg-[#FAF7F5] rounded h-6 w-6"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <Button
                        variant="link"
                        onClick={() => removeFromCart(item.id)}
                        className="text-xs text-red-400 hover:text-red-500 p-0 h-auto"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="pt-6 border-t border-[#D8CFC4]">
                <div className="flex justify-between text-xl font-serif text-[#8B7355] font-bold mb-6">
                  <span>Total</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <Button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-[#8B7355] text-white py-6 h-auto rounded-full font-bold uppercase tracking-widest hover:bg-[#6F5B43] shadow-lg shadow-[#D8CFC4] transition-all"
                >
                  Confirm Booking
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="relative py-24 px-8 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-[#2d2d2d] mb-6 leading-tight">
            Restore your balance.
          </h1>
          <p className="text-lg text-[#888] mb-10 max-w-xl mx-auto leading-relaxed">
            Experience holistic treatments designed to rejuvenate your mind,
            body and spirit. Book your appointment online today.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="px-8 py-6 bg-[#8B7355] text-white rounded-full font-medium shadow-lg hover:bg-[#6F5B43] transition-colors h-auto">
              Book an Appointment
            </Button>
          </div>
        </div>
      </header>

      {/* Services Grid */}
      <section className="py-20 px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif text-[#2d2d2d] mb-3">
            Our Treatments
          </h2>
          <div className="w-20 h-1 bg-[#8B7355] mx-auto opacity-30"></div>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            Loading services...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <p className="text-[#8B7355]">No services available.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((service: any) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group border border-[#F0EBE5]"
              >
                <div className="aspect-video bg-[#FAF7F5] relative overflow-hidden">
                  <img
                    src={
                      service.image ||
                      `https://via.placeholder.com/400x300?text=${encodeURIComponent(service.name)}`
                    }
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#8B7355]">
                    60 min
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-xl font-serif font-bold text-[#2d2d2d] mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-[#888] mb-6 line-clamp-3 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-[#F0EBE5]">
                    <div className="text-lg font-bold text-[#8B7355]">
                      ₦{service.price.toLocaleString()}
                    </div>
                    <Button
                      variant="link"
                      onClick={() => addToCart(service)}
                      className="text-sm font-bold text-[#5D5D5D] hover:text-[#8B7355] uppercase tracking-wider flex items-center gap-1 p-0 h-auto"
                    >
                      Book Now <span className="text-lg">→</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-white py-12 text-center text-[#888] text-sm mt-12 border-t border-[#F0EBE5]">
        <p>&copy; 2024 {displayName} Wellness.</p>
      </footer>
    </div>
  );
}
