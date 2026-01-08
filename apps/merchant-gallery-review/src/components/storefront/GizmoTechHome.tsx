import React, { useState } from "react";
import {
  useStorefrontProducts,
  useStorefrontStore,
} from "@/hooks/storefront/useStorefront";
import { useStorefrontCart } from "@/hooks/storefront/useStorefrontCart";
import { CheckoutModal } from "./CheckoutModal";
import { ShoppingCart, X, Plus, Minus, Cpu } from "lucide-react";

export function GizmoTechHome({
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
    <div className="min-h-screen bg-[#050505] text-[#00ff41] font-mono selection:bg-[#003300] selection:text-[#00ff41]">
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        total={total}
        storeSlug={storeSlug || ""}
        onSuccess={clearCart}
      />

      {/* Matrix Background */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(0deg, transparent 24%, rgba(0, 255, 65, .3) 25%, rgba(0, 255, 65, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, .3) 75%, rgba(0, 255, 65, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(0, 255, 65, .3) 25%, rgba(0, 255, 65, .3) 26%, transparent 27%, transparent 74%, rgba(0, 255, 65, .3) 75%, rgba(0, 255, 65, .3) 76%, transparent 77%, transparent)",
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Header / HUD */}
      <header className="border-b border-[#00ff41]/30 sticky top-0 bg-[#050505]/90 backdrop-blur z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Cpu className="w-6 h-6 animate-pulse" />
            <span className="text-xl font-bold tracking-widest">
              {displayName}
            </span>
          </div>
          <div className="flex gap-6 text-xs md:text-sm uppercase tracking-widest">
            <button className="hover:bg-[#00ff41] hover:text-black px-2 py-1 transition-colors">
              Modules
            </button>
            <button className="hover:bg-[#00ff41] hover:text-black px-2 py-1 transition-colors">
              Components
            </button>
            <button
              className="hover:bg-[#00ff41] hover:text-black px-2 py-1 transition-colors flex items-center gap-2 border border-[#00ff41]/20"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>SYSTEM.CART({cart.length})</span>
            </button>
          </div>
        </div>
      </header>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-mono">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="relative w-full max-w-md bg-[#0a0a0a] border-l border-[#00ff41] h-full p-6 flex flex-col shadow-[0_0_50px_rgba(0,255,65,0.1)]">
            <div className="flex justify-between items-center mb-6 border-b border-[#00ff41]/30 pb-4">
              <h2 className="text-xl font-bold uppercase tracking-widest">
                System Inventory
              </h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-auto space-y-6 scrollbar-thin scrollbar-thumb-[#00ff41]/20">
              {cart.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                  [NO_ITEMS_DETECTED]
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 border border-[#00ff41]/10 p-2 bg-[#00ff41]/5"
                  >
                    <div className="w-16 h-16 bg-black border border-[#00ff41]/30 flex items-center justify-center">
                      {item.image ? (
                        <img
                          src={item.image}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Cpu className="w-8 h-8 opacity-50" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h3 className="text-xs font-bold truncate pr-4">
                          {item.name}
                        </h3>
                        <span className="text-xs">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 text-xs">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="hover:text-white"
                          >
                            [ - ]
                          </button>
                          <span className="w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="hover:text-white"
                          >
                            [ + ]
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[10px] text-red-500 hover:text-red-400"
                        >
                          Term.Process
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-[#00ff41]/30 pt-6 mt-6">
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>TOTAL_LOAD</span>
                  <span>₦{total.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-[#00ff41] text-black py-4 font-bold uppercase hover:bg-white hover:shadow-[0_0_20px_rgba(0,255,65,0.5)] transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Featured Hardware */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8 border-b border-[#00ff41]/30 pb-2">
          <h2 className="text-2xl uppercase tracking-widest">
            Latest Hardware
          </h2>
          <div className="text-xs animate-pulse">STATUS: ONLINE</div>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="py-20 text-center animate-pulse">
            Scanning database...
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center border border-[#00ff41]/30 border-dashed">
            <p className="opacity-70">No hardware found in sector.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-4 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="group border border-[#00ff41]/30 bg-black hover:bg-[#00ff41]/5 transition-all relative overflow-hidden"
              >
                {/* Decorators */}
                <div className="absolute top-0 right-0 p-1">
                  <div className="w-2 h-2 bg-[#00ff41]/50"></div>
                </div>
                <div className="absolute bottom-0 left-0 p-1">
                  <div className="w-2 h-2 bg-[#00ff41]/50"></div>
                </div>

                <div className="aspect-square bg-[#050505] relative flex items-center justify-center border-b border-[#00ff41]/20">
                  <img
                    src={
                      product.image ||
                      `https://via.placeholder.com/400x400/000/0f0?text=${encodeURIComponent(product.name)}`
                    }
                    alt={product.name}
                    className="max-w-[80%] max-h-[80%] object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  {/* Specs overlay */}
                  <div className="absolute bottom-2 left-2 text-[10px] font-mono opacity-50 group-hover:opacity-100">
                    MK-II // {product.id.substring(0, 4)}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-sm mb-1 truncate">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center text-xs text-[#00ff41]/70 mb-4">
                    <span>{product.category || "Unit"}</span>
                    <span>In Stock</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-lg">
                      ₦{product.price.toLocaleString()}
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      className="px-3 py-1 bg-[#00ff41]/10 border border-[#00ff41] hover:bg-[#00ff41] hover:text-black text-xs font-bold uppercase transition-colors"
                    >
                      Acquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#00ff41]/30 mt-20 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs opacity-50">
          <p>SYSTEM_ID: {storeSlug || "UNKNOWN"}</p>
          <p className="mt-2">
            © {new Date().getFullYear()} {displayName} Industries. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
