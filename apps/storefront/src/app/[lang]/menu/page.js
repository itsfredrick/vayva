"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { LOCALES } from "@/data/locales";
import { WeekSelector } from "@/components/menu/WeekSelector";
import { MenuFilterBar } from "@/components/menu/MenuFilterBar";
import { MealCard } from "@/components/menu/MealCard";
import { SelectionSummary } from "@/components/menu/SelectionSummary";
import { useStore } from "@/context/StoreContext";
import { Button } from "@vayva/ui";
export default function MenuPage({ params }) {
    const { lang: rawLang } = useParams();
    const lang = (rawLang === "tr" ? "tr" : "en");
    const { store } = useStore();
    const t = LOCALES[lang];
    const [weeks, setWeeks] = useState([]);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWeekId, setSelectedWeekId] = useState("");
    const [selections, setSelections] = useState({}); // weekId -> mealId[]
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilters, setActiveFilters] = useState([]);
    useEffect(() => {
        if (!store)
            return;
        fetch(`/api/menu?slug=${store.slug}`)
            .then((res) => res.json())
            .then((data) => {
            if (data.weeks && data.meals) {
                setWeeks(data.weeks);
                setMeals(data.meals);
                if (data.weeks.length > 0) {
                    setSelectedWeekId(data.weeks.find((w) => !w.isLocked)?.id || data.weeks[0].id);
                }
            }
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, [store]);
    // Derived State
    const activeWeek = weeks.find((w) => w.id === selectedWeekId) || weeks[0];
    const selectedMealIds = selections[selectedWeekId] || [];
    const isLocked = activeWeek?.isLocked || false;
    const mealsPerWeek = 4; // Test Config
    if (loading)
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: "Loading Menu..." }));
    if (!activeWeek)
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: "No active menu found." }));
    // Filter Logic
    const filteredMeals = useMemo(() => {
        return meals.filter((meal) => {
            const matchesSearch = meal.title[lang]
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            // Test filter logic
            const matchesFilters = activeFilters.length === 0 ||
                activeFilters.every((filter) => {
                    if (filter === "under20")
                        return meal.tags.prepTime < 20;
                    if (filter === "vegetarian")
                        return (meal.tags.category === "Vejetaryen" ||
                            !meal.ingredients.some((i) => i.name.includes("Et") ||
                                i.name.includes("Tavuk") ||
                                i.name.includes("Kıyma") ||
                                i.name.includes("Somon")));
                    if (filter === "family")
                        return (meal.tags.category === "Aile" || meal.tags.category === "Klasik");
                    if (filter === "fit")
                        return meal.tags.category === "Fit" || meal.tags.kcal < 500;
                    return true;
                });
            return matchesSearch && matchesFilters;
        });
    }, [searchQuery, activeFilters, lang]);
    const selectedMealsData = useMemo(() => {
        return meals.filter((m) => selectedMealIds.includes(m.id));
    }, [selectedMealIds, meals]);
    // Handlers
    const handleToggleMeal = (mealId) => {
        if (isLocked)
            return;
        setSelections((prev) => {
            const current = prev[selectedWeekId] || [];
            if (current.includes(mealId)) {
                return {
                    ...prev,
                    [selectedWeekId]: current.filter((id) => id !== mealId),
                };
            }
            else {
                if (current.length >= mealsPerWeek) {
                    alert(t.errors.maxMeals);
                    return prev;
                }
                return { ...prev, [selectedWeekId]: [...current, mealId] };
            }
        });
    };
    const handleSave = () => {
        alert("Selection Saved! (Test)");
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-20 bg-noise", children: [_jsx("div", { className: "glass-panel sticky top-0 z-30 border-b border-white/20 pt-8 pb-4", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Men\u00FCm" }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: t.planSummary })] }) }), _jsx(WeekSelector, { weeks: weeks, selectedWeekId: selectedWeekId, onSelectWeek: setSelectedWeekId, lang: lang }), _jsx(MenuFilterBar, { lang: lang, searchQuery: searchQuery, onSearchChange: setSearchQuery, activeFilters: activeFilters, onToggleFilter: (f) => {
                    setActiveFilters((prev) => prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]);
                } }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-8 items-start", children: [_jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6", children: filteredMeals.map((meal) => (_jsx(MealCard, { meal: meal, isSelected: selectedMealIds.includes(meal.id), isLocked: isLocked, lang: lang, onToggle: handleToggleMeal, onViewDetails: () => { } }, meal.id))) }), filteredMeals.length === 0 && (_jsx("div", { className: "text-center py-20", children: _jsx("p", { className: "text-gray-500", children: "No meals found matching your criteria." }) }))] }), _jsx("div", { className: "hidden lg:block w-80 flex-shrink-0", children: _jsx(SelectionSummary, { selectedMeals: selectedMealsData, mealsPerWeek: mealsPerWeek, totalCost: 1200, lang: lang, isLocked: isLocked, onSave: handleSave }) })] }) }), _jsx("div", { className: "fixed bottom-0 left-0 right-0 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 p-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 transition-transform duration-300", children: _jsxs("div", { className: "flex justify-between items-center gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsxs("span", { className: "text-sm font-bold text-gray-900", children: [selectedMealIds.length, "/", mealsPerWeek, " ", t.selected] }), selectedMealIds.length === mealsPerWeek && (_jsx("span", { className: "w-2 h-2 rounded-full bg-green-500 animate-pulse" }))] }), _jsx("div", { className: "text-xs text-gray-500 font-medium", children: "Tot: \u20BA1200" })] }), _jsx(Button, { onClick: handleSave, disabled: isLocked || selectedMealIds.length !== mealsPerWeek, className: `px-8 py-3 rounded-xl text-sm font-bold transition-all shadow-lg active:scale-95 h-auto ${selectedMealIds.length === mealsPerWeek
                                ? "bg-black text-white hover:bg-gray-900 shadow-black/20"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"}`, "aria-label": "Save selection", children: isLocked ? "Locked" : t.saveSelection })] }) })] }));
}
