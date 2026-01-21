import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { ActivePerformanceCard } from "@/components/analytics/ActivePerformanceCard";
import { PerformanceInsights } from "@/components/analytics/PerformanceInsights";
import { ComparisonTable } from "@/components/analytics/ComparisonTable";
export const TemplatePerformanceView = () => {
    const [activeData, setActiveData] = useState(null);
    const [comparisonData, setComparisonData] = useState([]);
    const [insights, setInsights] = useState([]);
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadData = async () => {
            try {
                const [active, compare, ins, rec] = await Promise.all([
                    fetch("/api/templates/performance/active").then((r) => r.json()),
                    fetch("/api/templates/performance/compare").then((r) => r.json()),
                    fetch("/api/templates/performance/insights").then((r) => r.json()),
                    fetch("/api/templates/recommendations").then((r) => r.json()),
                ]);
                setActiveData(active);
                setComparisonData(compare);
                setInsights(ins);
                setRecommendation(rec);
            }
            catch (e) {
                console.error("Failed to load analytics", e);
            }
            finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);
    if (loading)
        return (_jsx("div", { className: "p-10 text-center text-gray-400", children: "Loading performance data..." }));
    return (_jsxs("div", { className: "space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500", children: [activeData && _jsx(ActivePerformanceCard, { data: activeData }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(ComparisonTable, { data: comparisonData }) }), _jsx("div", { children: _jsx(PerformanceInsights, { insights: insights, recommendation: recommendation }) })] })] }));
};
