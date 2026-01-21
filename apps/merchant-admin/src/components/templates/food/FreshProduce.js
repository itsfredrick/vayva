import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
export const FreshProduceTemplate = ({ businessName, demoMode, }) => {
    return (_jsxs("div", { className: "font-sans min-h-screen bg-green-50 text-green-900 pb-20", children: [_jsxs("header", { className: "bg-white px-6 py-4 border-b border-green-100 flex justify-between items-center sticky top-0 z-50", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "\uD83E\uDD6C" }), _jsxs("div", { className: "leading-tight", children: [_jsx("h1", { className: "font-bold text-lg text-green-800", children: businessName || "Fresh Farm Direct" }), _jsx("p", { className: "text-[10px] uppercase tracking-wider font-bold text-green-600", children: "Harvested Today" })] })] }), _jsxs("div", { className: "bg-green-100 p-2 rounded-full relative", children: [_jsx("svg", { className: "w-6 h-6 text-green-700", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" }) }), _jsx("span", { className: "absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold", children: "3" })] })] }), _jsx("div", { className: "bg-green-800 text-white text-xs py-2 overflow-hidden whitespace-nowrap", children: _jsx("div", { className: "inline-block animate-marquee px-4", children: "\uD83C\uDF45 Tomatoes: \u20A625,000/basket \u2022 \uD83C\uDF36\uFE0F Scotch Bonnet: \u20A618,000/bag \u2022 \uD83E\uDD54 Irish Potato: \u20A645,000/bag \u2022 \uD83E\uDDC5 Onions: \u20A632,000/bag" }) }), _jsxs("div", { className: "p-4 bg-white shadow-sm mb-6", children: [_jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx(Button, { className: "flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-bold h-auto", children: "Bulk / Wholesale" }), _jsx(Button, { variant: "outline", className: "flex-1 bg-green-50 text-green-700 py-2 rounded-lg text-sm font-bold border border-green-100 h-auto", children: "Retail / Kg" })] }), _jsx("input", { type: "text", placeholder: "Search vegetables, tubers, fruits...", className: "w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" })] }), _jsx("section", { className: "px-4 space-y-3", children: [
                    {
                        name: "Fresh Tomatoes (Jos)",
                        unit: "Paint Bucket",
                        price: "₦4,500",
                        img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&q=80",
                        stock: "High Stock",
                    },
                    {
                        name: "Sweet Potato",
                        unit: "10kg Bag",
                        price: "₦8,000",
                        img: "https://images.unsplash.com/photo-1596097635121-14b63b84043b?w=800&q=80",
                        stock: "Low Stock",
                    },
                    {
                        name: "Ugwu Leaves (Sliced)",
                        unit: "Bundle",
                        price: "₦500",
                        img: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&q=80",
                        stock: "Fresh Cut",
                    },
                    {
                        name: "Plantain (Unripe)",
                        unit: "Bunch",
                        price: "₦3,200",
                        img: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=800&q=80",
                        stock: "",
                    },
                ].map((item, i) => (_jsxs("div", { className: "bg-white p-3 rounded-xl border border-green-100 flex gap-4 shadow-sm", children: [_jsx("div", { className: "w-20 h-20 bg-gray-100 rounded-lg shrink-0 overflow-hidden relative", children: _jsx("img", { src: item.img, alt: item.name, className: "w-full h-full object-cover" }) }), _jsxs("div", { className: "flex-1 flex flex-col justify-center", children: [_jsx("h3", { className: "font-bold text-gray-900", children: item.name }), _jsxs("p", { className: "text-xs text-gray-500 font-medium mb-1", children: ["Per ", item.unit, " ", item.stock && (_jsx("span", { className: `ml-2 text-[10px] px-1.5 py-0.5 rounded ${item.stock === "Low Stock" ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`, children: item.stock }))] }), _jsxs("div", { className: "flex items-center justify-between mt-1", children: [_jsx("span", { className: "font-bold text-green-700 text-lg", children: item.price }), _jsxs("div", { className: "flex items-center border border-gray-200 rounded-lg overflow-hidden", children: [_jsx(Button, { variant: "ghost", className: "px-2 py-1 bg-gray-50 text-gray-600 hover:bg-gray-100 h-auto rounded-none", children: "-" }), _jsx("span", { className: "px-2 py-1 text-xs font-bold w-6 text-center", children: "0" }), _jsx(Button, { variant: "ghost", className: "px-2 py-1 bg-green-50 text-green-700 hover:bg-green-100 h-auto rounded-none", children: "+" })] })] })] })] }, i))) }), _jsx("div", { className: "px-4 mt-8", children: _jsxs("div", { className: "bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-bold text-blue-600 uppercase mb-1", children: "Next Delivery Run" }), _jsx("div", { className: "font-bold text-blue-900", children: "Tomorrow, 6:00 AM - 9:00 AM" })] }), _jsx(Button, { variant: "outline", className: "bg-white text-blue-600 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold h-auto", children: "Change" })] }) })] }));
};
