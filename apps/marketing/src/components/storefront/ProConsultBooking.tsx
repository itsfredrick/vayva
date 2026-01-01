import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import {
  ShoppingBag,
  X,
  Calendar,
  Linkedin,
  ArrowRight,
  Plus,
  Minus,
  Video,
} from "lucide-react";

export function ProConsultBooking({
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
    <div className="bg-white min-h-screen font-sans text-slate-800">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Navbar */}
      <nav className="border-b border-slate-100 flex justify-between items-center px-8 py-5 sticky top-0 bg-white/90 backdrop-blur z-50">
        <div className="flex items-center gap-3 font-bold text-xl text-slate-900 tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-lg">
            P
          </div>
          {displayName}
        </div>
        <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-500">
          <a href="#" className="hover:text-blue-600">
            Experts
          </a>
          <a href="#" className="hover:text-blue-600">
            Services
          </a>
          <a href="#" className="hover:text-blue-600">
            Enterprise
          </a>
        </div>
        <div className="flex gap-4">
          <button className="text-sm font-bold text-slate-600 hover:text-blue-600">
            Login
          </button>
          <button
            className="px-5 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 flex items-center gap-2"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Bookings ({cart.length})</span>
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full p-6 flex flex-col shadow-2xl animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">
                Session Summary
              </h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">
                    No sessions scheduled.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="border border-slate-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 text-sm">
                        {item.name}
                      </h3>
                      <span className="font-bold text-blue-600 text-sm">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1 text-xs font-medium text-slate-500 bg-slate-50 rounded px-2 py-1">
                        <Video className="w-3 h-3" />
                        <span>Video Call</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-slate-200 rounded px-1">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 hover:text-blue-600"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs px-2">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 hover:text-blue-600"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-500 hover:text-red-700"
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
              <div className="pt-6 border-t border-slate-100 mt-4">
                <div className="flex justify-between text-lg font-bold mb-6 text-slate-900">
                  <span>Total Due</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                >
                  Confirm & Pay
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <header className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-20"></div>
        <div className="max-w-6xl mx-auto px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold mb-6 border border-blue-500/30">
              TRUSTED BY 500+ COMPANIES
            </div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Expert advice,
              <br />
              on demand.
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-md">
              Connect with top-tier consultants across tech, marketing, legal,
              and finance via high-quality video calls.
            </p>
            <div className="flex gap-4">
              <button className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 transition-colors">
                Find an Expert
              </button>
              <button className="px-8 py-3 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 transition-colors backdrop-blur">
                How it Works
              </button>
            </div>
          </div>
          <div className="hidden md:block relative">
            {/* Abstract illustration placeholder could go here */}
            <div className="aspect-square bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl opacity-20 blur-3xl absolute inset-0"></div>
            <div className="relative bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-2xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 w-32 bg-slate-600 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-slate-700 rounded"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-700 rounded"></div>
                <div className="h-2 w-5/6 bg-slate-700 rounded"></div>
                <div className="h-2 w-4/6 bg-slate-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Experts Grid */}
      <section className="py-24 max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Available Consultants
            </h2>
            <p className="text-slate-500">Book a 1-on-1 session today.</p>
          </div>
          <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            View All Categories <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl">
            <p className="text-slate-400">Loading experts...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No active consultants found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((expert) => (
              <div
                key={expert.id}
                className="border border-slate-200 rounded-xl hover:shadow-xl hover:border-blue-100 transition-all bg-white group cursor-pointer"
                onClick={() => addToCart(expert)}
              >
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden border-2 border-white shadow-sm">
                      <img
                        src={
                          expert.image ||
                          `https://via.placeholder.com/100x100?text=${expert.name.charAt(0)}`
                        }
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>{" "}
                      Available
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {expert.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 min-h-[40px]">
                    {expert.description ||
                      "Senior Consultant specialized in business strategy and growth."}
                  </p>

                  <div className="flex gap-2 mb-6">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                      Strategy
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium">
                      Growth
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div>
                      <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">
                        Rate
                      </span>
                      <div className="text-slate-900 font-bold">
                        ₦{expert.price.toLocaleString()}{" "}
                        <span className="text-xs font-normal text-slate-400">
                          / session
                        </span>
                      </div>
                    </div>
                    <button className="bg-slate-900 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors group-hover:shadow-lg">
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="bg-white border-t border-slate-100 py-12 text-center text-slate-400 text-sm">
        <p>&copy; 2024 {displayName} Consulting.</p>
      </footer>
    </div>
  );
}
