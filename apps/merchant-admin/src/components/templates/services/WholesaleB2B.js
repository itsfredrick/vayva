import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
export const WholesaleB2BTemplate = ({ businessName, demoMode, }) => {
    return (_jsxs("div", { className: "font-mono min-h-screen bg-gray-50 text-gray-800", children: [_jsxs("header", { className: "bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-bold text-gray-900 uppercase tracking-tight", children: businessName || "Alaba Electronics Wholesale" }), _jsxs("div", { className: "text-[10px] text-gray-500 flex gap-2", children: [_jsx("span", { children: "MOQ: 1 Dozen" }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: "GST: Included" })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-xs bg-gray-100 px-2 py-1 rounded", children: "Hi, Distributor" }), _jsx(Button, { className: "bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase hover:bg-gray-800 h-auto", children: "Quick Order Form" })] })] }), _jsx("div", { className: "p-6 overflow-x-auto", children: _jsxs("table", { className: "w-full bg-white border border-gray-200 text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-gray-100 text-gray-600 border-b border-gray-200", children: [_jsx("th", { className: "py-3 px-4 text-left font-bold w-20", children: "SKU" }), _jsx("th", { className: "py-3 px-4 text-left font-bold", children: "Product Name" }), _jsx("th", { className: "py-3 px-4 text-left font-bold", children: "Stock" }), _jsx("th", { className: "py-3 px-4 text-right font-bold", children: "Unit Price" }), _jsx("th", { className: "py-3 px-4 text-right font-bold", children: "Pack Price (12)" }), _jsx("th", { className: "py-3 px-4 text-center font-bold w-32", children: "Order Qty" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: [
                                {
                                    sku: "AE-001",
                                    name: "USB-C Fast Charger (20W)",
                                    stock: "450pcs",
                                    unit: "₦2,500",
                                    pack: "₦28,000",
                                },
                                {
                                    sku: "AE-002",
                                    name: "Bluetooth Earbuds (Pro Clone)",
                                    stock: "120pcs",
                                    unit: "₦8,000",
                                    pack: "₦90,000",
                                },
                                {
                                    sku: "AE-003",
                                    name: "Power Bank 20,000mAh",
                                    stock: "85pcs",
                                    unit: "₦12,500",
                                    pack: "₦145,000",
                                },
                                {
                                    sku: "AE-004",
                                    name: "Screen Guard (iPhone 13-15)",
                                    stock: "2,000pcs",
                                    unit: "₦500",
                                    pack: "₦5,000",
                                },
                                {
                                    sku: "AE-005",
                                    name: "OTG Adapter (Type C)",
                                    stock: "500pcs",
                                    unit: "₦300",
                                    pack: "₦3,000",
                                },
                            ].map((row, i) => (_jsxs("tr", { className: "hover:bg-blue-50/50 transition-colors", children: [_jsx("td", { className: "py-3 px-4 text-gray-500", children: row.sku }), _jsx("td", { className: "py-3 px-4 font-bold text-gray-900", children: row.name }), _jsx("td", { className: "py-3 px-4 text-green-600 font-bold", children: row.stock }), _jsx("td", { className: "py-3 px-4 text-right text-gray-600", children: row.unit }), _jsx("td", { className: "py-3 px-4 text-right font-bold text-gray-900 bg-gray-50/50", children: row.pack }), _jsx("td", { className: "py-3 px-4", children: _jsx("div", { className: "flex items-center border border-gray-300 bg-white", children: _jsx("input", { type: "number", min: "0", placeholder: "0", className: "w-full px-2 py-1 text-center outline-none" }) }) })] }, i))) })] }) }), _jsxs("div", { className: "fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-4 shadow-lg flex justify-between items-center z-40", children: [_jsxs("div", { className: "text-xs text-gray-500", children: [_jsx("span", { className: "font-bold text-gray-900", children: "3 Items" }), " in Draft Order"] }), _jsxs("div", { className: "flex gap-4 items-center", children: [_jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-[10px] text-gray-500 uppercase", children: "Estimated Total" }), _jsx("div", { className: "font-bold text-lg", children: "\u20A6175,000" })] }), _jsx(Button, { className: "bg-green-600 text-white px-8 py-3 text-sm font-bold uppercase hover:bg-green-700 tracking-wide h-auto", children: "Submit Order" })] })] })] }));
};
