import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingCart, X, Star, BookOpen } from "lucide-react";

export function SkillAcademyCourses({
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
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="font-bold text-2xl text-purple-600 flex items-center gap-2">
              <BookOpen className="w-6 h-6" />
              {displayName}
            </div>
            <div className="hidden md:flex gap-6 text-sm font-medium text-gray-600">
              <a href="#" className="hover:text-purple-600">
                Categories
              </a>
              <a href="#" className="hover:text-purple-600">
                Mentors
              </a>
              <a href="#" className="hover:text-purple-600">
                Business
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-gray-600 hover:text-purple-600">
              Log in
            </button>
            <button className="bg-black text-white px-4 py-2 text-sm font-bold rounded hover:bg-gray-800">
              Sign up
            </button>
            <button
              className="relative p-2 hover:bg-gray-100 rounded-full text-gray-600"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-lg">Shopping Cart</h2>
              <button onClick={() => setIsCartOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-10 opacity-60">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  Your cart is empty. Keep learning!
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-gray-100 pb-4"
                  >
                    <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      {item.image && (
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <div className="text-xs text-gray-500 mb-2">
                        By Expert Instructor
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-purple-700">
                          ₦{item.price.toLocaleString()}
                        </span>
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
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex justify-between text-xl font-bold mb-4">
                  <span>Total:</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-purple-600 text-white py-3 font-bold rounded hover:bg-purple-700 shadow-lg"
                >
                  Checkout Now
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 flex items-center justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
              Unlock your potential with{" "}
              <span className="text-purple-600">new skills</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg">
              Join thousands of learners worldwide. Master design, coding,
              marketing and more from industry leaders.
            </p>
            <div className="flex gap-4">
              <button className="bg-black text-white px-8 py-3 font-bold rounded hover:bg-gray-800">
                View All Courses
              </button>
            </div>
          </div>
          <div className="hidden md:block relative w-96 h-80">
            <div className="absolute inset-0 bg-purple-100 rounded-2xl transform rotate-6"></div>
            <div className="absolute inset-0 bg-white border border-gray-200 rounded-2xl shadow-xl flex items-center justify-center p-8">
              {/* Abstract graphic */}
              <div className="grid grid-cols-2 gap-4 w-full h-full">
                <div className="bg-purple-600 rounded-lg opacity-10 col-span-2 h-32"></div>
                <div className="bg-orange-400 rounded-lg opacity-20 h-24"></div>
                <div className="bg-blue-400 rounded-lg opacity-20 h-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trusted By */}
      <div className="bg-gray-50 py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Trusted by teams at
          </p>
          <div className="flex justify-center gap-12 opacity-40 grayscale font-bold text-xl">
            <span>GOOGLE</span>
            <span>NETFLIX</span>
            <span>SPOTIFY</span>
            <span>AMAZON</span>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-8 text-gray-900">
          Featured Courses
        </h2>

        {isLoading && products.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            Loading courses...
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-xl">
            <p className="text-gray-400">No active courses.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group flex flex-col h-full cursor-pointer"
                onClick={() => addToCart(course)}
              >
                <div className="aspect-video bg-gray-100 relative">
                  <img
                    src={
                      course.image ||
                      `https://via.placeholder.com/300x200?text=${encodeURIComponent(course.name)}`
                    }
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 h-[48px]">
                    {course.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2 truncate">
                    Dr. Angela Yu, Developer Bootcamp
                  </p>

                  <div className="flex items-center gap-1 text-xs font-bold text-orange-500 mb-2">
                    <span className="flex items-center">
                      4.8 <Star className="w-3 h-3 fill-current ml-1" />
                    </span>
                    <span className="text-gray-400 font-normal">(1,204)</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                    <span className="font-bold text-lg text-gray-900">
                      ₦{course.price.toLocaleString()}
                    </span>
                    <button className="bg-purple-100 text-purple-700 px-3 py-1 text-xs font-bold rounded hover:bg-purple-200">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-gray-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-sm text-gray-500">
          <div>
            <div className="font-bold text-gray-900 mb-4 text-lg">
              {displayName}
            </div>
            <p>Empowering learners worldwide.</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-4">Teach</h4>
            <ul className="space-y-2">
              <li>Become an instructor</li>
              <li>Teacher Rules</li>
              <li>Teaching Academy</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
