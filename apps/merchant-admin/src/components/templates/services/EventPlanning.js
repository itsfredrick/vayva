import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@vayva/ui";
export const EventPlanningTemplate = ({ businessName, demoMode, }) => {
    return (_jsxs("div", { className: "font-sans min-h-screen bg-white text-gray-900", children: [_jsxs("header", { className: "relative h-[60vh] flex items-center justify-center text-center text-white", children: [_jsx("div", { className: "absolute inset-0 bg-black/40 z-10" }), _jsx("img", { src: "https://images.unsplash.com/photo-1519225463351-193509074455?w=1600&q=80", alt: "Elegant event setup with long table", className: "absolute inset-0 w-full h-full object-cover" }), _jsxs("div", { className: "relative z-20 px-4", children: [_jsx("div", { className: "uppercase tracking-[0.3em] text-sm font-bold mb-4", children: "Event Planning & Design" }), _jsx("h1", { className: "text-4xl md:text-6xl font-serif italic mb-8", children: businessName || "Golden Moments" }), _jsx(Button, { className: "bg-white text-black px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-gray-100 transition-colors h-auto", children: "Plan My Event" })] })] }), _jsx("section", { className: "py-20 px-4 bg-gray-50", children: _jsxs("div", { className: "max-w-5xl mx-auto", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsx("h2", { className: "text-3xl font-serif mb-4", children: "Curated Packages" }), _jsx("p", { className: "text-gray-500 max-w-lg mx-auto", children: "We handle everything from intimate proposals to grand wedding receptions. Choose a tier or request a custom quote." })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
                                {
                                    name: "Intimate",
                                    price: "₦250,000",
                                    features: [
                                        "Up to 50 Guests",
                                        "Venue Styling",
                                        "Coordination",
                                        "Basic Sound",
                                    ],
                                },
                                {
                                    name: "Grand",
                                    price: "₦850,000",
                                    features: [
                                        "Up to 300 Guests",
                                        "Premium Decor",
                                        "Full Planning",
                                        "Live Band Stage",
                                        "Catering Logic",
                                    ],
                                },
                                {
                                    name: "Royal",
                                    price: "Custom",
                                    features: [
                                        "Unlimited Guests",
                                        "Luxury Styling",
                                        "Destination Logistics",
                                        "Concierge Service",
                                        "Celebrity Management",
                                    ],
                                },
                            ].map((pkg, i) => (_jsxs("div", { className: `bg-white p-8 border ${i === 1 ? "border-amber-400 shadow-xl relative" : "border-gray-100 shadow-sm"}`, children: [i === 1 && (_jsx("div", { className: "absolute top-0 left-0 w-full text-center -translate-y-1/2", children: _jsx("span", { className: "bg-amber-400 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-full", children: "Most Popular" }) })), _jsx("h3", { className: "font-serif text-2xl mb-2", children: pkg.name }), _jsxs("div", { className: "text-sm text-gray-400 font-bold uppercase tracking-wider mb-8", children: ["Starting at ", pkg.price] }), _jsx("ul", { className: "space-y-4 mb-8", children: pkg.features.map((f) => (_jsxs("li", { className: "flex items-center gap-3 text-sm text-gray-600", children: [_jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-amber-400" }), f] }, f))) }), _jsx(Button, { className: `w-full py-3 text-xs font-bold uppercase tracking-wider border h-auto ${i === 1 ? "bg-amber-400 border-amber-400 text-white" : "border-gray-200 hover:bg-black hover:text-white transition-colors"}`, children: "Select Package" })] }, i))) })] }) })] }));
};
