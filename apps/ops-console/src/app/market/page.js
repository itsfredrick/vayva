"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
// Assuming Ops Console has a Shell or Layout
// I'll build a standalone page content
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@vayva/ui";
export default function MarketOpsPage() {
    const { toast } = useToast();
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);
    const fetchSellers = () => {
        fetch("/api/market/sellers")
            .then(res => res.json())
            .then(data => {
            if (Array.isArray(data))
                setSellers(data);
        })
            .finally(() => setLoading(false));
    };
    useEffect(() => {
        fetchSellers();
    }, []);
    const handleUpdate = async (storeId, updates) => {
        if (!confirm("Confirm update?"))
            return;
        try {
            const res = await fetch("/api/market/sellers", {
                method: "PUT",
                body: JSON.stringify({ storeId, ...updates })
            });
            if (res.ok) {
                toast({ title: "Success", description: "Store updated successfully." });
                fetchSellers();
            }
            else {
                toast({ title: "Error", description: "Update failed.", variant: "destructive" });
            }
        }
        catch (e) {
            console.error(e);
        }
    };
    return (_jsxs("div", { className: "p-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", children: "Marketplace Operations" }), _jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsxs("table", { className: "w-full text-left", children: [_jsx("thead", { className: "bg-gray-50 border-b", children: _jsxs("tr", { children: [_jsx("th", { className: "p-4", children: "Store" }), _jsx("th", { className: "p-4", children: "Location" }), _jsx("th", { className: "p-4", children: "Tier" }), _jsx("th", { className: "p-4", children: "Verification" }), _jsx("th", { className: "p-4", children: "SLA" }), _jsx("th", { className: "p-4", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y", children: sellers.map(store => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsxs("td", { className: "p-4", children: [_jsx("div", { className: "font-bold", children: store.name }), _jsx("div", { className: "text-xs text-gray-500", children: store.id })] }), _jsx("td", { className: "p-4 text-sm", children: store.StoreProfile?.city || "-" }), _jsx("td", { className: "p-4", children: _jsx("span", { className: `px-2 py-1 rounded text-xs font-bold ${store.tier === 'GOLD' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`, children: store.tier }) }), _jsx("td", { className: "p-4 text-sm", children: store.verificationLevel }), _jsxs("td", { className: "p-4 text-sm", children: [store.slaScore, "/100"] }), _jsxs("td", { className: "p-4 flex gap-2", children: [store.tier !== 'GOLD' && (_jsx(Button, { onClick: () => handleUpdate(store.id, { tier: "GOLD", verificationLevel: "BUSINESS_VERIFIED" }), className: "px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 h-auto", "aria-label": `Verify ${store.name} as Gold`, children: "Verify Gold" })), _jsx(Button, { variant: "outline", onClick: () => handleUpdate(store.id, { slaScore: 100 }), className: "px-3 py-1 text-xs rounded hover:bg-gray-50 h-auto", "aria-label": `Reset SLA score for ${store.name}`, children: "Reset SLA" })] })] }, store.id))) })] }), sellers.length === 0 && !loading && (_jsx("div", { className: "p-8 text-center text-gray-400", children: "No active sellers found." }))] })] }));
}
