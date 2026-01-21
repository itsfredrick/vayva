import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from "@/context/StoreContext";
import { Icon, Button } from "@vayva/ui";
export const SoloProfessionalTemplate = ({ businessName, demoMode, }) => {
    const { products, addToCart, cartTotal, itemCount, checkout, isCheckoutProcessing, currency, } = useStore();
    // Demo Data Override for Solo Professional
    const serviceItems = demoMode
        ? [
            {
                id: "svc_1",
                name: "Full Bridal Glam",
                price: 150000,
                type: "service",
                duration: "3 hrs",
                desc: "Complete consultation, trial session, and wedding day makeup.",
            },
            {
                id: "svc_2",
                name: "Photoshoot/Editorial",
                price: 45000,
                type: "service",
                duration: "2 hrs",
                desc: "High definition makeup for studio lighting.",
            },
            {
                id: "svc_3",
                name: "Gele Tying",
                price: 5000,
                type: "service",
                duration: "30 mins",
                desc: "Expert gele styling (Avant-garde or Traditional).",
            },
            {
                id: "svc_4",
                name: "Home Service Haircut",
                price: 15000,
                type: "service",
                duration: "1 hr",
                desc: "Premium haircut at your convenience.",
            },
        ]
        : products
            .filter((p) => p.type === "service")
            .map((p) => ({
            ...p,
            desc: p.description,
            duration: p.durationMinutes
                ? `${p.durationMinutes} mins`
                : "1 hr",
        }));
    return (_jsxs("div", { className: "font-sans min-h-screen bg-neutral-50 text-neutral-900 pb-20", children: [_jsxs("div", { className: "py-12 px-4 text-center", children: [_jsx("div", { className: "w-24 h-24 mx-auto rounded-full bg-neutral-200 overflow-hidden mb-4 ring-4 ring-white shadow-lg", children: _jsx("img", { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", alt: "Professional", className: "w-full h-full object-cover" }) }), _jsx("h1", { className: "text-2xl font-bold tracking-tight mb-2", children: businessName || "Sarah Adebayo" }), _jsx("p", { className: "text-neutral-500 text-sm max-w-xs mx-auto mb-6", children: "Professional Makeup Artist & Beauty Consultant based in Lekki Phase 1." }), _jsxs("div", { className: "flex justify-center gap-4", children: [_jsx(Button, { onClick: () => document
                                    .getElementById("services")
                                    ?.scrollIntoView({ behavior: "smooth" }), className: "bg-black text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all h-auto", children: "Book Appointment" }), _jsx(Button, { variant: "outline", className: "bg-white text-black border border-neutral-200 px-4 py-2.5 rounded-full w-10 h-10 flex items-center justify-center hover:bg-neutral-50 h-auto", children: _jsx(Icon, { name: "MessageCircle", size: 16 }) })] })] }), _jsxs("div", { id: "services", className: "bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] min-h-screen p-6 space-y-8", children: [_jsxs("section", { children: [_jsx("h2", { className: "text-xs font-bold uppercase tracking-widest text-neutral-400 mb-6", children: "Services" }), _jsx("div", { className: "space-y-6", children: serviceItems.map((item) => (_jsxs("div", { className: "flex justify-between items-start group cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors", onClick: () => addToCart({ ...item, quantity: 1, productId: item.id }), children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "font-bold text-lg group-hover:text-neutral-600 transition-colors", children: item.name }), _jsx("p", { className: "text-sm text-neutral-500 leading-relaxed max-w-[200px]", children: item.desc }), item.duration && (_jsx("div", { className: "text-xs font-medium text-neutral-400 bg-neutral-100 inline-block px-2 py-0.5 rounded", children: item.duration }))] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-bold", children: [currency, " ", item.price.toLocaleString()] }), _jsx(Button, { variant: "link", className: "text-[10px] font-bold uppercase border-b border-black pb-0.5 mt-2 hover:opacity-50 h-auto p-0 rounded-none", children: "Book" })] })] }, item.id))) })] }), _jsxs("section", { children: [_jsx("h2", { className: "text-xs font-bold uppercase tracking-widest text-neutral-400 mb-4", children: "Portfolio" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1487412947132-232a8b71a0d1?w=400&q=80", alt: "Bridal makeup portfolio shot", className: "rounded-2xl w-full h-40 object-cover" }), _jsx("img", { src: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?w=400&q=80", alt: "Editorial makeup portfolio shot", className: "rounded-2xl w-full h-40 object-cover translate-y-4" }), _jsx("img", { src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=400&q=80", alt: "Eye makeup detail shot", className: "rounded-2xl w-full h-40 object-cover" }), _jsx("img", { src: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&q=80", alt: "Creative makeup portfolio shot", className: "rounded-2xl w-full h-40 object-cover translate-y-4" })] })] })] }), itemCount > 0 && (_jsx("div", { className: "fixed bottom-6 left-6 right-6", children: _jsxs(Button, { onClick: () => checkout("whatsapp"), className: "w-full bg-black text-white py-4 rounded-full font-bold shadow-2xl shadow-neutral-500/30 flex items-center justify-between px-8 h-auto", children: [_jsxs("span", { children: [itemCount, " Service", itemCount > 1 ? "s" : ""] }), _jsxs("span", { children: ["Confirm Booking", " ", _jsx(Icon, { name: "ArrowRight", size: 16, className: "inline ml-1" })] })] }) }))] }));
};
