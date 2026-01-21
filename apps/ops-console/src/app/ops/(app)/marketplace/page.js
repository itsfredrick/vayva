"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { ShoppingBag, Star, Tag, RefreshCw, Eye, EyeOff, LayoutTemplate, Box } from "lucide-react";
import { useOpsQuery } from "@/hooks/useOpsQuery";
import { toast } from "sonner";
import { Button } from "@vayva/ui";
export default function MarketplacePage() {
    const [activeTab, setActiveTab] = useState("TEMPLATES");
    // Templates Query
    const { data: templates, isLoading: loadingTemplates, refetch: refetchTemplates } = useOpsQuery(["templates-list"], () => fetch("/api/ops/marketplace/templates").then(res => res.json().then(j => j.data)));
    // Apps Query
    const { data: apps, isLoading: loadingApps, refetch: refetchApps } = useOpsQuery(["apps-list"], () => fetch("/api/ops/marketplace/apps").then(res => res.json().then(j => j.data)));
    // Template Actions
    const toggleFeatured = async (id, current) => {
        try {
            await fetch(`/api/ops/marketplace/templates/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ isFeatured: !current })
            });
            toast.success("Updated template");
            refetchTemplates();
        }
        catch (e) {
            toast.error("Update failed");
        }
    };
    const toggleActive = async (id, current) => {
        try {
            await fetch(`/api/ops/marketplace/templates/${id}`, {
                method: "PATCH",
                body: JSON.stringify({ isActive: !current })
            });
            toast.success("Updated status");
            refetchTemplates();
        }
        catch (e) {
            toast.error("Update failed");
        }
    };
    return (_jsxs("div", { className: "p-8 space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-3xl font-bold text-gray-900 flex items-center gap-3", children: [_jsx(ShoppingBag, { className: "w-8 h-8 text-indigo-600" }), "App & Template Marketplace"] }), _jsx("p", { className: "text-gray-500 mt-1", children: "Manage store templates and installed apps." })] }), _jsx("div", { className: "flex gap-2", children: _jsx(Button, { variant: "ghost", size: "icon", onClick: () => { refetchTemplates(); refetchApps(); }, className: "rounded-full h-8 w-8", "aria-label": "Refresh marketplace", children: _jsx(RefreshCw, { className: `w-5 h-5 text-gray-500 ${loadingTemplates || loadingApps ? 'animate-spin' : ''}` }) }) })] }), _jsxs("div", { className: "flex border-b border-gray-200", children: [_jsxs("button", { onClick: () => setActiveTab("TEMPLATES"), className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "TEMPLATES"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"}`, children: [_jsx(LayoutTemplate, { size: 16 }), " Templates"] }), _jsxs("button", { onClick: () => setActiveTab("APPS"), className: `px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "APPS"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-500 hover:text-gray-700"}`, children: [_jsx(Box, { size: 16 }), " Apps (Registry)"] })] }), activeTab === "TEMPLATES" && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: [loadingTemplates && _jsx("p", { className: "text-gray-400 p-8", children: "Loading templates..." }), !loadingTemplates && templates?.length === 0 && _jsx("p", { className: "text-gray-400 p-8", children: "No templates found." }), templates?.map((t) => (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h3", { className: "font-bold text-lg text-gray-900", children: t.name }), t.isFeatured && (_jsxs("span", { className: "bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold", children: [_jsx(Star, { size: 10 }), " Featured"] }))] }), _jsx("p", { className: "text-sm text-gray-500 line-clamp-2 min-h-[40px]", children: t.description }), _jsx("div", { className: "flex flex-wrap gap-2", children: t.tags.map((tag) => (_jsxs("span", { className: "text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded flex items-center gap-1", children: [_jsx(Tag, { size: 10 }), " ", tag] }, tag))) }), _jsxs("div", { className: "flex items-center justify-between pt-4 border-t border-gray-100", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${t.isActive ? 'bg-green-500' : 'bg-gray-300'}` }), _jsx("span", { className: "text-xs font-medium text-gray-600", children: t.isActive ? "Active" : "Hidden" })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => toggleActive(t.id, t.isActive), className: "p-1.5 text-gray-500 hover:bg-gray-100 rounded h-8 w-8", children: t.isActive ? _jsx(Eye, { size: 16 }) : _jsx(EyeOff, { size: 16 }) }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => toggleFeatured(t.id, t.isFeatured), className: `p-1.5 rounded h-8 w-8 ${t.isFeatured ? 'text-amber-500 hover:bg-amber-50' : 'text-gray-400 hover:bg-gray-100'}`, children: _jsx(Star, { size: 16 }) })] })] })] }, t.id)))] })), activeTab === "APPS" && (_jsx("div", { className: "bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 font-medium", children: "Extension ID" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Developer" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Status" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Manifest URL" }), _jsx("th", { className: "px-6 py-3 font-medium", children: "Last Updated" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: loadingApps ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "p-12 text-center text-gray-400", children: "Loading apps..." }) })) : !apps?.length ? (_jsx("tr", { children: _jsx("td", { colSpan: 5, className: "p-12 text-center text-gray-400", children: "No apps registered in AppRegistry." }) })) : (apps.map((app) => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 font-mono text-xs font-bold text-indigo-600", children: app.extensionId }), _jsx("td", { className: "px-6 py-4 text-gray-900", children: app.developerId }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-bold ${app.status === "ACTIVE" || app.status === "PUBLISHED" ? "bg-green-100 text-green-700" :
                                                app.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-700"}`, children: app.status }) }), _jsx("td", { className: "px-6 py-4 text-gray-500 text-xs max-w-xs truncate", title: app.manifestUrl, children: app.manifestUrl }), _jsx("td", { className: "px-6 py-4 text-gray-500 text-xs", children: new Date(app.updatedAt).toLocaleDateString() })] }, app.id)))) })] }) }))] }));
}
