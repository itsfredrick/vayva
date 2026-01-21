import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
export const LogisticsServiceTemplate = ({ businessName, demoMode, }) => {
    return (_jsxs("div", { className: "font-sans min-h-screen bg-slate-50 text-slate-900", children: [_jsxs("header", { className: "bg-blue-900 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg", children: [_jsxs("div", { className: "font-bold text-xl tracking-tight italic flex items-center gap-2", children: [_jsx("span", { className: "text-yellow-400", children: "\u26A1" }), businessName || "Flash Logistics"] }), _jsxs("div", { className: "flex gap-4 text-xs font-bold", children: [_jsx("a", { href: "#", className: "hover:text-yellow-400", children: "Track Item" }), _jsx("a", { href: "#", className: "hover:text-yellow-400", children: "Get Quote" })] })] }), _jsxs("section", { className: "bg-blue-800 text-white p-6 pb-12 rounded-b-[2rem]", children: [_jsxs("h1", { className: "text-2xl font-bold mb-6 text-center", children: ["Move anything across Lagos,", _jsx("br", {}), "Instantly."] }), _jsxs("div", { className: "bg-white text-slate-900 rounded-xl p-4 shadow-xl max-w-md mx-auto", children: [_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-3 border-b border-gray-100 pb-2", children: [_jsx("span", { className: "text-blue-600", children: "\uD83D\uDFE2" }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-[10px] text-gray-400 font-bold uppercase", children: "Pickup Location" }), _jsx("input", { type: "text", placeholder: "e.g. 14 Admiralty Way", className: "w-full text-sm font-bold outline-none placeholder-gray-300" })] })] }), _jsxs("div", { className: "flex items-center gap-3 pt-1", children: [_jsx("span", { className: "text-red-600", children: "\uD83D\uDCCD" }), _jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "block text-[10px] text-gray-400 font-bold uppercase", children: "Drop-off Location" }), _jsx("input", { type: "text", placeholder: "e.g. Ikeja City Mall", className: "w-full text-sm font-bold outline-none placeholder-gray-300" })] })] })] }), _jsx(Button, { className: "w-full bg-yellow-400 text-blue-900 mt-6 py-3 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-400/20 h-auto", children: "Check Price" })] })] }), _jsxs("section", { className: "p-6", children: [_jsx("h2", { className: "text-sm font-bold text-slate-500 uppercase mb-4", children: "Our Fleet" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [
                            {
                                name: "Bike Delivery",
                                time: "Same Day",
                                price: "from ₦1,500",
                                icon: "🏍️",
                            },
                            {
                                name: "Van Haulage",
                                time: "Scheduled",
                                price: "from ₦15,000",
                                icon: "🚐",
                            },
                            {
                                name: "Inter-State",
                                time: "3-5 Days",
                                price: "Quote Only",
                                icon: "🚚",
                            },
                            {
                                name: "International",
                                time: "7-14 Days",
                                price: "DHL Partner",
                                icon: "✈️",
                            },
                        ].map((s, i) => (_jsxs("div", { className: "bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 cursor-pointer transition-colors", children: [_jsx("div", { className: "text-3xl mb-2", children: s.icon }), _jsx("h3", { className: "font-bold text-sm", children: s.name }), _jsxs("div", { className: "flex justify-between items-center mt-2", children: [_jsx("span", { className: "text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded", children: s.time }), _jsx("span", { className: "text-xs font-bold text-blue-600", children: s.price })] })] }, i))) })] })] }));
};
