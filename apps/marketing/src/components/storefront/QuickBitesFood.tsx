"use client";

import React, { useState, useMemo } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import {
  ShoppingBag,
  ChevronRight,
  Search,
  Star,
  Clock,
  Heart,
  Plus,
  Minus,
  X,
  Menu
} from "lucide-react";
import { Button } from "@vayva/ui";

export interface QuickBitesFoodProps {
  storeName?: string;
  storeSlug?: string;
  bannerTitle?: string;
  bannerCode?: string;
  bannerDiscount?: string;
}

export function QuickBitesFood({
  storeName: initialStoreName,
  storeSlug,
  bannerTitle = "Get 20% off your first order!",
  bannerCode = "VAYVA20",
  bannerDiscount = "20%",
}: QuickBitesFoodProps): React.JSX.Element {
  const { store } = useStorefrontStore(storeSlug);
  const { products, isLoading } = useStorefrontProducts(storeSlug, {
    limit: 100,
  });

  // Cart Logic
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Category Logic
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const unique = new Set(products.map((p: any) => p.category || "Popular"));
    return ["All", ...Array.from(unique)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [selectedCategory, products]);

  const displayName = store?.name || initialStoreName || "Food Store";

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Sidebar Navigation (Desktop) */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-shrink-0 flex flex-col justify-between p-6 overflow-y-auto hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-10 text-orange-500">
            <div className="bg-orange-100 p-2 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-black line-clamp-1">
              {displayName}
            </span>
          </div>

          <nav className="space-y-2">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
              Menu
            </div>
            {categories.map((cat: any) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "primary" : "ghost"}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full justify-start px-4 py-3 rounded-xl text-sm font-medium transition-colors h-auto ${selectedCategory === cat ? "bg-orange-500 text-white shadow-lg shadow-orange-200" : "text-gray-500 hover:bg-gray-50 bg-transparent"}`}
              >
                {cat}
              </Button>
            ))}
          </nav>
        </div>

        <div className="mt-8 bg-blue-500 rounded-2xl p-6 text-white text-center relative overflow-hidden shadow-lg shadow-blue-200">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Star className="w-12 h-12" />
          </div>
          <div className="relative z-10">
            <div className="font-bold text-lg mb-1">Free Delivery</div>
            <p className="text-xs text-blue-100 mb-3">
              On all orders over ₦5,000
            </p>
            <Button className="text-xs bg-white text-blue-500 px-4 py-2 rounded-lg font-bold hover:bg-blue-50 transition-colors h-auto">
              Details
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
          <aside className="w-64 bg-white h-full p-6 animate-in slide-in-from-left" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <span className="font-bold text-xl">{displayName}</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} aria-label="Close mobile menu"><X className="w-5 h-5" /></Button>
            </div>
            <nav className="space-y-2">
              {categories.map((cat: any) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "primary" : "ghost"}
                  onClick={() => { setSelectedCategory(cat); setIsMobileMenuOpen(false); }}
                  className={`w-full justify-start px-4 py-3 rounded-xl text-sm font-medium h-auto ${selectedCategory === cat ? "bg-orange-500 text-white" : "text-gray-500 bg-transparent"}`}
                >
                  {cat}
                </Button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden p-2 text-gray-500"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-4 bg-gray-100 px-4 py-2 rounded-xl w-full md:w-96 transition-all focus-within:ring-2 focus-within:ring-orange-200 focus-within:bg-white">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${displayName}...`}
                className="bg-transparent border-none text-sm w-full focus:outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden p-2 bg-orange-100 text-orange-600 rounded-lg relative"
            onClick={() => setIsCartOpen(true)}
            aria-label={`View cart with ${cart.length} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 text-[10px] rounded-full flex items-center justify-center font-bold">{cart.length}</span>}
          </Button>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 md:pb-8">
          <div className="bg-orange-500 rounded-3xl p-8 mb-10 text-white flex items-center justify-between shadow-xl shadow-orange-200 bg-[url('https://www.transparenttextures.com/patterns/food.png')]">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {bannerTitle}
              </h2>
              <p className="text-orange-100">
                Use code:{" "}
                <span className="font-mono bg-white/20 px-2 py-0.5 rounded font-bold tracking-widest border border-white/30">
                  {bannerCode}
                </span>
              </p>
            </div>
            <div className="text-4xl md:text-6xl animate-bounce duration-3000">🍔</div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedCategory} Menu
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {filteredProducts.map((p: any) => (
                <div
                  key={p.id}
                  className="bg-white p-4 rounded-2xl border border-gray-100 hover:shadow-lg transition-all group cursor-pointer hover:-translate-y-1"
                  onClick={() => addToCart(p)}
                >
                  <div className="aspect-video bg-gray-50 rounded-xl mb-4 overflow-hidden relative">
                    <img
                      src={
                        p.image ||
                        `https://via.placeholder.com/300x200?text=${p.name}`
                      }
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Button
                      variant="primary"
                      size="icon"
                      className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-orange-500 hover:text-white h-8 w-8"
                      aria-label="Add to bag"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-900 leading-tight">{p.name}</h3>
                    <span className="font-bold text-orange-500 whitespace-nowrap ml-2">
                      ₦{p.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cart Sidebar (Right) - Persistent on Desktop logic removed for cleaner mobile-first approach, now toggle only */}
      <aside
        className={`fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-100 shadow-2xl transform transition-transform duration-300 z-50 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white z-10">
          <h3 className="font-bold text-lg">My Order</h3>
          <div className="flex items-center gap-3">
            <div className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold">
              {cart.length}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(false)}
              className="hover:bg-gray-100 p-1 rounded-full text-gray-500"
              aria-label="Close bag sidebar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 h-[calc(100vh-200px)]">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl">🥣</div>
              <p>Your plate is empty</p>
            </div>
          ) : (
            cart.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-center animate-in slide-in-from-right-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm mb-1 truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1 hover:bg-white rounded transition-colors text-gray-600 h-6 w-6"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="text-xs font-bold w-4 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1 hover:bg-white rounded transition-colors text-gray-600 h-6 w-6"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gray-50 border-t border-gray-100">
          <div className="space-y-2 mb-6">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>
          <Button
            disabled={cart.length === 0}
            onClick={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
            className="w-full bg-orange-500 text-white py-6 h-auto rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-600 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            Checkout <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </aside>
    </div>
  );
}
