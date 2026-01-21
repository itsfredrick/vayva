"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { MarketShell } from "@/components/market/market-shell";
import { Button, Input } from "@vayva/ui";
export default function ProfilePage() {
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({ street: "", city: "Lagos", phone: "" });
    const [showAdd, setShowAdd] = useState(false);
    useEffect(() => {
        fetch("/api/market/account/addresses")
            .then(res => res.json())
            .then(data => { if (Array.isArray(data))
            setAddresses(data); });
    }, []);
    const handleSave = async () => {
        await fetch("/api/market/account/addresses", {
            method: "POST",
            body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 })
        });
        setShowAdd(false);
        // Refresh
        const res = await fetch("/api/market/account/addresses");
        setAddresses(await res.json());
    };
    return (_jsx(MarketShell, { children: _jsxs("div", { className: "max-w-4xl mx-auto px-4 py-8", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-6", children: "Profile & Settings" }), _jsxs("div", { className: "grid md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "bg-white/5 border border-white/10 p-6 rounded-xl h-fit", children: [_jsx("h3", { className: "text-lg font-bold text-white mb-4", children: "Personal Details" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-400", children: "Full Name" }), _jsx(Input, { defaultValue: "Fred Rick", className: "bg-black/50 border-white/10 text-white" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-400", children: "Email" }), _jsx(Input, { defaultValue: "fred@123.design", disabled: true, className: "bg-black/50 border-white/10 text-gray-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs text-gray-400", children: "Phone" }), _jsx(Input, { defaultValue: "08012345678", className: "bg-black/50 border-white/10 text-white" })] }), _jsx(Button, { className: "w-full", children: "Update Profile" })] })] }), _jsxs("div", { className: "bg-white/5 border border-white/10 p-6 rounded-xl", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-bold text-white", children: "Saved Addresses" }), _jsx(Button, { size: "sm", variant: "outline", onClick: () => setShowAdd(!showAdd), children: showAdd ? "Cancel" : "Add New" })] }), showAdd && (_jsxs("div", { className: "bg-black/30 p-4 rounded mb-4 space-y-3 border border-white/10", children: [_jsx(Input, { placeholder: "Street Address", value: newAddress.street, onChange: e => setNewAddress({ ...newAddress, street: e.target.value }), className: "bg-black/50 border-white/10 text-white" }), _jsx(Input, { placeholder: "Phone for Delivery", value: newAddress.phone, onChange: e => setNewAddress({ ...newAddress, phone: e.target.value }), className: "bg-black/50 border-white/10 text-white" }), _jsx(Button, { onClick: handleSave, className: "w-full", children: "Save Address" })] })), _jsxs("div", { className: "space-y-3", children: [addresses.map(addr => (_jsxs("div", { className: "p-3 border border-white/10 rounded flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("div", { className: "text-white text-sm font-bold", children: addr.street }), _jsxs("div", { className: "text-gray-400 text-xs", children: [addr.city, ", ", addr.state, " \u2022 ", addr.phone] })] }), addr.isDefault && _jsx("span", { className: "text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded", children: "Default" })] }, addr.id))), addresses.length === 0 && !showAdd && (_jsx("div", { className: "text-gray-500 text-sm text-center py-4", children: "No addresses saved." }))] })] })] })] }) }));
}
