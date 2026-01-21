import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useStore } from "@/context/StoreContext";
import { Icon, Button } from "@vayva/ui";
export const StreetFoodTemplate = ({ businessName, demoMode, }) => {
    const { products, addToCart, cartTotal, itemCount, checkout, isCheckoutProcessing, currency, } = useStore();
    // Demo Data Override for Street Food
    const foodItems = demoMode
        ? [
            {
                id: "sf_1",
                name: "Beef Suya",
                price: 1500,
                type: "food",
                detail: "Per Stick",
                isSpicy: true,
            },
            {
                id: "sf_2",
                name: "Chicken Suya",
                price: 2000,
                type: "food",
                detail: "Per Stick",
                isSpicy: true,
            },
            {
                id: "sf_3",
                name: "Massive Platter",
                price: 15000,
                type: "food",
                detail: "Feeds 4 People",
                isSpicy: true,
            },
            {
                id: "sf_4",
                name: "Masa (Rice Cake)",
                price: 200,
                type: "food",
                detail: "Per Piece",
                isSpicy: false,
            },
        ]
        : products
            .filter((p) => p.type === "food")
            .map((p) => ({
            ...p,
            detail: p.category || "Delicious",
            isSpicy: !!p.isTodaysSpecial,
        }));
    return (_jsxs("div", { className: "font-sans min-h-screen bg-yellow-400 text-black pb-24", children: [_jsxs("header", { className: "px-4 py-4 bg-black text-yellow-400 border-b-4 border-white flex justify-between items-center sticky top-0 z-50 shadow-xl", children: [_jsx("div", { className: "font-heading font-black text-xl uppercase tracking-tighter transform -rotate-1 truncate max-w-[200px]", children: businessName || "YAHAYA SUYA" }), _jsxs("div", { className: "flex items-center gap-4", children: [itemCount > 0 && (_jsxs("div", { className: "bg-white text-black px-3 py-1 font-bold text-sm border-2 border-black transform rotate-2", children: [currency, " ", cartTotal.toLocaleString(), " (", itemCount, ")"] })), _jsx("div", { className: "bg-green-600 text-white px-3 py-1 font-bold text-xs uppercase tracking-widest animate-pulse border-2 border-white", children: "Open" })] })] }), _jsxs("div", { className: "bg-yellow-400 p-6 text-center border-b-4 border-black", children: [_jsxs("h1", { className: "text-4xl font-black uppercase leading-none mb-4 transform -rotate-1", children: ["Best Suya In", _jsx("br", {}), "Lagos!"] }), _jsx("p", { className: "font-bold text-lg mb-6 border-2 border-black inline-block px-4 py-1 bg-white transform rotate-1", children: "\uD83C\uDF36\uFE0F Spicy Level: 100%" }), _jsx("div", { className: "flex justify-center", children: _jsxs(Button, { onClick: () => checkout("whatsapp"), disabled: isCheckoutProcessing || itemCount === 0, className: "bg-green-600 text-white px-6 py-4 font-bold uppercase tracking-wide border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-700 active:translate-y-1 active:shadow-none transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed h-auto", children: [_jsx(Icon, { name: "MessageCircle", size: 24 }), itemCount === 0 ? "Add Items to Order" : `Order on WhatsApp`] }) })] }), _jsx("div", { className: "p-4 space-y-4 max-w-md mx-auto", children: foodItems.map((item) => (_jsxs("div", { onClick: () => addToCart({ ...item, quantity: 1, productId: item.id }), className: "bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex justify-between items-center group active:bg-gray-50", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-black text-xl uppercase italic group-hover:underline", children: item.name }), _jsx("p", { className: "font-bold text-gray-500 text-sm", children: item.detail || "Delicious" })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-black text-2xl", children: [currency, " ", item.price.toLocaleString()] }), _jsx(Button, { className: "bg-black text-white text-[10px] font-bold uppercase px-2 py-1 mt-1 h-auto min-h-0 min-w-0", children: "Add +" })] })] }, item.id))) }), _jsxs("div", { className: "p-4 text-center font-bold mt-8 pb-12 opacity-60", children: [_jsx("p", { children: "\uD83D\uDCCD 14, Admiralty Way, Lekki" }), _jsx("p", { children: "\uD83D\uDE9A We deliver in 45 mins!" })] }), itemCount > 0 && (_jsx("div", { className: "fixed bottom-4 left-4 right-4 z-40", children: _jsxs(Button, { onClick: () => checkout("whatsapp"), className: "w-full bg-black text-yellow-400 py-4 font-black text-xl uppercase tracking-widest border-4 border-white shadow-xl flex justify-center items-center gap-2 h-auto", children: ["Place Order", " ", _jsxs("span", { className: "bg-white text-black px-2 text-sm rounded", children: [currency, " ", cartTotal.toLocaleString()] })] }) }))] }));
};
