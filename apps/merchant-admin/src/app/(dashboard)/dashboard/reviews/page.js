"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Star, Check, Archive, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/format";
import { Button, cn } from "@vayva/ui";
export default function ReviewsPage() {
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [activeTab, setActiveTab] = useState("ALL");
    useEffect(() => {
        fetchReviews();
    }, []);
    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews");
            if (!res.ok)
                throw new Error("Failed to load reviews");
            const result = await res.json();
            setReviews(result.data || []);
        }
        catch (error) {
            console.error(error);
            toast.error("Could not load reviews");
        }
        finally {
            setLoading(false);
        }
    };
    const handleAction = (action, id) => {
        toast.success(`Review ${action} successfully`);
        // Optimistic update would go here
    };
    const filteredReviews = activeTab === "ALL"
        ? reviews
        : reviews.filter(r => r.status === activeTab);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-slate-900", children: "Reviews & Ratings" }), _jsx("p", { className: "text-slate-500", children: "Manage customer feedback and moderate product reviews." })] }), _jsx("div", { className: "flex items-center gap-4 border-b border-slate-200", children: ["ALL", "PENDING", "PUBLISHED", "ARCHIVED"].map((tab) => (_jsx(Button, { variant: "ghost", onClick: () => setActiveTab(tab), className: cn("pb-3 px-1 text-sm font-medium border-b-2 rounded-none transition-colors flex items-center gap-2 h-auto hover:bg-transparent", activeTab === tab
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"), children: tab.charAt(0) + tab.slice(1).toLowerCase() }, tab))) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden", children: loading ? (_jsx("div", { className: "p-12 flex justify-center", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin text-slate-400" }) })) : filteredReviews.length === 0 ? (_jsxs("div", { className: "p-16 text-center flex flex-col items-center", children: [_jsx("div", { className: "h-12 w-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center mb-4", children: _jsx(Star, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-lg font-medium text-slate-900 mb-1", children: "No reviews found" }), _jsx("p", { className: "text-slate-500 max-w-sm", children: activeTab === "ALL"
                                ? "Customer reviews will appear here once you start receiving them."
                                : `There are no ${activeTab.toLowerCase()} reviews at the moment.` })] })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-slate-50 text-slate-600 font-medium border-b border-slate-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3", children: "Rating" }), _jsx("th", { className: "px-6 py-3", children: "Review" }), _jsx("th", { className: "px-6 py-3", children: "Product" }), _jsx("th", { className: "px-6 py-3", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-right", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-slate-100", children: filteredReviews.map((review) => (_jsxs("tr", { className: "hover:bg-slate-50/50 group", children: [_jsxs("td", { className: "px-6 py-4 align-top w-32", children: [_jsx("div", { className: "flex text-amber-400", children: Array.from({ length: 5 }).map((_, i) => (_jsx(Star, { className: `h-4 w-4 ${i < review.rating ? "fill-current" : "text-slate-200"}` }, i))) }), _jsx("div", { className: "mt-1 text-xs text-slate-500", children: formatDate(review.createdAt) })] }), _jsxs("td", { className: "px-6 py-4 align-top max-w-sm", children: [_jsx("div", { className: "font-medium text-slate-900 mb-0.5", children: review.title || "No Title" }), _jsxs("div", { className: "text-slate-500 line-clamp-2 text-xs mb-1", children: ["by ", review.customerName] })] }), _jsx("td", { className: "px-6 py-4 align-top text-slate-600", children: review.product }), _jsx("td", { className: "px-6 py-4 align-top", children: _jsx("span", { className: `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${review.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                                                    review.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-slate-100 text-slate-600'}`, children: review.status }) }), _jsx("td", { className: "px-6 py-4 align-top text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsx(Button, { size: "icon", variant: "ghost", onClick: () => handleAction('published', review.id), "aria-label": "Approve", className: "h-8 w-8 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors", title: "Approve", children: _jsx(Check, { className: "h-4 w-4" }) }), _jsx(Button, { size: "icon", variant: "ghost", onClick: () => handleAction('archived', review.id), "aria-label": "Archive", className: "h-8 w-8 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors", title: "Archive", children: _jsx(Archive, { className: "h-4 w-4" }) })] }) })] }, review.id))) })] }) })) })] }));
}
