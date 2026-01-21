import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
export const CommunityCoopTemplate = ({ businessName, demoMode, }) => {
    return (_jsxs("div", { className: "font-sans min-h-screen bg-[#FDFBF7] text-stone-900", children: [_jsxs("header", { className: "px-6 py-6 text-center border-b border-stone-200", children: [_jsx("div", { className: "inline-block bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4", children: "Community Buy Group" }), _jsx("h1", { className: "text-3xl font-black text-stone-800 mb-2", children: businessName || "Lagos Mums Co-op" }), _jsxs("p", { className: "text-stone-500 text-sm max-w-sm mx-auto", children: ["Join 1,200+ members buying food in bulk to save money. Next cycle closes in ", _jsx("span", { className: "font-bold text-orange-600", children: "3 days" }), "."] })] }), _jsx("section", { className: "p-6", children: _jsx("div", { className: "max-w-md mx-auto space-y-4", children: [
                        {
                            name: "50kg Bag of Rice",
                            retail: "₦85,000",
                            coop: "₦72,000",
                            progress: 85,
                            slots: "10 slots left",
                        },
                        {
                            name: "Frozen Turkey (Carton)",
                            retail: "₦45,000",
                            coop: "₦38,500",
                            progress: 40,
                            slots: "15 slots left",
                        },
                        {
                            name: "Palm Oil (25 Litres)",
                            retail: "₦30,000",
                            coop: "₦26,000",
                            progress: 100,
                            slots: "Sold Out",
                        },
                    ].map((deal, i) => (_jsxs("div", { className: `bg-white p-5 rounded-2xl shadow-sm border-2 ${deal.progress === 100 ? "border-gray-100 grayscale opacity-70" : "border-stone-100"}`, children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h3", { className: "font-bold text-lg leading-tight", children: deal.name }), _jsxs("div", { className: "text-right", children: [_jsx("div", { className: "text-xs text-gray-400 line-through", children: deal.retail }), _jsx("div", { className: "text-xl font-bold text-green-600", children: deal.coop })] })] }), _jsx("div", { className: "bg-gray-100 h-2.5 rounded-full overflow-hidden mb-2", children: _jsx("div", { className: "bg-orange-400 h-full rounded-full transition-all duration-300", ref: (el) => { if (el)
                                        el.style.width = `${deal.progress}%`; } }) }), _jsxs("div", { className: "flex justify-between items-center text-xs font-bold text-stone-500 mb-4", children: [_jsxs("span", { children: [deal.progress, "% Funded"] }), _jsx("span", { children: deal.slots })] }), _jsx(Button, { draggable: false, disabled: deal.progress === 100, className: "w-full bg-stone-900 text-white py-3 rounded-xl font-bold hover:bg-stone-700 disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer disabled:cursor-not-allowed h-auto", children: deal.progress === 100 ? "Closed" : "Join Deal" })] }, i))) }) }), _jsx("section", { className: "fixed bottom-0 left-0 right-0 p-4 bg-[#FDFBF7]/90 backdrop-blur border-t border-stone-200", children: _jsxs("div", { className: "max-w-md mx-auto bg-orange-100 rounded-xl p-4 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-bold text-orange-900 uppercase mb-0.5", children: "Not a member?" }), _jsx("div", { className: "text-sm font-bold text-orange-950", children: "Join for \u20A61,000/mo" })] }), _jsx(Button, { className: "bg-orange-500 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-orange-600 h-auto", children: "Register" })] }) })] }));
};
