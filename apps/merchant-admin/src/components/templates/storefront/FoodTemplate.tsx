"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { StorefrontConfig, StorefrontProduct } from "@/types/storefront";
import { getThemeStyles } from "@/utils/theme-utils";
import { WhatsAppPreviewModal } from "./WhatsAppPreviewModal";
import { StorefrontProvider, useStorefront } from "./StorefrontContext";
import { VayvaLogo } from "@/components/VayvaLogo";
import { KitchenService } from "@/services/KitchenService";

// --- Sub-Components (Views) ---

const FoodHeader = ({ config }: { config: StorefrontConfig }) => {
  const theme = getThemeStyles(config.theme);
  const { cartCount, navigate } = useStorefront();

  return (
    <header
      className={cn(
        "sticky top-[30px] z-40 backdrop-blur-md border-b flex-none transition-all",
        theme.bg + "/95",
        theme.border,
      )}
    >
      <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("home")}
        >
          <img
            src="/logo-icon.png"
            alt="Vayva"
            className="w-10 h-10 object-contain"
          />
          <span className="font-bold text-xl tracking-tight">
            CRAVE<span className="text-amber-500">.</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            className={cn(
              "hidden md:flex rounded-full px-4 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 border-0",
            )}
            onClick={() => {
              /* Trigger WhatsApp Global */
            }}
          >
            Order on WhatsApp
          </Button>

          <button
            className="relative p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors group"
            onClick={() => navigate("cart")}
          >
            <Icon
              name="ShoppingBag"
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

const FoodProductModal = ({
  config,
  openWhatsApp,
}: {
  config: StorefrontConfig;
  openWhatsApp: (p: string, m: string) => void;
}) => {
  const theme = getThemeStyles(config.theme);
  const { currentProduct, addToCart, navigate } = useStorefront();

  // State
  const [qty, setQty] = useState(1);
  const [modifiers, setModifiers] = useState<Record<string, string[]>>({}); // { "Protein": ["Beef"], "Extras": ["Slaw", "MoiMoi"] }
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (!currentProduct) return;

    // Calculate total price based on base + modifiers
    let price = currentProduct.price;
    if (currentProduct.modifiers) {
      Object.entries(modifiers).forEach(([modName, selectedOpts]) => {
        const modDef = currentProduct.modifiers?.find(
          (m) => m.name === modName,
        );
        if (modDef) {
          selectedOpts.forEach((optLabel) => {
            const opt = modDef.options.find((o) => o.label === optLabel);
            if (opt) price += opt.price;
          });
        }
      });
    }
    setTotalPrice(price * qty);
  }, [currentProduct, modifiers, qty]);

  if (!currentProduct) return null;

  const toggleModifier = (
    modName: string,
    optLabel: string,
    type: "single" | "multiple",
  ) => {
    setModifiers((prev) => {
      const current = prev[modName] || [];
      if (type === "single") {
        // Radio behavior
        return { ...prev, [modName]: [optLabel] };
      } else {
        // Checkbox behavior
        if (current.includes(optLabel)) {
          return { ...prev, [modName]: current.filter((o) => o !== optLabel) };
        } else {
          return { ...prev, [modName]: [...current, optLabel] };
        }
      }
    });
  };

  const handleAddToCart = () => {
    // Enforce required? (Skipping for MVP)
    addToCart(currentProduct, qty, {}, modifiers);
    navigate("home"); // Close modal logic usually returns to list, or stay? Let's go home (menu)
  };

  const handleWhatsAppBuy = () => {
    const modStr = Object.entries(modifiers)
      .map(([k, v]) => `${k}: ${v.join(", ")}`)
      .join(" | ");
    const message = `Hello, I'd like to order: \n${qty}x ${currentProduct.name} \n(${modStr})`;
    openWhatsApp(currentProduct.name, message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
        onClick={() => navigate("home")}
      />

      {/* Modal Card */}
      <div className="bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 duration-300 overflow-hidden">
        {/* Image Header */}
        <div className="relative h-48 sm:h-56 bg-gray-100 shrink-0">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Icon name={currentProduct.image as any} size={64} />
          </div>
          <button
            onClick={() => navigate("home")}
            className="absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-1">{currentProduct.name}</h2>
          <p className="text-sm opacity-60 mb-6">
            {currentProduct.description}
          </p>

          {/* Modifiers */}
          <div className="space-y-6">
            {currentProduct.modifiers?.map((mod) => (
              <div key={mod.name}>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-sm bg-gray-100 px-2 py-1 rounded-md">
                    {mod.name}
                  </h3>
                  <span className="text-[10px] uppercase font-bold text-gray-400">
                    {mod.type === "single" ? "Required" : "Optional"}
                  </span>
                </div>
                <div className="space-y-2">
                  {mod.options.map((opt) => {
                    const isSelected = modifiers[mod.name]?.includes(opt.label);
                    return (
                      <div
                        key={opt.label}
                        onClick={() =>
                          toggleModifier(mod.name, opt.label, mod.type)
                        }
                        className={cn(
                          "flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all",
                          isSelected
                            ? "border-amber-500 bg-amber-50"
                            : "border-gray-100 hover:bg-gray-50",
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center",
                              isSelected
                                ? "border-amber-500"
                                : "border-gray-300",
                            )}
                          >
                            {isSelected && (
                              <div className="w-2 h-2 rounded-full bg-amber-500" />
                            )}
                          </div>
                          <span className="text-sm font-medium">
                            {opt.label}
                          </span>
                        </div>
                        {opt.price > 0 && (
                          <span className="text-xs text-gray-500">
                            +₦{opt.price}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-white safe-area-bottom">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4 bg-gray-100 rounded-full px-2 py-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors font-bold text-lg"
              >
                -
              </button>
              <span className="font-bold text-sm w-4 text-center">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors font-bold text-lg"
              >
                +
              </button>
            </div>
            <span className="font-extrabold text-xl">
              ₦{totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="rounded-xl h-12 font-bold"
              onClick={handleWhatsAppBuy}
            >
              WhatsApp
            </Button>
            <Button
              className="rounded-xl h-12 font-bold bg-amber-500 hover:bg-amber-600 text-white border-0"
              onClick={handleAddToCart}
            >
              Add to Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FoodHome = ({ config }: { config: StorefrontConfig }) => {
  const { content } = config;
  const { navigate } = useStorefront();
  const menu = (content.menu || []) as any[];
  const categories = Array.from(new Set(menu.map((m) => m.cat)));

  const scrollToCat = (cat: string) => {
    const el = document.getElementById(`cat-${cat}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24">
      {/* Hero */}
      <section className="px-4 pt-8 pb-6 text-center">
        <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white rounded-3xl p-8 shadow-xl mb-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full mb-4 inline-block">
              Open till 9PM
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
              {content.headline}
            </h1>
            <p className="opacity-80 text-sm max-w-md mx-auto mb-6">
              {content.subtext}
            </p>
            <Button
              className="bg-white text-black hover:bg-gray-100 rounded-full font-bold px-8"
              onClick={() => scrollToCat(categories[0] as string)}
            >
              View Menu
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Sticky Nav */}
      <div className="sticky top-[93px] z-30 py-3 bg-white/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar scroll-pl-4">
          {categories.map((c: any, i) => (
            <button
              key={c}
              onClick={() => scrollToCat(c)}
              className={cn(
                "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0",
                i === 0
                  ? "bg-black text-white border-black"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-10">
        {categories.map((cat: any) => {
          const items = menu.filter((m: any) => m.cat === cat);
          return (
            <div key={cat} id={`cat-${cat}`} className="scroll-mt-40">
              <h3 className="font-extrabold text-xl mb-4">{cat}</h3>
              <div className="grid gap-4">
                {items.map((item: any) => (
                  <div
                    key={item.id}
                    className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-4 cursor-pointer hover:border-amber-200 transition-colors group"
                    onClick={() => navigate("product_detail", item)}
                  >
                    <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center text-gray-300">
                      <Icon name="Utensils" size={24} />
                    </div>
                    <div className="flex-1 py-1 flex flex-col">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm leading-tight group-hover:text-amber-600 transition-colors">
                          {item.name}
                        </h4>
                        <span className="font-bold text-sm bg-gray-50 px-2 py-0.5 rounded-md">
                          ₦{item.price}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {item.desc}
                      </p>
                      <div className="mt-auto flex items-center gap-2 text-xs font-bold text-amber-600">
                        <span>Add to Order</span>
                        <Icon name="Plus" size={12} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FoodCart = ({ config }: { config: StorefrontConfig }) => {
  const { cart, removeFromCart, updateQuantity, cartTotal, navigate } =
    useStorefront();

  return (
    <div className="min-h-screen bg-gray-50 animate-in slide-in-from-right-8 duration-300">
      <div className="sticky top-[86px] z-30 bg-white px-4 py-3 border-b flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("home")}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <span className="font-bold">Your Tray ({cart.length})</span>
        </div>
      </div>

      <div className="px-4 space-y-4 pb-32">
        {cart.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <p>Tray is empty.</p>
            <Button variant="link" onClick={() => navigate("home")}>
              View Menu
            </Button>
          </div>
        ) : (
          cart.map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-sm">{item.product.name}</h3>
                <span className="font-bold text-sm">
                  ₦{(item.product.price * item.quantity).toLocaleString()}
                </span>
              </div>

              {/* Modifiers Display */}
              {item.selectedModifiers &&
                Object.keys(item.selectedModifiers).length > 0 && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                    {Object.entries(item.selectedModifiers).map(
                      ([key, vals]) => (
                        <div key={key} className="flex gap-1">
                          <span className="font-medium">{key}:</span>
                          <span>{vals.join(", ")}</span>
                        </div>
                      ),
                    )}
                  </div>
                )}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => removeFromCart(i)}
                  className="text-xs text-red-500 font-bold"
                >
                  Remove
                </button>
                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border">
                  <button
                    onClick={() => updateQuantity(i, -1)}
                    className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 font-bold"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold w-4 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(i, 1)}
                    className="w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg safe-area-bottom">
          <div className="flex justify-between items-center mb-4 text-sm font-medium">
            <span className="text-gray-500">Subtotal</span>
            <span>₦{cartTotal.toLocaleString()}</span>
          </div>
          <Button
            className="w-full h-12 rounded-xl font-bold text-base bg-amber-500 hover:bg-amber-600 text-white border-0"
            onClick={() => navigate("checkout")}
          >
            Checkout Now
          </Button>
        </div>
      )}
    </div>
  );
};

const FoodCheckout = ({
  config,
  onComplete,
}: {
  config: StorefrontConfig;
  onComplete: () => void;
}) => {
  const { cart, cartTotal, navigate, clearCart } = useStorefront();

  const handlePlaceOrder = () => {
    // Map Cart to KitchenOrder format
    const items = cart.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      modifiers: [
        ...Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`),
        ...Object.entries(item.selectedModifiers || {}).flatMap(([_, v]) => v),
      ],
    }));

    KitchenService.addOrder({
      customerName: "New Customer", // Tested
      source: "website",
      fulfillment: "delivery",
      items: items,
      prepTimeTarget: 20,
    });

    alert("Order Placed! Check KDS.");
    clearCart();
    navigate("home");
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gray-50 animate-in slide-in-from-right-8 duration-300">
      <div className="sticky top-[86px] z-30 bg-white px-4 py-3 border-b flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate("cart")}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <Icon name="ArrowLeft" size={20} />
        </button>
        <span className="font-bold">Checkout</span>
      </div>

      <div className="px-4 space-y-6 pb-32">
        <section className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Icon name="Truck" size={14} /> Fulfillment
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border-2 border-amber-500 bg-amber-50 p-3 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer">
              <Icon name="Truck" size={20} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-900">Delivery</span>
            </div>
            <div className="border border-gray-200 p-3 rounded-lg flex flex-col items-center justify-center gap-1 opacity-50 cursor-pointer hover:bg-gray-50">
              <Icon name="ShoppingBag" size={20} />
              <span className="text-xs font-bold">Pickup</span>
            </div>
          </div>
          <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex gap-2">
            <Icon name="Clock" size={14} className="shrink-0" />
            <span>
              Estimated Prep & Delivery: <strong>45-60 mins</strong>
            </span>
          </div>
        </section>

        <section className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-sm">
            <Icon name="User" size={14} className="inline mr-2" /> Details
          </h3>
          <Input placeholder="Full Name" className="bg-gray-50 border-0" />
          <Input
            placeholder="Mobile Number"
            type="tel"
            className="bg-gray-50 border-0"
          />
          <Input
            placeholder="Delivery Address"
            className="bg-gray-50 border-0"
          />
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg safe-area-bottom">
        <div className="flex justify-between items-center mb-4 text-xs opacity-60">
          <span>Total + Delivery (₦1000)</span>
        </div>
        <Button
          className="w-full h-12 rounded-xl font-bold text-base bg-amber-500 hover:bg-amber-600 text-white border-0 flex justify-between px-6 items-center"
          onClick={handlePlaceOrder}
        >
          <span>Place Order</span>
          <span>₦{(cartTotal + 1000).toLocaleString()}</span>
        </Button>
      </div>
    </div>
  );
};

function FoodShell({ config }: { config: StorefrontConfig }) {
  const { route } = useStorefront();
  const theme = getThemeStyles(config.theme);
  const [waModal, setWaModal] = useState({
    open: false,
    product: "",
    message: "",
  });

  const openWhatsApp = (product?: string, msg?: string) => {
    setWaModal({ open: true, product: product || "", message: msg || "" });
  };

  return (
    <div
      id="storefront-container"
      className={cn(
        "h-[800px] overflow-y-auto overflow-x-hidden flex flex-col relative bg-white transition-colors duration-300 scroll-smooth",
        theme.text,
        theme.font,
      )}
    >
      <div className="bg-amber-600 text-white text-[10px] uppercase font-bold text-center py-2 tracking-widest sticky top-0 z-50 shrink-0">
        Preview mode — your store will look like this after setup.
      </div>

      <FoodHeader config={config} />

      <div className="flex-1 flex flex-col relative w-full">
        {route === "home" && <FoodHome config={config} />}
        {route === "product_detail" && (
          <FoodProductModal config={config} openWhatsApp={openWhatsApp} />
        )}
        {route === "cart" && <FoodCart config={config} />}
        {route === "checkout" && (
          <FoodCheckout config={config} onComplete={() => {}} />
        )}
      </div>

      {route === "home" && (
        <footer
          className={cn(
            "py-12 px-6 pb-24 text-center text-sm opacity-60 bg-gray-50 border-t",
            theme.border,
          )}
        >
          <div className="flex justify-center gap-8 mb-8 text-xs font-bold uppercase tracking-wider">
            <span>Opening: 10am - 9pm</span>
            <span>Delivery: 45 Mins</span>
          </div>
          <p className="text-xs">&copy; 2024 Crave Kitchens.</p>
        </footer>
      )}

      <WhatsAppPreviewModal
        isOpen={waModal.open}
        onClose={() => setWaModal({ ...waModal, open: false })}
        productName={waModal.product}
        message={waModal.message}
      />
    </div>
  );
}

export function FoodTemplate({ config }: { config: StorefrontConfig }) {
  return (
    <StorefrontProvider>
      <FoodShell config={config} />
    </StorefrontProvider>
  );
}
