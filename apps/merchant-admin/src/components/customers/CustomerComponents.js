"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
// --- Orders Table ---
export const CustomerOrdersTable = ({ orders, }) => {
    const router = useRouter();
    return (_jsx("div", { className: "bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden", children: _jsxs("table", { className: "w-full text-left text-sm", children: [_jsx("thead", { className: "bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-medium", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-4", children: "Order" }), _jsx("th", { className: "px-6 py-4", children: "Date" }), _jsx("th", { className: "px-6 py-4", children: "Status" }), _jsx("th", { className: "px-6 py-4 text-right", children: "Total" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-50", children: orders.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "p-6 text-center text-gray-400", children: "No orders found." }) })) : (orders.map((order) => (_jsxs("tr", { className: "cursor-pointer hover:bg-gray-50 transition-colors", onClick: () => router.push(`/admin/orders/${order.id}`), children: [_jsxs("td", { className: "px-6 py-4 font-bold text-black", children: [order.orderNumber, _jsxs("span", { className: "text-xs font-normal text-gray-400 ml-2", children: ["(", order.itemsCount, " items)"] })] }), _jsx("td", { className: "px-6 py-4 text-[#525252]", children: new Date(order.date).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4", children: _jsx("span", { className: "bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase", children: order.status }) }), _jsxs("td", { className: "px-6 py-4 text-right font-bold text-black", children: ["\u20A6 ", order.total.toLocaleString()] })] }, order.id)))) })] }) }));
};
export const NotesSection = ({ notes, onAddNote }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNote, setNewNote] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async () => {
        if (!newNote.trim())
            return;
        setLoading(true);
        await onAddNote(newNote);
        setLoading(false);
        setNewNote("");
        setIsModalOpen(false);
    };
    return (_jsxs("div", { className: "flex flex-col gap-4", children: [_jsx("div", { className: "flex justify-end", children: _jsxs(Button, { onClick: () => setIsModalOpen(true), size: "sm", children: [_jsx(Icon, { name: "Plus", size: 14, className: "mr-2" }), " Add Note"] }) }), _jsx("div", { className: "flex flex-col gap-4", children: notes.length === 0 ? (_jsx("div", { className: "p-8 text-center text-gray-400 bg-gray-50 rounded-xl border border-gray-100 border-dashed", children: "No notes yet. Add one to keep track of this customer." })) : (notes.map((note) => (_jsxs("div", { className: "bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl flex flex-col gap-2", children: [_jsx("p", { className: "text-sm text-black whitespace-pre-wrap", children: note.content }), _jsxs("div", { className: "flex justify-between items-center text-xs text-gray-400 mt-2", children: [_jsx("span", { children: new Date(note.date).toLocaleString() }), _jsx("span", { className: "font-medium text-yellow-700", children: note.author })] })] }, note.id)))) }), _jsx(AnimatePresence, { children: isModalOpen && (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm", onClick: (e) => e.target === e.currentTarget && setIsModalOpen(false), children: _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden", children: [_jsxs("div", { className: "p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50", children: [_jsx("h3", { className: "font-bold text-black", children: "Add Note" }), _jsx(Button, { variant: "ghost", size: "icon", onClick: () => setIsModalOpen(false), className: "h-6 w-6", children: _jsx(Icon, { name: "X", size: 18 }) })] }), _jsxs("div", { className: "p-6 flex flex-col gap-4", children: [_jsx("textarea", { className: "w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 outline-none resize-none", placeholder: "Enter note details...", value: newNote, onChange: (e) => setNewNote(e.target.value), autoFocus: true }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { variant: "ghost", onClick: () => setIsModalOpen(false), children: "Cancel" }), _jsx(Button, { onClick: handleSubmit, disabled: loading || !newNote.trim(), children: loading ? "Saving..." : "Save Note" })] })] })] }, "modal") })) })] }));
};
