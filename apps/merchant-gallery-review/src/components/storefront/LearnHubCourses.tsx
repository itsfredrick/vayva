import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingBag, X, Star, Globe, CheckCircle } from "lucide-react";

export function LearnHubCourses({
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
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#333]">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Header */}
      <nav className="bg-blue-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <Globe className="w-6 h-6" />
            {displayName}
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <a href="#" className="opacity-90 hover:opacity-100">
              Degrees
            </a>
            <a href="#" className="opacity-90 hover:opacity-100">
              Certificates
            </a>
            <a href="#" className="opacity-90 hover:opacity-100">
              For Business
            </a>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-sm font-bold opacity-90 hover:opacity-100">
              Log In
            </button>
            <button
              className="bg-white text-blue-600 px-4 py-2 rounded font-bold text-sm hover:bg-blue-50 transition-colors flex items-center gap-2"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-4 h-4" />
              {cart.length > 0 && <span>({cart.length})</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="font-bold text-xl text-blue-900">
                Your Learning Plan
              </h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  <p className="text-gray-400">Cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-100 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-800 text-sm">
                        {item.name}
                      </h3>
                      <span className="font-bold text-blue-600">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-green-600 font-bold flex items-center gap-1 mb-4">
                      <CheckCircle className="w-3 h-3" /> Includes Certificate
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-xs text-red-500 font-medium hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex justify-between text-lg font-bold mb-4">
                  <span>Total:</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-blue-600 text-white py-3 font-bold rounded shadow-lg hover:bg-blue-700 transition-colors"
                >
                  Proceed to Payment
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-20 flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1f1f1f] tracking-tight">
              Learn without limits
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg">
              Build skills with courses, certificates, and degrees online from
              world-class universities and companies.
            </p>
            <div className="flex gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 font-bold rounded text-lg shadow-blue-200 shadow-xl hover:bg-blue-700 transition-colors">
                Start Learning Free
              </button>
              <button className="border border-blue-600 text-blue-600 px-8 py-4 font-bold rounded text-lg hover:bg-blue-50 transition-colors">
                Career Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-gray-100 border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 flex justify-around text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-1">82%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Report Career Benefits
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-1">100+</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Global Partners
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600 mb-1">24/7</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Online Support
            </div>
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8 text-[#1f1f1f]">
          Most Popular Certificates
        </h2>

        {isLoading && products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Loading courses...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border border-gray-200 rounded-lg">
            <p className="text-gray-400">No courses found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((course) => (
              <div
                key={course.id}
                className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all h-full flex flex-col group cursor-pointer"
                onClick={() => addToCart(course)}
              >
                <div className="h-40 bg-gray-200 relative">
                  <img
                    src={
                      course.image ||
                      `https://via.placeholder.com/300x200?text=${encodeURIComponent(course.name)}`
                    }
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
                    Professional Cert
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-gray-100 rounded-full"></div>
                    <span className="text-xs font-bold text-gray-500">IBM</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                    {course.name}
                  </h3>

                  <div className="flex items-center gap-1 text-sm font-bold text-yellow-500 mb-4">
                    4.7 <Star className="w-4 h-4 fill-current" />
                    <span className="text-gray-400 font-normal ml-1 text-xs">
                      (45k reviews)
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-6 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="font-bold text-lg text-blue-700">
                      ₦{course.price.toLocaleString()}
                    </div>
                    <button className="text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      Enroll Now →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-gray-200 mt-20 py-12 text-center text-gray-500 text-sm">
        &copy; 2024 {displayName} Inc. All rights reserved.
      </footer>
    </div>
  );
}
