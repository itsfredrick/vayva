"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Icon, Button, cn } from "@vayva/ui";
import { motion, AnimatePresence } from "framer-motion";
export default function ApprovalsPage() {
    const [activeTab, setActiveTab] = useState("pending");
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    // Decide Reason Input
    const [decisionReason, setDecisionReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const fetchItems = async () => {
        setLoading(true);
        // status=pending or status=all depending on tab.
        // If pending tab, fetch pending. If history, fetch approved/rejected/filtered?
        // We'll simplistic "all" and filter client side or 2 requests.
        const status = activeTab === "pending" ? "pending" : "all";
        try {
            const res = await fetch(`/api/merchant/approvals?status=${status}&limit=50`);
            const data = await res.json();
            setItems(data.items || []);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchItems();
    }, [activeTab]);
    const handleDecision = async (decision) => {
        if (!selectedItem)
            return;
        setActionLoading(true);
        try {
            const res = await fetch(`/api/merchant/approvals/${selectedItem.id}/${decision}`, {
                method: "POST",
                body: JSON.stringify({ decisionReason }),
            });
            if (!res.ok) {
                const txt = await res.text();
                alert("Failed: " + txt);
                return;
            }
            // Success
            setSelectedItem(null);
            setDecisionReason("");
            fetchItems();
        }
        catch (err) {
            console.error(err);
            alert("Error");
        }
        finally {
            setActionLoading(false);
        }
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-black", children: "Approvals Queue" }), _jsx("p", { className: "text-gray-500", children: "Review and authorize sensitive actions" })] }), _jsxs("div", { className: "flex border-b border-gray-100", children: [_jsx(Button, { variant: "ghost", onClick: () => setActiveTab("pending"), className: cn("px-4 py-2 text-sm font-medium border-b-2 rounded-none transition-colors h-auto hover:bg-transparent", activeTab === "pending" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black hover:border-gray-200"), children: "Pending Reviews" }), _jsx(Button, { variant: "ghost", onClick: () => setActiveTab("history"), className: cn("px-4 py-2 text-sm font-medium border-b-2 rounded-none transition-colors h-auto hover:bg-transparent", activeTab === "history" ? "border-black text-black" : "border-transparent text-gray-400 hover:text-black hover:border-gray-200"), children: "History" })] }), _jsxs("div", { className: "space-y-3", children: [loading && (_jsx("div", { className: "text-center py-10 text-gray-400", children: "Loading..." })), !loading && items.length === 0 && (_jsx("div", { className: "text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200", children: _jsxs("p", { className: "text-gray-400 font-medium", children: ["No ", activeTab, " approvals found."] }) })), !loading &&
                        items.map((item) => (_jsxs(motion.div, { layoutId: item.id, onClick: () => setSelectedItem(item), className: "bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: `w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.status === "pending"
                                                ? "bg-blue-50 text-blue-600"
                                                : item.status === "approved" || item.status === "executed"
                                                    ? "bg-green-50 text-green-600"
                                                    : "bg-red-50 text-red-600"}`, children: [item.status === "pending" && (_jsx(Icon, { name: "Clock", size: 20 })), (item.status === "approved" ||
                                                    item.status === "executed") && (_jsx(Icon, { name: "CheckCircle", size: 20 })), (item.status === "rejected" || item.status === "failed") && (_jsx(Icon, { name: "XCircle", size: 20 }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "font-bold text-sm text-black capitalize", children: item.actionType.replace(".", " ") }), item.entityType && (_jsx("span", { className: "px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded uppercase font-medium", children: item.entityType }))] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Requested by", " ", _jsx("span", { className: "text-black font-medium", children: item.requestedByLabel }), " ", "\u2022 ", new Date(item.createdAt).toLocaleDateString()] })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [item.status === "pending" && (_jsx("div", { className: "px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full", children: "Pending" })), activeTab === "history" && (_jsx("span", { className: `text-xs font-bold uppercase ${item.status === "executed"
                                                ? "text-green-600"
                                                : item.status === "failed"
                                                    ? "text-red-600"
                                                    : item.status === "rejected"
                                                        ? "text-gray-500"
                                                        : "text-gray-400"}`, children: item.status })), _jsx(Icon, { name: "ChevronRight", size: 16, className: "text-gray-300 group-hover:text-black transition-colors" })] })] }, item.id)))] }), _jsx(AnimatePresence, { children: selectedItem && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 0.5 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black z-40", onClick: () => setSelectedItem(null) }, "backdrop"), _jsxs(motion.div, { initial: { x: "100%" }, animate: { x: 0 }, exit: { x: "100%" }, transition: { type: "spring", damping: 25, stiffness: 200 }, className: "fixed right-0 top-0 h-screen w-[480px] bg-white z-50 shadow-2xl flex flex-col", children: [_jsxs("div", { className: "p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold", children: "Request Details" }), _jsx("p", { className: "text-xs text-gray-400 font-mono mt-1", children: selectedItem.id })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setSelectedItem(null), className: "rounded-full hover:bg-gray-200", children: _jsx(Icon, { name: "X", size: 20 }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-6 space-y-6", children: [selectedItem.reason && (_jsxs("div", { className: "p-4 bg-yellow-50 border border-yellow-100 rounded-lg", children: [_jsx("p", { className: "text-xs font-bold text-yellow-800 uppercase mb-1", children: "Requester Note" }), _jsx("p", { className: "text-sm text-yellow-900", children: selectedItem.reason })] })), _jsxs("div", { children: [_jsx("p", { className: "text-xs font-bold text-gray-400 uppercase mb-2", children: "Payload Data" }), _jsx("div", { className: "bg-gray-900 text-gray-300 p-4 rounded-lg overflow-x-auto text-xs font-mono", children: _jsx("pre", { children: JSON.stringify(selectedItem.payload, null, 2) }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-[10px] uppercase text-gray-400 font-bold", children: "Requested By" }), _jsx("p", { className: "text-sm font-medium", children: selectedItem.requestedByLabel })] }), _jsxs("div", { className: "p-3 bg-gray-50 rounded-lg", children: [_jsx("p", { className: "text-[10px] uppercase text-gray-400 font-bold", children: "Date" }), _jsx("p", { className: "text-sm font-medium", children: new Date(selectedItem.createdAt).toLocaleString() })] })] }), selectedItem.status !== "pending" && (_jsxs("div", { className: "border-t border-gray-100 pt-4", children: [_jsx("p", { className: "text-xs font-bold text-gray-400 uppercase mb-2", children: "Decision" }), _jsxs("div", { className: "p-3 bg-gray-50 rounded-lg border border-gray-100", children: [_jsxs("div", { className: "flex justify-between mb-1", children: [_jsx("span", { className: "text-sm font-bold capitalize", children: selectedItem.status }), _jsxs("span", { className: "text-xs text-gray-500", children: ["by ", selectedItem.decidedByLabel || "System"] })] }), selectedItem.decisionReason && (_jsxs("p", { className: "text-sm text-gray-600 mt-2 italic", children: ["\"", selectedItem.decisionReason, "\""] }))] })] }))] }), selectedItem.status === "pending" && (_jsxs("div", { className: "p-6 border-t border-gray-100 bg-gray-50 flex flex-col gap-4", children: [_jsx("textarea", { placeholder: "Add a note (optional)...", className: "w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-black/5 outline-none resize-none h-20", value: decisionReason, onChange: (e) => setDecisionReason(e.target.value) }), _jsxs("div", { className: "flex gap-3", children: [_jsx(Button, { onClick: () => handleDecision("reject"), disabled: actionLoading, variant: "outline", className: "flex-1 py-6 border-gray-200 bg-white text-red-600 font-bold rounded-lg hover:bg-red-50 hover:text-red-700 hover:border-red-100", children: "Reject" }), _jsx(Button, { onClick: () => handleDecision("approve"), disabled: actionLoading, className: "flex-1 py-6 bg-black text-white font-bold rounded-lg hover:bg-gray-800", children: actionLoading ? "Processing..." : "Approve & Execute" })] })] }))] }, "drawer")] })) })] }));
}
