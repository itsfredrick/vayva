"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { useParams } from "next/navigation";
import { LOCALES } from "@/data/locales";
import { useUserInteractions } from "@/hooks/useUserInteractions";
import { AddressModal } from "@/components/account/AddressModal";
import { MapPin, Plus, Trash2, CheckCircle } from "lucide-react";
export default function AddressesPage({ params }) {
    const { lang: rawLang } = useParams();
    const lang = (rawLang === "tr" ? "tr" : "en");
    const t = LOCALES[lang].account.addresses;
    const { addresses, addAddress, removeAddress, setDefaultAddress, isLoaded } = useUserInteractions();
    const [isNavOpen, setIsNavOpen] = useState(false); // for modal
    if (!isLoaded)
        return null;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold", children: t.title }), _jsxs(Button, { onClick: () => setIsNavOpen(true), className: "flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors", children: [_jsx(Plus, { size: 16 }), t.add] })] }), addresses.length === 0 ? (_jsxs("div", { className: "bg-white border rounded-2xl p-12 text-center text-gray-400", children: [_jsx(MapPin, { size: 48, className: "mx-auto mb-4 opacity-50" }), _jsx("p", { children: t.empty })] })) : (_jsx("div", { className: "grid gap-4", children: addresses.map((addr) => (_jsxs("div", { className: `bg-white p-6 rounded-2xl border transition-all ${addr.isDefault ? "border-green-500 shadow-sm ring-1 ring-green-100" : "border-gray-100"}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-2", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("h3", { className: "font-bold text-lg", children: addr.title }), addr.isDefault && (_jsxs("span", { className: "text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold flex items-center gap-1", children: [_jsx(CheckCircle, { size: 10 }), t.default] }))] }), _jsxs("div", { className: "flex gap-2", children: [!addr.isDefault && (_jsx(Button, { onClick: () => setDefaultAddress(addr.id), className: "text-xs font-bold text-gray-400 hover:text-black transition-colors", children: t.setDefault })), _jsx(Button, { onClick: () => removeAddress(addr.id), className: "text-gray-400 hover:text-red-500 transition-colors", children: _jsx(Trash2, { size: 16 }) })] })] }), _jsxs("p", { className: "text-gray-600 leading-relaxed mb-1", children: [addr.neighborhood, ", ", addr.address] }), _jsxs("p", { className: "text-gray-500 text-sm", children: [addr.city, " / ", addr.district] }), addr.notes && (_jsxs("div", { className: "mt-4 pt-4 border-t border-gray-50 text-sm text-gray-500 italic", children: ["\"", addr.notes, "\""] }))] }, addr.id))) })), _jsx(AddressModal, { lang: lang, isOpen: isNavOpen, onClose: () => setIsNavOpen(false), onSave: addAddress })] }));
}
