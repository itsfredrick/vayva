"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Icon, Button } from "@vayva/ui";
export function StoreSwitcher() {
    const [stores, setStores] = useState([]);
    const [activeStore, setActiveStore] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    // Create Form
    const [newName, setNewName] = useState("");
    const [newSlug, setNewSlug] = useState("");
    const [creating, setCreating] = useState(false);
    useEffect(() => {
        // Fetch User Stores
        fetch("/api/merchant/stores")
            .then((res) => res.json())
            .then((data) => {
            setStores(data.stores);
            // Try to find active from cookie or default to first
            // In a real app, logic usually parses cookie or receives prop
            // Here we just default to first for UI demo
            if (data.stores.length > 0)
                setActiveStore(data.stores[0]);
        });
    }, []);
    const handleSwitch = async (store) => {
        // Call switch API
        await fetch("/api/merchant/session/switch", {
            method: "POST",
            body: JSON.stringify({ storeId: store.id }),
        });
        setActiveStore(store);
        setIsOpen(false);
        window.location.reload(); // Reload to refresh data context
    };
    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            const res = await fetch("/api/merchant/stores", {
                method: "POST",
                body: JSON.stringify({
                    name: newName,
                    slug: newSlug,
                    category: "general",
                }),
            });
            if (res.ok) {
                const data = await res.json();
                setStores([...stores, data.store]);
                handleSwitch(data.store); // Switch to new immediately
            }
            else {
                alert("Failed to create store");
            }
        }
        finally {
            setCreating(false);
            setShowCreate(false);
        }
    };
    if (!activeStore)
        return null;
    return (_jsxs("div", { className: "relative", children: [_jsxs(Button, { onClick: () => setIsOpen(!isOpen), variant: "ghost", className: "flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors text-sm font-bold text-gray-700", children: [_jsx("div", { className: "w-6 h-6 bg-black rounded flex items-center justify-center text-white text-xs", children: activeStore.name.substring(0, 1) }), _jsx("span", { className: "max-w-[120px] truncate", children: activeStore.name }), _jsx(Icon, { name: "ChevronDown", size: 12, className: "text-gray-400" })] }), isOpen && (_jsxs("div", { className: "absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg p-2 z-50", children: [_jsx("div", { className: "text-xs font-bold text-gray-400 px-2 py-1 uppercase tracking-wider mb-1", children: "Switch Store" }), stores.map((s) => (_jsxs(Button, { onClick: () => handleSwitch(s), variant: "ghost", className: `w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${s.id === activeStore.id
                            ? "bg-gray-50 font-bold text-black"
                            : "text-gray-500 hover:bg-gray-50"}`, children: [_jsx("span", { className: `w-2 h-2 rounded-full ${s.id === activeStore.id ? "bg-green-500" : "bg-gray-300"}` }), s.name] }, s.id))), _jsx("div", { className: "h-px bg-gray-100 my-2" }), _jsxs(Button, { onClick: () => setShowCreate(true), variant: "ghost", className: "w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50 flex items-center gap-2", children: [_jsx(Icon, { name: "Plus", size: 14 }), " Create New Store"] })] })), showCreate && (_jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-[100]", children: _jsxs("form", { onSubmit: handleCreate, className: "bg-white p-6 rounded-xl w-full max-w-sm", children: [_jsx("h3", { className: "font-bold text-lg mb-4", children: "Create New Branch" }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1", children: "Store Name" }), _jsx("input", { required: true, value: newName, onChange: (e) => setNewName(e.target.value), className: "w-full border p-2 rounded", placeholder: "My New Store" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-500 uppercase mb-1", children: "URL Slug" }), _jsxs("div", { className: "flex items-center border rounded overflow-hidden", children: [_jsx("span", { className: "bg-gray-50 px-3 py-2 text-gray-500 text-sm", children: "vayva.ng/" }), _jsx("input", { required: true, value: newSlug, onChange: (e) => setNewSlug(e.target.value), className: "flex-1 p-2 outline-none", placeholder: "new-store" })] })] })] }), _jsxs("div", { className: "flex justify-end gap-2", children: [_jsx(Button, { type: "button", onClick: () => setShowCreate(false), variant: "ghost", className: "px-4 py-2 text-gray-500 font-bold", children: "Cancel" }), _jsx(Button, { type: "submit", disabled: creating, variant: "primary", className: "bg-black text-white px-4 py-2 rounded-lg font-bold", children: creating ? "Creating..." : "Create Store" })] })] }) }))] }));
}
