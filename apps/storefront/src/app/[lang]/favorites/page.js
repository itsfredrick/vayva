"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Heart } from "lucide-react";
import { LOCALES } from "@/data/locales";
import { useUserInteractions } from "@/hooks/useUserInteractions";
import { DeliveryCard } from "@/components/history/DeliveryCard";
import { useStore } from "@/context/StoreContext";
// Simple Toast Component (Internal) - Copied for simplicity/isolation
function Toast({ message, show }) {
    if (!show)
        return null;
    return (_jsx("div", { className: "fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium z-50 animate-fade-in-up", children: message }));
}
export default function FavoritesPage({ params }) {
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
    // Filter favorited meals
    const favoritedMeals = meals.filter((m) => favorites.includes(m.id));
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
        return null;
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-20 font-sans bg-noise", children: [_jsx(Toast, { message: toast, show: !!toast }), _jsx("div", { className: "glass-panel sticky top-0 z-30 border-b border-white/20 pt-8 pb-4", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs(Link, { href: `/${lang}/menu`, className: "inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-4 transition-colors", children: [_jsx(ArrowLeft, { size: 16 }), t.favorites.backToMenu] }), _jsx("h1", { className: "text-2xl font-bold text-gray-900", children: t.favorites.title })] }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: favoritedMeals.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6", children: favoritedMeals.map((meal) => (_jsx(DeliveryCard, { meal: meal, lang: lang, rating: ratings[meal.id] || 0, isFavorite: true, onRate: (r) => handleRate(meal.id, r), onToggleFavorite: () => handleFav(meal.id) }, meal.id))) })) : (_jsxs("div", { className: "text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200", children: [_jsx("div", { className: "w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300", children: _jsx(Heart, { size: 32 }) }), _jsx("h3", { className: "text-lg font-bold text-gray-900 mb-2", children: t.favorites.empty }), _jsx("p", { className: "text-gray-500 mb-6 max-w-sm mx-auto", children: "Go back to your menu or history to find meals you love." }), _jsx(Link, { href: `/${lang}/menu`, className: "inline-flex items-center font-bold text-white bg-[#0B1220] px-6 py-3 rounded-xl hover:shadow-lg transition-all", children: t.favorites.backToMenu })] })) })] }));
}
