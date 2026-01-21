"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button, Icon, Input, cn } from "@vayva/ui";
import { getThemeStyles } from "@/utils/theme-utils";
import { WhatsAppPreviewModal } from "./WhatsAppPreviewModal";
import { StorefrontProvider, useStorefront } from "./StorefrontContext";
import { KitchenService } from "@/services/KitchenService";
// --- Sub-Components (Views) ---
const FoodHeader = ({ config }) => {
    const theme = getThemeStyles(config.theme);
    const { cartCount, navigate } = useStorefront();
    return (_jsx("header", { className: cn("sticky top-[30px] z-40 backdrop-blur-md border-b flex-none transition-all", theme.bg + "/95", theme.border), children: _jsxs("div", { className: "max-w-2xl mx-auto px-6 h-16 flex items-center justify-between", children: [_jsx("div", { className: "flex items-center gap-3 cursor-pointer", onClick: () => navigate("home"), children: (config.branding?.logoUrl || config.branding?.logo) ? (_jsx("img", { src: config.branding?.logoUrl || config.branding?.logo, alt: config.content.headline || "Store Logo", className: "w-12 h-12 object-contain rounded-full bg-gray-50 border border-gray-100" })) : (_jsxs("span", { className: "font-bold text-xl tracking-tight", children: [config.content.headline?.split(" ")[0] || "CRAVE", _jsx("span", { className: "text-amber-500", children: "." })] })) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx(Button, { size: "sm", className: cn("hidden md:flex rounded-full px-4 text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 border-0"), onClick: () => {
                                /* Trigger WhatsApp Global */
                            }, children: "Order on WhatsApp" }), _jsxs(Button, { variant: "ghost", size: "icon", className: "relative p-2.5 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors group h-auto w-auto", onClick: () => navigate("cart"), children: [_jsx(Icon, { name: "ShoppingBag", size: 20, className: "group-hover:scale-110 transition-transform" }), cartCount > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm", children: cartCount }))] })] })] }) }));
};
const FoodProductModal = ({ config, openWhatsApp, }) => {
    const theme = getThemeStyles(config.theme);
    const { currentProduct, addToCart, navigate } = useStorefront();
    // State
    const [qty, setQty] = useState(1);
    const [modifiers, setModifiers] = useState({}); // { "Protein": ["Beef"], "Extras": ["Slaw", "MoiMoi"] }
    const [totalPrice, setTotalPrice] = useState(0);
    useEffect(() => {
        if (!currentProduct)
            return;
        // Calculate total price based on base + modifiers
        let price = currentProduct.price;
        if (currentProduct.modifiers) {
            Object.entries(modifiers).forEach(([modName, selectedOpts]) => {
                const modDef = currentProduct.modifiers?.find((m) => m.name === modName);
                if (modDef) {
                    selectedOpts.forEach((optLabel) => {
                        const opt = modDef.options.find((o) => o.label === optLabel);
                        if (opt)
                            price += opt.price;
                    });
                }
            });
        }
        setTotalPrice(price * qty);
    }, [currentProduct, modifiers, qty]);
    if (!currentProduct)
        return null;
    const toggleModifier = (modName, optLabel, type) => {
        setModifiers((prev) => {
            const current = prev[modName] || [];
            if (type === "single") {
                // Radio behavior
                return { ...prev, [modName]: [optLabel] };
            }
            else {
                // Checkbox behavior
                if (current.includes(optLabel)) {
                    return { ...prev, [modName]: current.filter((o) => o !== optLabel) };
                }
                else {
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
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity", onClick: () => navigate("home") }), _jsxs("div", { className: "bg-white w-full max-w-lg h-[90vh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col pointer-events-auto animate-in slide-in-from-bottom-10 duration-300 overflow-hidden", children: [_jsxs("div", { className: "relative h-48 sm:h-56 bg-gray-100 shrink-0", children: [_jsx("div", { className: "absolute inset-0 flex items-center justify-center opacity-20", children: _jsx(Icon, { name: currentProduct.image, size: 64 }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("home"), className: "absolute top-4 right-4 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors p-0", children: _jsx(Icon, { name: "X", size: 16 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6", children: [_jsx("h2", { className: "text-2xl font-bold mb-1", children: currentProduct.name }), _jsx("p", { className: "text-sm opacity-60 mb-6", children: currentProduct.description }), _jsx("div", { className: "space-y-6", children: currentProduct.modifiers?.map((mod) => (_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-center mb-3", children: [_jsx("h3", { className: "font-bold text-sm bg-gray-100 px-2 py-1 rounded-md", children: mod.name }), _jsx("span", { className: "text-[10px] uppercase font-bold text-gray-400", children: mod.type === "single" ? "Required" : "Optional" })] }), _jsx("div", { className: "space-y-2", children: mod.options.map((opt) => {
                                                const isSelected = modifiers[mod.name]?.includes(opt.label);
                                                return (_jsxs("div", { onClick: () => toggleModifier(mod.name, opt.label, mod.type), className: cn("flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all", isSelected
                                                        ? "border-amber-500 bg-amber-50"
                                                        : "border-gray-100 hover:bg-gray-50"), children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: cn("w-4 h-4 rounded-full border flex items-center justify-center", isSelected
                                                                        ? "border-amber-500"
                                                                        : "border-gray-300"), children: isSelected && (_jsx("div", { className: "w-2 h-2 rounded-full bg-amber-500" })) }), _jsx("span", { className: "text-sm font-medium", children: opt.label })] }), opt.price > 0 && (_jsxs("span", { className: "text-xs text-gray-500", children: ["+\u20A6", opt.price] }))] }, opt.label));
                                            }) })] }, mod.name))) })] }), _jsxs("div", { className: "p-4 border-t bg-white safe-area-bottom", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-4 bg-gray-100 rounded-full px-2 py-1", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => setQty(Math.max(1, qty - 1)), className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors font-bold text-lg p-0", children: "-" }), _jsx("span", { className: "font-bold text-sm w-4 text-center", children: qty }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setQty(qty + 1), className: "w-8 h-8 flex items-center justify-center rounded-full hover:bg-white transition-colors font-bold text-lg p-0", children: "+" })] }), _jsxs("span", { className: "font-extrabold text-xl", children: ["\u20A6", totalPrice.toLocaleString()] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsx(Button, { variant: "outline", className: "rounded-xl h-12 font-bold", onClick: handleWhatsAppBuy, children: "WhatsApp" }), _jsx(Button, { className: "rounded-xl h-12 font-bold bg-amber-500 hover:bg-amber-600 text-white border-0", onClick: handleAddToCart, children: "Add to Order" })] })] })] })] }));
};
const FoodHome = ({ config }) => {
    const { content } = config;
    const { navigate } = useStorefront();
    const menu = (content.menu || []);
    const categories = Array.from(new Set(menu.map((m) => m.cat)));
    const scrollToCat = (cat) => {
        const el = document.getElementById(`cat-${cat}`);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    return (_jsxs("div", { className: "animate-in fade-in slide-in-from-bottom-2 duration-500 pb-24", children: [_jsx("section", { className: "px-4 pt-8 pb-6 text-center", children: _jsxs("div", { className: "bg-gradient-to-br from-amber-600 to-amber-800 text-white rounded-3xl p-8 shadow-xl mb-4 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-white/10 rounded-full blur-3xl" }), _jsxs("div", { className: "relative z-10", children: [_jsx("span", { className: "text-[10px] font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full mb-4 inline-block", children: "Open till 9PM" }), _jsx("h1", { className: "text-3xl md:text-4xl font-extrabold mb-3 leading-tight", children: content.headline }), _jsx("p", { className: "opacity-80 text-sm max-w-md mx-auto mb-6", children: content.subtext }), _jsx(Button, { className: "bg-white text-black hover:bg-gray-100 rounded-full font-bold px-8", onClick: () => scrollToCat(categories[0]), children: "View Menu" })] })] }) }), _jsx("div", { className: "sticky top-[93px] z-30 py-3 bg-white/95 backdrop-blur border-b", children: _jsx("div", { className: "max-w-2xl mx-auto px-4 flex gap-2 overflow-x-auto no-scrollbar scroll-pl-4", children: categories.map((c, i) => (_jsx(Button, { variant: "ghost", onClick: () => scrollToCat(c), className: cn("px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border shrink-0 h-auto", i === 0
                            ? "bg-black text-white border-black hover:bg-black/90 hover:text-white"
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"), children: c }, c))) }) }), _jsx("div", { className: "max-w-2xl mx-auto px-4 py-6 space-y-10", children: categories.map((cat) => {
                    const items = menu.filter((m) => m.cat === cat);
                    return (_jsxs("div", { id: `cat-${cat}`, className: "scroll-mt-40", children: [_jsx("h3", { className: "font-extrabold text-xl mb-4", children: cat }), _jsx("div", { className: "grid gap-4", children: items.map((item) => (_jsxs("div", { className: "bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex gap-4 cursor-pointer hover:border-amber-200 transition-colors group", onClick: () => navigate("product_detail", item), children: [_jsx("div", { className: "w-24 h-24 bg-gray-100 rounded-xl shrink-0 flex items-center justify-center text-gray-300", children: _jsx(Icon, { name: "Utensils", size: 24 }) }), _jsxs("div", { className: "flex-1 py-1 flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("h4", { className: "font-bold text-sm leading-tight group-hover:text-amber-600 transition-colors", children: item.name }), _jsxs("span", { className: "font-bold text-sm bg-gray-50 px-2 py-0.5 rounded-md", children: ["\u20A6", item.price] })] }), _jsx("p", { className: "text-xs text-gray-500 line-clamp-2 mb-3", children: item.desc }), _jsxs("div", { className: "mt-auto flex items-center gap-2 text-xs font-bold text-amber-600", children: [_jsx("span", { children: "Add to Order" }), _jsx(Icon, { name: "Plus", size: 12 })] })] })] }, item.id))) })] }, cat));
                }) })] }));
};
const FoodCart = ({ config }) => {
    const { cart, removeFromCart, updateQuantity, cartTotal, navigate } = useStorefront();
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 animate-in slide-in-from-right-8 duration-300", children: [_jsx("div", { className: "sticky top-[86px] z-30 bg-white px-4 py-3 border-b flex justify-between items-center mb-4", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("home"), className: "p-1 hover:bg-gray-100 rounded-full h-auto w-auto", children: _jsx(Icon, { name: "ArrowLeft", size: 20 }) }), _jsxs("span", { className: "font-bold", children: ["Your Tray (", cart.length, ")"] })] }) }), _jsx("div", { className: "px-4 space-y-4 pb-32", children: cart.length === 0 ? (_jsxs("div", { className: "text-center py-20 opacity-50", children: [_jsx("p", { children: "Tray is empty." }), _jsx(Button, { variant: "link", onClick: () => navigate("home"), children: "View Menu" })] })) : (cart.map((item, i) => (_jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h3", { className: "font-bold text-sm", children: item.product.name }), _jsxs("span", { className: "font-bold text-sm", children: ["\u20A6", (item.product.price * item.quantity).toLocaleString()] })] }), item.selectedModifiers &&
                            Object.keys(item.selectedModifiers).length > 0 && (_jsx("div", { className: "text-xs text-gray-500 bg-gray-50 p-2 rounded-lg", children: Object.entries(item.selectedModifiers).map(([key, vals]) => (_jsxs("div", { className: "flex gap-1", children: [_jsxs("span", { className: "font-medium", children: [key, ":"] }), _jsx("span", { children: vals.join(", ") })] }, key))) })), _jsxs("div", { className: "flex justify-between items-center pt-2", children: [_jsx(Button, { variant: "link", onClick: () => removeFromCart(i), className: "text-xs text-red-500 font-bold h-auto p-0 hover:no-underline", children: "Remove" }), _jsxs("div", { className: "flex items-center gap-3 bg-gray-50 p-1 rounded-lg border", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => updateQuantity(i, -1), className: "w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 font-bold p-0", children: "-" }), _jsx("span", { className: "text-xs font-bold w-4 text-center", children: item.quantity }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => updateQuantity(i, 1), className: "w-6 h-6 flex items-center justify-center bg-white rounded shadow-sm hover:bg-gray-100 font-bold p-0", children: "+" })] })] })] }, i)))) }), cart.length > 0 && (_jsxs("div", { className: "fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg safe-area-bottom", children: [_jsxs("div", { className: "flex justify-between items-center mb-4 text-sm font-medium", children: [_jsx("span", { className: "text-gray-500", children: "Subtotal" }), _jsxs("span", { children: ["\u20A6", cartTotal.toLocaleString()] })] }), _jsx(Button, { className: "w-full h-12 rounded-xl font-bold text-base bg-amber-500 hover:bg-amber-600 text-white border-0", onClick: () => navigate("checkout"), children: "Checkout Now" })] }))] }));
};
const FoodCheckout = ({ config, onComplete, }) => {
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
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 animate-in slide-in-from-right-8 duration-300", children: [_jsxs("div", { className: "sticky top-[86px] z-30 bg-white px-4 py-3 border-b flex items-center gap-2 mb-4", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => navigate("cart"), className: "p-1 hover:bg-gray-100 rounded-full h-auto w-auto", children: _jsx(Icon, { name: "ArrowLeft", size: 20 }) }), _jsx("span", { className: "font-bold", children: "Checkout" })] }), _jsxs("div", { className: "px-4 space-y-6 pb-32", children: [_jsxs("section", { className: "bg-white p-4 rounded-xl border shadow-sm space-y-4", children: [_jsxs("h3", { className: "font-bold text-sm flex items-center gap-2", children: [_jsx(Icon, { name: "Truck", size: 14 }), " Fulfillment"] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "border-2 border-amber-500 bg-amber-50 p-3 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer", children: [_jsx(Icon, { name: "Truck", size: 20, className: "text-amber-600" }), _jsx("span", { className: "text-xs font-bold text-amber-900", children: "Delivery" })] }), _jsxs("div", { className: "border border-gray-200 p-3 rounded-lg flex flex-col items-center justify-center gap-1 opacity-50 cursor-pointer hover:bg-gray-50", children: [_jsx(Icon, { name: "ShoppingBag", size: 20 }), _jsx("span", { className: "text-xs font-bold", children: "Pickup" })] })] }), _jsxs("div", { className: "bg-blue-50 text-blue-800 text-xs p-3 rounded-lg flex gap-2", children: [_jsx(Icon, { name: "Clock", size: 14, className: "shrink-0" }), _jsxs("span", { children: ["Estimated Prep & Delivery: ", _jsx("strong", { children: "45-60 mins" })] })] })] }), _jsxs("section", { className: "bg-white p-4 rounded-xl border shadow-sm space-y-4", children: [_jsxs("h3", { className: "font-bold text-sm", children: [_jsx(Icon, { name: "User", size: 14, className: "inline mr-2" }), " Details"] }), _jsx(Input, { placeholder: "Full Name", className: "bg-gray-50 border-0" }), _jsx(Input, { placeholder: "Mobile Number", type: "tel", className: "bg-gray-50 border-0" }), _jsx(Input, { placeholder: "Delivery Address", className: "bg-gray-50 border-0" })] })] }), _jsxs("div", { className: "fixed bottom-0 left-0 right-0 bg-white p-4 border-t shadow-lg safe-area-bottom", children: [_jsx("div", { className: "flex justify-between items-center mb-4 text-xs opacity-60", children: _jsx("span", { children: "Total + Delivery (\u20A61000)" }) }), _jsxs(Button, { className: "w-full h-12 rounded-xl font-bold text-base bg-amber-500 hover:bg-amber-600 text-white border-0 flex justify-between px-6 items-center", onClick: handlePlaceOrder, children: [_jsx("span", { children: "Place Order" }), _jsxs("span", { children: ["\u20A6", (cartTotal + 1000).toLocaleString()] })] })] })] }));
};
function FoodShell({ config }) {
    const { route } = useStorefront();
    const theme = getThemeStyles(config.theme);
    const [waModal, setWaModal] = useState({
        open: false,
        product: "",
        message: "",
    });
    const openWhatsApp = (product, msg) => {
        setWaModal({ open: true, product: product || "", message: msg || "" });
    };
    return (_jsxs("div", { id: "storefront-container", className: cn("h-[800px] overflow-y-auto overflow-x-hidden flex flex-col relative bg-white transition-colors duration-300 scroll-smooth", theme.text, theme.font), children: [_jsx("div", { className: "bg-amber-600 text-white text-[10px] uppercase font-bold text-center py-2 tracking-widest sticky top-0 z-50 shrink-0", children: "Preview mode \u2014 your store will look like this after setup." }), _jsx(FoodHeader, { config: config }), _jsxs("div", { className: "flex-1 flex flex-col relative w-full", children: [route === "home" && _jsx(FoodHome, { config: config }), route === "product_detail" && (_jsx(FoodProductModal, { config: config, openWhatsApp: openWhatsApp })), route === "cart" && _jsx(FoodCart, { config: config }), route === "checkout" && (_jsx(FoodCheckout, { config: config, onComplete: () => { } }))] }), route === "home" && (_jsxs("footer", { className: cn("py-12 px-6 pb-24 text-center text-sm opacity-60 bg-gray-50 border-t", theme.border), children: [_jsxs("div", { className: "flex justify-center gap-8 mb-8 text-xs font-bold uppercase tracking-wider", children: [_jsx("span", { children: "Opening: 10am - 9pm" }), _jsx("span", { children: "Delivery: 45 Mins" })] }), _jsx("p", { className: "text-xs", children: "\u00A9 2024 Crave Kitchens." })] })), _jsx(WhatsAppPreviewModal, { isOpen: waModal.open, onClose: () => setWaModal({ ...waModal, open: false }), productName: waModal.product, message: waModal.message })] }));
}
export function FoodTemplate({ config }) {
    return (_jsx(StorefrontProvider, { children: _jsx(FoodShell, { config: config }) }));
}
