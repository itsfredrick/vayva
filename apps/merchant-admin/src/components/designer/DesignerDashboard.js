"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Icon, cn, Button } from "@vayva/ui";
import { useRouter } from "next/navigation";
export const DesignerDashboard = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    useEffect(() => {
        fetch("/api/designer/templates")
            .then((res) => res.json())
            .then((data) => {
            setTemplates(data);
            setLoading(false);
        })
            .catch((err) => {
            console.error(err);
            setLoading(false);
        });
    }, []);
    const getStatusColor = (status) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-700";
            case "draft":
                return "bg-gray-100 text-gray-700";
            case "ai_review":
                return "bg-purple-100 text-purple-700 animate-pulse";
            case "manual_review":
                return "bg-blue-100 text-blue-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-500";
        }
    };
    return (_jsxs("div", { className: "max-w-7xl mx-auto p-8", children: [_jsxs("header", { className: "flex justify-between items-center mb-12", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold font-heading text-gray-900", children: "Designer Portal" }), _jsx("p", { className: "text-gray-500 mt-2", children: "Manage your template submissions and earnings." })] }), _jsxs(Button, { onClick: () => router.push("/designer/submit"), className: "bg-black text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2 h-auto", children: [_jsx(Icon, { name: "Plus", size: 20 }), " Submit New Template"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12", children: [_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm", children: [_jsx("div", { className: "text-gray-500 text-sm font-bold mb-1", children: "Total Earnings" }), _jsx("div", { className: "text-3xl font-bold text-gray-900", children: "\u20A6450,000" }), _jsx("div", { className: "text-green-600 text-xs font-bold mt-2", children: "+12% this month" })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm", children: [_jsx("div", { className: "text-gray-500 text-sm font-bold mb-1", children: "Total Downloads" }), _jsx("div", { className: "text-3xl font-bold text-gray-900", children: "45" }), _jsx("div", { className: "text-gray-400 text-xs font-bold mt-2", children: "Across 1 template" })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm", children: [_jsx("div", { className: "text-gray-500 text-sm font-bold mb-1", children: "Review Queue" }), _jsx("div", { className: "text-3xl font-bold text-gray-900", children: "1" }), _jsx("div", { className: "text-purple-600 text-xs font-bold mt-2", children: "AI Analyzing..." })] })] }), _jsx("h2", { className: "text-xl font-bold text-gray-900 mb-6", children: "Your Templates" }), loading ? (_jsx("div", { className: "text-center py-20 text-gray-400", children: "Loading templates..." })) : templates.length === 0 ? (_jsxs("div", { className: "text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200", children: [_jsx("h3", { className: "font-bold text-gray-900", children: "No templates yet" }), _jsx("p", { className: "text-gray-500 text-sm mb-4", children: "Start by submitting your first masterpiece." }), _jsx(Button, { variant: "outline", className: "bg-white border border-gray-200 text-black px-4 py-2 rounded-lg font-bold text-sm h-auto", children: "Read Guidelines" })] })) : (_jsx("div", { className: "space-y-4", children: templates.map((tpl) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0", children: _jsx("img", { src: tpl.previewImageDesktop ||
                                            tpl.previewImages?.cover ||
                                            "/images/template-previews/default-desktop.png", alt: tpl.name, className: "w-full h-full object-cover" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg text-gray-900", children: tpl.name }), _jsxs("div", { className: "flex items-center gap-2 mt-1 mb-2", children: [_jsx("span", { className: cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", getStatusColor(tpl.status)), children: tpl.status.replace("_", " ") }), _jsxs("span", { className: "text-xs text-gray-400", children: ["\u2022 v", tpl.currentVersion] }), _jsxs("span", { className: "text-xs text-gray-400", children: ["\u2022 ", tpl.category] })] }), tpl.aiReviewResult?.status === "needs_fix" && (_jsxs("div", { className: "bg-red-50 text-red-700 text-xs p-3 rounded-lg max-w-md", children: [_jsx("strong", { children: "AI Feedback:" }), _jsx("ul", { className: "list-disc list-inside mt-1", children: tpl.aiReviewResult.issues.map((issue, idx) => (_jsx("li", { children: issue }, idx))) })] }))] })] }), _jsxs("div", { className: "flex items-center gap-6 min-w-[200px] justify-end", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "text-sm font-bold text-gray-900", children: [tpl.downloads, " Installs"] }), _jsxs("div", { className: "text-xs text-green-600 font-bold", children: ["\u20A6", tpl.revenue.toLocaleString(), " Rev"] })] }), _jsx(Button, { variant: "ghost", size: "icon", className: "p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-black transition-colors h-auto w-auto", children: _jsx(Icon, { name: "EllipsisVertical", size: 20 }) })] })] }, tpl.id))) }))] }));
};
