"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon } from "@vayva/ui";
export const AddDomainModal = ({ isOpen, onClose, onAdd, isAdding, }) => {
    const [domain, setDomain] = useState("");
    const [error, setError] = useState("");
    if (!isOpen)
        return null;
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        // Basic validation
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(domain)) {
            setError("Please enter a valid domain (e.g., mystore.com)");
            return;
        }
        try {
            await onAdd(domain);
            onClose();
        }
        catch (err) {
            setError(err.message || "Failed to add domain");
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200", children: _jsxs("div", { className: "bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 relative p-8", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "absolute top-4 right-4 rounded-full hover:bg-gray-100 transition-colors h-auto w-auto p-2", children: _jsx(Icon, { name: "X", size: 20 }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-2", children: "Connect Domain" }), _jsx("p", { className: "text-gray-500 mb-6", children: "Enter the domain you want to connect to your store." }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "domain", className: "block text-sm font-medium text-gray-700 mb-1", children: "Domain Name" }), _jsx("input", { type: "text", id: "domain", placeholder: "e.g. mystore.com", className: "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none transition-colors", value: domain, onChange: (e) => setDomain(e.target.value.toLowerCase()) }), error && _jsx("p", { className: "text-red-500 text-sm mt-1", children: error })] }), _jsxs("div", { className: "flex justify-end gap-3 pt-4", children: [_jsx(Button, { type: "button", variant: "ghost", onClick: onClose, disabled: isAdding, children: "Cancel" }), _jsx(Button, { type: "submit", className: "bg-black text-white", isLoading: isAdding, children: "Connect Domain" })] })] })] }) }));
};
