"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Heart, } from "lucide-react";
import { DEMO_DELIVERIES } from "@/data/test-history";
import { LOCALES } from "@/data/locales";
import { useUserInteractions } from "@/hooks/useUserInteractions";
import { HistoryGrid } from "@/components/history/HistoryGrid";
import { useStore } from "@/context/StoreContext";
// Simple Toast Component (Internal)
function Toast({ message, show }) {
    if (!show)
        return null;
    return (_jsx("div", { className: "fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50 animate-fade-in-up", children: message }));
}
export default function PastDeliveriesPage({ params }) {
    const { lang: rawLang } = useParams();
    const lang = (rawLang === "tr" ? "tr" : "en");
    const { store } = useStore();
    const t = LOCALES[lang];
    const { ratings, favorites, rateMeal, toggleFavorite, isLoaded } = useUserInteractions();
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!store)
            return;
        fetch(`/api/menu?slug=${store.slug}`)
            .then((res) => res.json())
            .then((data) => {
            if (data.meals)
                setMeals(data.meals);
            setLoading(false);
        })
            .catch(() => setLoading(false));
    }, [store]);
    const [toast, setToast] = useState("");
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2000);
    };
    const handleRate = (id, r) => {
        rateMeal(id, r);
        showToast(t.ratings.saved);
    };
    const handleFav = (id) => {
        const result = toggleFavorite(id);
        showToast(result.isFavorite ? t.favorites.added : t.favorites.removed);
    };
    if (!isLoaded)
        return null; // Hydration safe
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-20 font-sans bg-noise", children: [_jsx(Toast, { message: toast, show: !!toast }), _jsx("div", { className: "glass-panel sticky top-0 z-30 border-b border-white/20 pt-8 pb-4", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-end", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: t.history.title }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: t.history.subtitle })] }), _jsxs(Link, { href: `/${lang}/favorites`, className: "flex items-center gap-2 text-sm font-bold text-[#22C55E] hover:text-[#16A34A] transition-colors bg-[#22C55E]/5 px-4 py-2 rounded-full", children: [_jsx(Heart, { size: 16 }), t.history.goToFavorites, _jsx(ArrowRight, { size: 16 })] })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: DEMO_DELIVERIES.length > 0 ? (_jsx(HistoryGrid, { deliveries: DEMO_DELIVERIES, meals: meals, ratings: ratings, favorites: favorites, lang: lang, onRate: handleRate, onToggleFavorite: handleFav })) : (_jsxs("div", { className: "text-center py-20", children: [_jsx("div", { className: "w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400", children: _jsx("span", { className: "text-2xl", children: "\uD83D\uDCE6" }) }), _jsx("p", { className: "text-gray-500 mb-6", children: t.history.empty }), _jsx(Link, { href: `/${lang}/menu`, className: "inline-flex items-center font-bold text-white bg-[#0B1220] px-6 py-3 rounded-xl hover:shadow-lg transition-all", children: t.favorites.backToMenu })] })) })] }));
}
