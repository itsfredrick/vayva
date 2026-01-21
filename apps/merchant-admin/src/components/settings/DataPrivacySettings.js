"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon, cn } from "@vayva/ui";
export function DataPrivacySettings() {
    const [exports, setExports] = useState([]);
    const [isRequesting, setIsRequesting] = useState(false);
    const [selectedScopes, setSelectedScopes] = useState([
        "CATALOG",
        "ORDERS",
    ]);
    const scopesList = [
        { id: "CATALOG", label: "Product Catalog", icon: "Package" },
        { id: "ORDERS", label: "Sales & Orders", icon: "ShoppingBag" },
        {
            id: "CONVERSATIONS",
            label: "Chat History (Redacted)",
            icon: "MessageCircle",
        },
        { id: "AI_USAGE", label: "AI Usage Logs", icon: "Cpu" },
    ];
    const toggleScope = (id) => {
        if (selectedScopes.includes(id)) {
            setSelectedScopes(selectedScopes.filter((s) => s !== id));
        }
        else {
            setSelectedScopes([...selectedScopes, id]);
        }
    };
    const handleRequestExport = async () => {
        setIsRequesting(true);
        // await fetch('/api/seller/data/export', { method: 'POST', body: JSON.stringify({ scopes: selectedScopes }) });
        // Test success
        setTimeout(() => setIsRequesting(false), 1500);
    };
    return (_jsxs("div", { className: "space-y-12 pb-24", children: [_jsxs("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden", children: [_jsxs("div", { className: "p-8 border-b border-gray-50", children: [_jsx("h3", { className: "text-lg font-bold text-black", children: "Export Your Data" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Download a portable archive of your business data in JSON and CSV formats." })] }), _jsxs("div", { className: "p-8 space-y-8", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: scopesList.map((scope) => (_jsxs(Button, { onClick: () => toggleScope(scope.id), className: cn("flex items-center gap-4 p-4 rounded-xl border text-left transition-all", selectedScopes.includes(scope.id)
                                        ? "border-black bg-gray-50 ring-1 ring-black"
                                        : "border-gray-100 hover:border-gray-200"), children: [_jsx("div", { className: cn("w-10 h-10 rounded-lg flex items-center justify-center", selectedScopes.includes(scope.id)
                                                ? "bg-black text-white"
                                                : "bg-gray-100 text-gray-400"), children: _jsx(Icon, { name: scope.icon, size: 20 }) }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-bold text-black", children: scope.label }), _jsx("p", { className: "text-[10px] text-gray-400", children: "Portable JSON/CSV" })] }), selectedScopes.includes(scope.id) && (_jsx(Icon, { name: "Check", size: 16, className: "text-black" }))] }, scope.id))) }), _jsxs("div", { className: "flex items-center justify-between pt-4", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs text-gray-400", children: [_jsx(Icon, { name: "ShieldCheck", size: 14 }), _jsx("span", { children: "Exports are tenant-isolated and encrypted at rest." })] }), _jsx(Button, { className: "bg-[#0B0B0B] text-white px-8 py-2 rounded-full font-bold", onClick: handleRequestExport, isLoading: isRequesting, disabled: selectedScopes.length === 0, children: "Generate Export" })] })] }), _jsxs("div", { className: "bg-gray-50 p-6 border-t border-gray-100", children: [_jsx("h4", { className: "text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4", children: "Export History" }), _jsx("div", { className: "space-y-3", children: exports.length === 0 ? (_jsx("div", { className: "text-center py-4 bg-white rounded-xl border border-dashed border-gray-200", children: _jsx("p", { className: "text-xs text-gray-400", children: "No active or past exports found." }) })) : (exports.map((exp) => (_jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center", children: _jsx(Icon, { name: "Download", size: 14 }) }), _jsxs("div", { children: [_jsxs("p", { className: "text-xs font-bold text-black", children: ["Data Archive (", exp.scopes.join(", "), ")"] }), _jsx("p", { className: "text-[10px] text-gray-400", children: exp.createdAt })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500 uppercase", children: exp.status }), exp.status === "COMPLETED" && (_jsx(Button, { size: "sm", variant: "outline", className: "h-8 text-[10px] font-bold", children: "Download" }))] })] }, exp.id)))) })] })] }), _jsx("div", { className: "bg-white rounded-2xl border border-gray-100 shadow-sm p-8 flex items-start justify-between", children: _jsxs("div", { className: "flex gap-6", children: [_jsx("div", { className: "w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center", children: _jsx(Icon, { name: "Clock", size: 24 }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-black", children: "Data Retention Status" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Your account is active. Audit logs are kept for 365 days per legal compliance." }), _jsxs("div", { className: "mt-4 flex gap-8", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "Conversations" }), _jsx("p", { className: "text-sm font-bold text-black", children: "180 Days" })] }), _jsxs("div", { children: [_jsx("p", { className: "text-[10px] font-bold text-gray-400 uppercase", children: "AI Traces" }), _jsx("p", { className: "text-sm font-bold text-black", children: "30 Days" })] })] })] })] }) }), _jsx("div", { className: "bg-red-50 rounded-2xl border border-red-100 shadow-sm p-8", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-red-900", children: "Danger Zone" }), _jsx("p", { className: "text-sm text-red-700 mt-1", children: "Requesting account deletion is permanent and cannot be undone after the 30-day grace period." }), _jsxs("ul", { className: "mt-4 space-y-2", children: [_jsxs("li", { className: "text-xs text-red-600 flex items-center gap-2", children: [_jsx("div", { className: "w-1 h-1 bg-red-400 rounded-full" }), "AI Assistant will be disabled immediately."] }), _jsxs("li", { className: "text-xs text-red-600 flex items-center gap-2", children: [_jsx("div", { className: "w-1 h-1 bg-red-400 rounded-full" }), "Storefront will be soft-closed."] })] })] }), _jsx(Button, { variant: "outline", className: "border-red-200 text-red-600 hover:bg-red-100 font-bold px-6", children: "Request Account Deletion" })] }) })] }));
}
