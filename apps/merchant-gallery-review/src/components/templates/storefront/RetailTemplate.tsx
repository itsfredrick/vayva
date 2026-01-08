"use client";

import React, { useState, useEffect } from "react";
import { Button, Icon, cn, Input } from "@vayva/ui";
import { StorefrontConfig, StorefrontProduct } from "@/types/storefront";
import { getThemeStyles } from "@/utils/theme-utils";
import { WhatsAppPreviewModal } from "./WhatsAppPreviewModal";
import { StorefrontProvider, useStorefront } from "./StorefrontContext";
import { VayvaLogo } from "@/components/VayvaLogo";

// --- Sub-Components (Views) ---

const RetailHeader = ({
  config,
  onScan,
}: {
  config: StorefrontConfig;
  onScan: () => void;
}) => {
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
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("home")}
        >
          <img
            src="/logo-icon.png"
            alt="Vayva"
            className="w-16 h-16 object-contain"
          />
          <span className="font-bold text-lg tracking-tight">Vayva</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-black/5 rounded-full md:hidden">
            <Icon name="Search" size={20} />
          </button>
          <button
            className="relative p-2 hover:bg-black/5 rounded-full transition-colors group"
            onClick={() => navigate("cart")}
          >
            <Icon
              name="ShoppingBag"
              size={20}
              className="group-hover:scale-110 transition-transform"
            />
            {cartCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 -mr-2 text-gray-400">
            <Icon name="Menu" size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

const RetailHome = ({ config }: { config: StorefrontConfig }) => {
  const theme = getThemeStyles(config.theme);
  const { content } = config;
  const { navigate } = useStorefront();
  const products = (content.products || []) as StorefrontProduct[];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Hero */}
      <section className="py-12 px-6 text-center">
        <div className="max-w-xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-2">
            {content.headline}
          </h1>
          <p className="text-lg opacity-60 leading-relaxed max-w-md mx-auto">
            {content.subtext}
          </p>
          <div className="flex justify-center gap-3 pt-4">
            <Button
              className={cn(
                "h-11 px-8 rounded-full text-sm font-bold shadow-lg shadow-black/5 hover:scale-105 transition-transform",
                theme.buttonPrimary,
              )}
              onClick={() => {
                const productsSection =
                  document.getElementById("products-grid");
                productsSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Shop Now
            </Button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="products-grid" className="max-w-4xl mx-auto px-4 pb-20 pt-8">
        <div className="flex justify-between items-center mb-8 px-2">
          <h2 className="text-xl font-bold">New Drops</h2>
          <button className="text-xs font-bold opacity-50 hover:opacity-100 flex items-center gap-1">
            Filters <Icon name="Settings2" size={12} />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10">
          {products.map((p) => (
            <div
              key={p.id}
              className="group cursor-pointer flex flex-col"
              onClick={() => navigate("product_detail", p)}
            >
              <div
                className={cn(
                  "aspect-[0.9] mb-3 relative overflow-hidden flex items-center justify-center rounded-2xl transition-all duration-300 group-hover:shadow-lg",
                  config.theme === "premium" ? "bg-slate-100" : "bg-gray-100",
                )}
              >
                <Icon
                  name={p.image as any}
                  size={48}
                  className="opacity-30 group-hover:scale-110 transition-transform duration-500 text-gray-600"
                />
                {p.tag && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-black text-[9px] font-bold px-2 py-1.5 rounded uppercase tracking-wider shadow-sm">
                    {p.tag}
                  </div>
                )}
                {p.stock === "Low Stock" && (
                  <div className="absolute bottom-3 right-3 bg-red-100 text-red-600 text-[9px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                    Last Few
                  </div>
                )}
              </div>
              <div className="px-1 space-y-1">
                <h3 className="font-bold text-sm leading-tight truncate pr-2">
                  {p.name}
                </h3>
                <div className="flex items-center justify-between">
                  <p className="text-sm opacity-60 font-medium">
                    ₦{p.price.toLocaleString()}
                  </p>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-200 bg-black text-white",
                    )}
                  >
                    <Icon name="Plus" size={12} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const RetailProduct = ({
  config,
  openWhatsApp,
}: {
  config: StorefrontConfig;
  openWhatsApp: (p: string, m: string) => void;
}) => {
  const theme = getThemeStyles(config.theme);
  const { currentProduct, addToCart, navigate } = useStorefront();

  // Local state for variant selection
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (currentProduct?.variants) {
      const defaults: Record<string, string> = {};
      currentProduct.variants.forEach((v) => (defaults[v.name] = v.options[0]));
      setSelectedVariants(defaults);
    }
  }, [currentProduct]);

  if (!currentProduct) return null;

  const handleAddToCart = () => {
    addToCart(currentProduct, qty, selectedVariants);
    navigate("cart");
  };

  const handleWhatsAppBuy = () => {
    const variantStr = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    const message = `Hello, I'd like to order: \n${qty}x ${currentProduct.name} \n(${variantStr})`;
    openWhatsApp(currentProduct.name, message);
  };

  return (
    <div className="bg-white min-h-screen animate-in slide-in-from-right-8 duration-300">
      <div className="sticky top-[86px] z-30 bg-white/80 backdrop-blur-md px-4 py-2 border-b flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate("home")}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <Icon name="ArrowLeft" size={20} />
        </button>
        <span className="font-bold text-sm truncate flex-1">
          {currentProduct.name}
        </span>
      </div>

      <div className="px-6 pb-24">
        <div className="aspect-square bg-gray-100 rounded-3xl mb-8 flex items-center justify-center">
          <Icon
            name={currentProduct.image as any}
            size={80}
            className="opacity-20"
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-bold">{currentProduct.name}</h1>
              <p className="text-xl font-bold text-green-600">
                ₦{currentProduct.price.toLocaleString()}
              </p>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              {currentProduct.description}
            </p>
          </div>

          {currentProduct.variants?.map((v) => (
            <div key={v.name} className="space-y-3">
              <label className="text-xs font-bold uppercase opacity-50 tracking-wider">
                {v.name}
              </label>
              <div className="flex flex-wrap gap-3">
                {v.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() =>
                      setSelectedVariants((prev) => ({
                        ...prev,
                        [v.name]: opt,
                      }))
                    }
                    className={cn(
                      "min-w-[48px] h-10 px-4 rounded-lg text-sm font-medium border-2 transition-all",
                      selectedVariants[v.name] === opt
                        ? "border-black bg-black text-white"
                        : "border-gray-100 bg-white text-gray-600 hover:border-gray-200",
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase opacity-50 tracking-wider">
              Quantity
            </label>
            <div className="flex items-center gap-4 bg-gray-50 w-fit p-1 rounded-xl border">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-sm">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm font-bold hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-white/90 backdrop-blur-lg flex flex-col gap-3 safe-area-bottom">
            <Button
              className={cn(
                "w-full h-12 rounded-xl font-bold text-base",
                theme.buttonPrimary,
              )}
              onClick={handleAddToCart}
            >
              Add to Cart — ₦{(currentProduct.price * qty).toLocaleString()}
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 rounded-xl font-bold border-gray-200"
              onClick={handleWhatsAppBuy}
            >
              <Icon
                name="MessageCircle"
                className="mr-2 text-green-600"
                size={18}
              />
              Order on WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RetailCart = ({ config }: { config: StorefrontConfig }) => {
  const theme = getThemeStyles(config.theme);
  const { cart, removeFromCart, updateQuantity, cartTotal, navigate } =
    useStorefront();

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-[86px] z-30 bg-white/80 backdrop-blur-md px-4 py-3 border-b flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("home")}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <span className="font-bold">Your Cart ({cart.length})</span>
        </div>
        {cart.length > 0 && (
          <button
            onClick={() => {}}
            className="text-xs text-red-500 font-medium"
          >
            Clear
          </button>
        )}
      </div>

      <div className="px-4 space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-50 space-y-4">
            <Icon name="ShoppingBag" size={48} />
            <p>Your cart is empty.</p>
            <Button variant="outline" onClick={() => navigate("home")}>
              Start Shopping
            </Button>
          </div>
        ) : (
          cart.map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-xl border border-gray-100 flex gap-4 shadow-sm"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                <Icon
                  name={item.product.image as any}
                  size={24}
                  className="opacity-30"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-sm truncate pr-2">
                    {item.product.name}
                  </h3>
                  <button
                    onClick={() => removeFromCart(i)}
                    className="text-gray-300 hover:text-red-500"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mb-2">
                  {Object.values(item.selectedVariants).join(" / ")}
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <p className="font-bold text-sm">
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                  <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg border">
                    <button
                      onClick={() => updateQuantity(i, -1)}
                      className="text-gray-500 hover:text-black"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(i, 1)}
                      className="text-gray-500 hover:text-black"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
          <div className="flex justify-between items-center mb-4 text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-extrabold text-lg">
              ₦{cartTotal.toLocaleString()}
            </span>
          </div>
          <Button
            className={cn(
              "w-full h-12 rounded-xl font-bold text-base",
              theme.buttonPrimary,
            )}
            onClick={() => navigate("checkout")}
          >
            Checkout Securely
          </Button>
        </div>
      )}
    </div>
  );
};

const RetailCheckout = ({
  config,
  onComplete,
}: {
  config: StorefrontConfig;
  onComplete: () => void;
}) => {
  const theme = getThemeStyles(config.theme);
  const { cartTotal, navigate } = useStorefront();

  return (
    <div className="animate-in slide-in-from-right-8 duration-300 min-h-screen bg-gray-50">
      <div className="sticky top-[86px] z-30 bg-white/80 backdrop-blur-md px-4 py-3 border-b flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate("cart")}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <Icon name="ArrowLeft" size={20} />
        </button>
        <span className="font-bold">Checkout</span>
      </div>

      <div className="px-4 space-y-6 pb-24">
        <section className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Icon name="User" size={14} /> Contact Information
          </h3>
          <Input placeholder="Email Address" className="bg-gray-50 border-0" />
          <Input placeholder="Phone Number" className="bg-gray-50 border-0" />
        </section>

        <section className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Icon name="MapPin" size={14} /> Delivery
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="border-2 border-black bg-black/5 p-3 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer">
              <Icon name="Truck" size={20} />
              <span className="text-xs font-bold">Standard</span>
              <span className="text-[10px] opacity-60">2-3 Days</span>
            </div>
            <div className="border border-gray-200 p-3 rounded-lg flex flex-col items-center justify-center gap-1 opacity-50 cursor-pointer">
              <Icon name="Zap" size={20} />
              <span className="text-xs font-bold">Express</span>
              <span className="text-[10px] opacity-60">N/A</span>
            </div>
          </div>
          <Input placeholder="Full Address" className="bg-gray-50 border-0" />
          <Input placeholder="City / State" className="bg-gray-50 border-0" />
        </section>

        <section className="bg-white p-4 rounded-xl border shadow-sm space-y-4">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Icon name="CreditCard" size={14} /> Payment
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-gray-50">
              <div className="w-4 h-4 rounded-full border-4 border-black box-content" />
              <span className="text-sm font-medium">
                Pay with Card / Transfer
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg opacity-50">
              <div className="w-4 h-4 rounded-full border border-gray-300" />
              <span className="text-sm font-medium">Pay on Delivery</span>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-[0_-4px_20px_rgba(0,0,0,0.05)] safe-area-bottom">
        <div className="flex justify-between items-center mb-4 text-xs opacity-60">
          <span>Total including delivery</span>
        </div>
        <Button
          className={cn(
            "w-full h-12 rounded-xl font-bold text-base flex justify-between items-center px-6",
            theme.buttonPrimary,
          )}
          onClick={onComplete}
        >
          <span>Pay Now</span>
          <span>₦{(cartTotal + 1500).toLocaleString()}</span>
        </Button>
      </div>
    </div>
  );
};

function RetailShell({ config }: { config: StorefrontConfig }) {
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
      <div className="bg-black text-white text-[10px] uppercase font-bold text-center py-2 tracking-widest sticky top-0 z-50 shrink-0">
        Preview mode — your store will look like this after setup.
      </div>

      <RetailHeader config={config} onScan={() => {}} />

      <div className="flex-1 flex flex-col relative w-full">
        {route === "home" && <RetailHome config={config} />}
        {route === "product_detail" && (
          <RetailProduct config={config} openWhatsApp={openWhatsApp} />
        )}
        {route === "cart" && <RetailCart config={config} />}
        {route === "checkout" && (
          <RetailCheckout
            config={config}
            onComplete={() => alert("Order Placed in Preview Mode!")}
          />
        )}
      </div>

      {route === "home" && (
        <footer
          className={cn(
            "py-10 px-6 border-t text-xs opacity-60 text-center shrink-0 bg-white",
            theme.border,
          )}
        >
          <div className="flex flex-col gap-4">
            <p className="font-bold text-sm">Vayva Store</p>
            <p>+234 800 123 4567 • hello@vayva.store</p>
            <p className="mt-4">&copy; 2025 Storefront. Powered by Vayva.</p>
          </div>
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

export function RetailTemplate({ config }: { config: StorefrontConfig }) {
  return (
    <StorefrontProvider>
      <RetailShell config={config} />
    </StorefrontProvider>
  );
}
