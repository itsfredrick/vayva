import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from "@/context/StoreContext";
import { Icon, Button } from "@vayva/ui";
export const AutoPartsTemplate = ({ businessName, demoMode, }) => {
    const { products, addToCart, cartTotal, itemCount, checkout, isCheckoutProcessing, currency, } = useStore();
    // Demo Data Override for Auto Parts
    const partItems = demoMode
        ? [
            {
                id: "ap_1",
                name: "Toyota Camry Engine (2009)",
                price: 450000,
                type: "retail",
                condition: "Tokunbo Grade A",
                tags: ["Warranty Included"],
                img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
            },
            {
                id: "ap_2",
                name: "Brake Pad",
                price: 18000,
                type: "retail",
                condition: "Brand New",
                tags: ["OEM"],
                img: "https://images.unsplash.com/photo-1552176625-e47ff529b595?w=800&q=80",
            },
            {
                id: "ap_3",
                name: "Lexus RX350 Headlamp",
                price: 180000,
                type: "retail",
                condition: "Belgium Used",
                tags: [],
                img: "https://images.unsplash.com/photo-1506469717960-433cebe3f181?w=800&q=80",
            },
        ]
        : products
            .filter((p) => p.type === "retail")
            .map((p) => ({
            ...p,
            img: p.images?.[0] ||
                "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=800&q=80",
            condition: p.category || "Used",
            tags: p.searchTags || [],
        }));
    return (_jsxs("div", { className: "font-sans min-h-screen bg-slate-50 text-slate-900 pb-20", children: [_jsxs("header", { className: "bg-slate-900 text-white py-4 px-4 sticky top-0 z-50", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsxs("div", { className: "font-bold text-xl tracking-tight uppercase flex items-center gap-2", children: [_jsx("span", { className: "bg-red-600 px-2 py-1 rounded text-xs", children: "PRO" }), businessName || "Ladipo Auto Spares"] }), itemCount > 0 && (_jsxs("div", { className: "text-xs font-bold bg-white text-black px-2 py-1 rounded", children: ["Cart: ", itemCount] }))] }), _jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Search by Part Number, VIN, or Model...", className: "w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 text-white placeholder-slate-400" }), _jsx(Icon, { name: "Search", size: 20, className: "absolute left-3 top-3.5 text-slate-400" })] })] }), _jsx("div", { className: "bg-white border-b border-slate-200 overflow-x-auto", children: _jsx("div", { className: "flex px-4 py-3 gap-3 min-w-max", children: [
                        "Engine & Transmission",
                        "Brakes",
                        "Suspension",
                        "Electrical",
                        "Body Parts",
                    ].map((cat) => (_jsx(Button, { className: "text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-200 border border-slate-200 whitespace-nowrap h-auto", children: cat }, cat))) }) }), _jsxs("section", { className: "p-4 space-y-4", children: [_jsx("h2", { className: "text-sm font-bold text-slate-500 uppercase tracking-wider mb-2", children: "New Arrivals (Tokunbo)" }), partItems.map((item) => (_jsxs("div", { className: "bg-white rounded-lg border border-slate-200 p-3 flex gap-4 shadow-sm hover:shadow-md transition-shadow group", children: [_jsxs("div", { className: "w-24 h-24 bg-slate-100 rounded-md shrink-0 overflow-hidden relative", children: [_jsx("img", { src: item.img, alt: item.name, className: "w-full h-full object-cover" }), item.tags?.includes("Warranty Included") && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-green-600 text-white text-[8px] font-bold text-center py-0.5", children: "WARRANTY" }))] }), _jsxs("div", { className: "flex-1 min-w-0 flex flex-col justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm text-slate-900 leading-tight mb-1 truncate", children: item.name }), _jsx("div", { className: "flex items-center gap-2 mb-1", children: _jsx("span", { className: "text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200 uppercase", children: item.condition || "Used" }) })] }), _jsxs("div", { className: "flex items-end justify-between", children: [_jsxs("span", { className: "font-bold text-red-600 text-sm", children: [currency, " ", item.price.toLocaleString()] }), _jsx(Button, { onClick: () => addToCart({ ...item, quantity: 1, productId: item.id }), className: "bg-slate-900 text-white text-[10px] font-bold px-3 py-1.5 rounded hover:bg-slate-800 h-auto", children: "Select Part" })] })] })] }, item.id)))] }), _jsx("div", { className: "px-4 py-8", children: _jsxs("div", { className: "bg-green-50 border border-green-200 p-4 rounded-lg flex items-start gap-3", children: [_jsx("div", { className: "w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0 text-green-600 font-bold", children: _jsx(Icon, { name: "MessageCircle", size: 20 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "font-bold text-green-900 text-sm mb-1", children: "Verify compatibility first!" }), _jsx("p", { className: "text-xs text-green-700 leading-relaxed mb-3", children: "Send us your VIN or a picture of the part you need replaced before payment." }), _jsx(Button, { onClick: () => checkout("whatsapp"), disabled: isCheckoutProcessing, className: "bg-green-600 text-white w-full rounded-md py-2 font-bold text-xs hover:bg-green-700 transition-colors h-auto", children: itemCount > 0
                                        ? `Request Inspection for ${itemCount} Item(s)`
                                        : "Chat on WhatsApp" })] })] }) })] }));
};
