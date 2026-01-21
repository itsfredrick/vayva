import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useStore } from "@/context/StoreContext";
import { Icon, Button } from "@vayva/ui";
export const PhoneGadgetTemplate = ({ businessName, demoMode, }) => {
    const { products, addToCart, cartTotal, itemCount, isCartOpen, toggleCart, checkout, isCheckoutProcessing, currency, } = useStore();
    // Demo Data Override for Phone Gadgets
    const gadgetItems = demoMode
        ? [
            {
                id: "ph_1",
                name: "iPhone 12",
                price: 380000,
                type: "retail",
                specs: { storage: "128GB", condition: "UK Used", battery: "89%" },
                image: "https://images.unsplash.com/photo-1603351154351-5cf233081e35?w=800&q=80",
            },
            {
                id: "ph_2",
                name: "Samsung A32",
                price: 120000,
                type: "retail",
                specs: { storage: "64GB", condition: "New", color: "Blue" },
                image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80",
            },
            {
                id: "ph_3",
                name: "AirPods Pro",
                price: 150000,
                type: "retail",
                specs: { condition: "New", warranty: "1 Year" },
                image: "https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=800&q=80",
            },
            {
                id: "ph_4",
                name: "20W Charger",
                price: 15000,
                type: "retail",
                specs: { type: "Original", port: "USB-C" },
                image: "https://images.unsplash.com/photo-1625732292415-460bd582e0ea?w=800&q=80",
            },
        ]
        : products.filter((p) => p.type === "retail");
    return (_jsxs("div", { className: "font-sans min-h-screen bg-gray-50 text-gray-900 pb-20", children: [_jsx("header", { className: "bg-white border-b border-gray-200 sticky top-0 z-50", children: _jsxs("div", { className: "container mx-auto px-4 h-16 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold", children: "G" }), _jsx("span", { className: "font-bold text-lg tracking-tight", children: businessName || "Gadget Point" })] }), _jsx("div", { className: "flex items-center gap-4", children: _jsxs(Button, { variant: "ghost", size: "icon", className: "relative p-2 hover:bg-gray-100 rounded-full h-auto w-auto", onClick: () => toggleCart(true), children: [_jsx(Icon, { name: "ShoppingBag", size: 20 }), itemCount > 0 && (_jsx("span", { className: "absolute top-0 right-0 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center", children: itemCount }))] }) })] }) }), isCartOpen && (_jsx("div", { className: "fixed inset-0 z-[100] bg-black/50 flex justify-end", children: _jsxs("div", { className: "w-full max-w-sm bg-white h-full p-6 flex flex-col animate-in slide-in-from-right", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h2", { className: "text-xl font-bold", children: ["Cart (", itemCount, ")"] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => toggleCart(false), className: "h-auto w-auto p-0", children: _jsx(Icon, { name: "X", size: 24 }) })] }), _jsx("div", { className: "flex-1 overflow-auto", children: itemCount === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-10", children: "Your cart is empty." })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "bg-blue-50 p-4 rounded text-sm text-blue-700", children: _jsxs("p", { className: "font-bold", children: ["Total: ", currency, " ", cartTotal.toLocaleString()] }) }), _jsx("div", { className: "space-y-2" })] })) }), _jsx("div", { className: "mt-4", children: _jsx(Button, { onClick: () => checkout("whatsapp"), disabled: isCheckoutProcessing || itemCount === 0, className: "w-full bg-green-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 h-auto", children: isCheckoutProcessing ? ("Processing...") : (_jsxs(_Fragment, { children: [_jsx(Icon, { name: "MessageCircle", size: 20 }), " Chat to Confirm"] })) }) }), _jsxs("div", { className: "bg-gray-100 p-6 text-center text-xs text-gray-500 space-y-2 mt-4 rounded-lg", children: [_jsx("p", { children: "\uD83D\uDCCD Shop 12, Ikeja City Mall, Lagos" }), _jsx("p", { children: "\uD83D\uDEE1\uFE0F All devices come with warranty receipt" })] })] }) })), _jsx("div", { className: "bg-blue-600 text-white text-center py-2 text-sm font-bold", children: "\uD83D\uDEE1\uFE0F 7-Day Money Back Guarantee on all items" }), _jsxs("main", { className: "container mx-auto px-4 py-8", children: [_jsx("h2", { className: "text-xl font-bold mb-6", children: "Latest Arrivals" }), _jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: gadgetItems.map((item) => (_jsxs("div", { className: "bg-white p-3 rounded-xl border border-gray-200 flex flex-col shadow-sm", children: [_jsxs("div", { className: "aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden relative", children: [item.image && (_jsx("img", { src: item.image, alt: item.name, className: "w-full h-full object-cover" })), item.specs?.condition && (_jsx("span", { className: "absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded backdrop-blur-md", children: item.specs.condition }))] }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-bold text-gray-900 text-sm leading-tight mb-1", children: item.name }), item.specs && (_jsxs("div", { className: "flex flex-wrap gap-1 mb-2", children: [item.specs.storage && (_jsx("span", { className: "text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600", children: item.specs.storage })), item.specs.battery && (_jsxs("span", { className: "text-[10px] bg-green-50 px-1.5 py-0.5 rounded text-green-700", children: ["\uD83D\uDD0B ", item.specs.battery] }))] })), _jsxs("div", { className: "flex items-center justify-between mt-2", children: [_jsxs("span", { className: "font-bold text-blue-600", children: [currency, " ", item.price.toLocaleString()] }), _jsx(Button, { onClick: () => addToCart({ ...item, quantity: 1, productId: item.id }), className: "bg-blue-50 text-blue-600 p-2 rounded-lg hover:bg-blue-100 transition-colors h-auto w-auto min-w-0", children: _jsx(Icon, { name: "Plus", size: 16 }) })] })] })] }, item.id))) })] })] }));
};
