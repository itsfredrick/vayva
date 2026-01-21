"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Badge, Button, Card, Icon } from "@vayva/ui";
export const InventoryHistory = ({ productId }) => {
    const [movements, setMovements] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchHistory();
    }, [productId]);
    const fetchHistory = async () => {
        try {
            const res = await fetch(`/api/products/${productId}/inventory/history`);
            if (res.ok) {
                setMovements(await res.json());
            }
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading)
        return _jsx("div", { className: "text-center p-4 text-gray-500", children: "Loading history..." });
    return (_jsxs(Card, { className: "p-0 overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50", children: [_jsx("h3", { className: "font-bold text-sm uppercase tracking-wider text-gray-700", children: "Stock History" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: fetchHistory, children: _jsx(Icon, { name: "RefreshCcw", size: 14 }) })] }), movements.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-400 text-sm", children: "No stock movements recorded." })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm text-left", children: [_jsx("thead", { className: "bg-gray-50 text-gray-500 font-medium border-b border-gray-100", children: _jsxs("tr", { children: [_jsx("th", { className: "p-3 pl-4", children: "Date" }), _jsx("th", { className: "p-3", children: "Variant" }), _jsx("th", { className: "p-3", children: "Type" }), _jsx("th", { className: "p-3 text-right", children: "Change" }), _jsx("th", { className: "p-3", children: "Reason" }), _jsx("th", { className: "p-3", children: "User" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-100", children: movements.map((move) => (_jsxs("tr", { className: "hover:bg-gray-50/50", children: [_jsx("td", { className: "p-3 pl-4 text-gray-600", children: format(new Date(move.createdAt), "MMM d, HH:mm") }), _jsx("td", { className: "p-3 font-medium text-gray-900", children: move.variantName }), _jsx("td", { className: "p-3", children: _jsx(Badge, { variant: move.quantity > 0 ? "success" : "default", children: move.type }) }), _jsxs("td", { className: `p-3 text-right font-mono ${move.quantity > 0 ? 'text-green-600' : 'text-red-600'}`, children: [move.quantity > 0 ? "+" : "", move.quantity] }), _jsx("td", { className: "p-3 text-gray-500 max-w-[200px] truncate", children: move.reason || "-" }), _jsx("td", { className: "p-3 text-gray-500 text-xs", children: move.performedBy || "System" })] }, move.id))) })] }) }))] }));
};
