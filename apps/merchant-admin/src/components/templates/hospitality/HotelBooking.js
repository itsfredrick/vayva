import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from "@/context/StoreContext";
import { Icon, Button } from "@vayva/ui";
export const HotelBookingTemplate = ({ businessName, demoMode, }) => {
    const { products, addToCart, currency, } = useStore();
    const stayItems = demoMode
        ? [
            {
                id: "st_1",
                name: "Deluxe King Room",
                price: 45000,
                type: "hotel",
                stay: { maxGuests: 2, roomType: "Deluxe", amenities: ["WiFi", "AC", "Breakfast"] },
                image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80",
            },
            {
                id: "st_2",
                name: "Executive Suite",
                price: 85000,
                type: "hotel",
                stay: { maxGuests: 3, roomType: "Suite", amenities: ["WiFi", "Jacuzzi", "Mini Bar"] },
                image: "https://images.unsplash.com/photo-1582719478250-c89cae4df85b?w=800&q=80",
            },
            {
                id: "st_3",
                name: "Family Standard",
                price: 35000,
                type: "hotel",
                stay: { maxGuests: 4, roomType: "Standard", amenities: ["WiFi", "TV"] },
                image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
            },
        ]
        : products.filter((p) => p.type === "hotel");
    return (_jsxs("div", { className: "font-sans min-h-screen bg-white text-gray-900", children: [_jsxs("div", { className: "relative h-[60vh] overflow-hidden", children: [_jsx("img", { src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80", alt: "Hotel Hero", className: "w-full h-full object-cover" }), _jsxs("div", { className: "absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white p-6 text-center", children: [_jsx("h1", { className: "text-4xl md:text-6xl font-serif mb-4", children: businessName || "Grand Vayva Resort" }), _jsx("p", { className: "text-lg md:text-xl opacity-90 max-w-2xl font-light", children: "Experience world-class luxury and comfort in the heart of the city." })] })] }), _jsxs("main", { className: "container mx-auto px-4 -mt-10 relative z-10 pb-20", children: [_jsxs("div", { className: "bg-white shadow-2xl rounded-2xl p-8 border border-gray-100", children: [_jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between mb-12 gap-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-serif text-gray-900", children: "Our Accommodations" }), _jsx("p", { className: "text-gray-500", children: "Meticulously designed rooms for your relaxation" })] }), _jsx("div", { className: "flex gap-4", children: _jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm font-medium border border-gray-200", children: [_jsx(Icon, { name: "Calendar", size: 16, className: "text-vayva-green" }), _jsx("span", { children: "Check Availability" })] }) })] }), _jsx("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: stayItems.map((item) => (_jsxs("div", { className: "group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all bg-white", children: [_jsxs("div", { className: "aspect-[4/3] overflow-hidden relative", children: [_jsx("img", { src: item.image || item.images?.[0] || "", alt: item.name, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }), _jsx("div", { className: "absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm border border-gray-100", children: item.stay?.roomType || "Standard" })] }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsx("h3", { className: "text-xl font-serif font-bold text-gray-900", children: item.name }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-sm text-gray-400 block uppercase tracking-wider", children: "Per Night" }), _jsxs("span", { className: "text-lg font-bold text-vayva-green", children: [currency, item.price.toLocaleString()] })] })] }), _jsxs("div", { className: "flex items-center gap-4 mb-4 text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Icon, { name: "Users", size: 14 }), _jsxs("span", { children: [item.stay?.maxGuests || 2, " Guests"] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Icon, { name: "Wifi", size: 14 }), _jsx("span", { children: "Fast WiFi" })] })] }), item.stay?.amenities && (_jsx("div", { className: "flex flex-wrap gap-2 mb-6", children: item.stay.amenities.map((amenity) => (_jsx("span", { className: "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-gray-50 text-gray-400 rounded-md border border-gray-100", children: amenity }, amenity))) })), _jsx(Button, { variant: "outline", onClick: () => addToCart({ ...item, quantity: 1, productId: item.id }), className: "w-full bg-black text-white hover:bg-gray-800 rounded-xl font-bold py-6 group-hover:bg-vayva-green transition-colors", children: "Book This Room" })] })] }, item.id))) })] }), _jsxs("div", { className: "mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 text-center", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100", children: _jsx(Icon, { name: "Wind", size: 24, className: "text-gray-900" }) }), _jsx("h3", { className: "font-serif text-xl font-bold", children: "Pure Air" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Every room is equipped with high-end air purification systems." })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100", children: _jsx(Icon, { name: "ShieldCheck", size: 24, className: "text-gray-900" }) }), _jsx("h3", { className: "font-serif text-xl font-bold", children: "Privacy First" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Discreet service and soundproof walls for absolute peace of mind." })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto border border-gray-100", children: _jsx(Icon, { name: "Coffee", size: 24, className: "text-gray-900" }) }), _jsx("h3", { className: "font-serif text-xl font-bold", children: "Artisan Food" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Enjoy curated local delicacies delivered straight to your suite." })] })] })] })] }));
};
