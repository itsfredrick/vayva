"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { useParams } from "next/navigation";
import { LOCALES } from "@/data/locales";
import { useUserInteractions } from "@/hooks/useUserInteractions";
import { PaymentMethodModal } from "@/components/account/PaymentMethodModal";
import { CreditCard, Plus, Trash2, } from "lucide-react";
export default function PaymentsPage({ params }) {
    const { lang: rawLang } = useParams();
    const lang = (rawLang === "tr" ? "tr" : "en");
    const t = LOCALES[lang].account.payments;
    const { paymentMethods, addPaymentMethod, removePaymentMethod, setDefaultPaymentMethod, isLoaded, } = useUserInteractions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    if (!isLoaded)
        return null;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-2xl font-bold", children: t.title }), _jsxs(Button, { onClick: () => setIsModalOpen(true), className: "flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors", children: [_jsx(Plus, { size: 16 }), t.add] })] }), paymentMethods.length === 0 ? (_jsxs("div", { className: "bg-white border rounded-2xl p-12 text-center text-gray-400", children: [_jsx(CreditCard, { size: 48, className: "mx-auto mb-4 opacity-50" }), _jsx("p", { children: t.empty })] })) : (_jsx("div", { className: "grid gap-4", children: paymentMethods.map((pm) => (_jsxs("div", { className: `bg-white p-6 rounded-2xl border transition-all ${pm.isDefault ? "border-green-500 shadow-sm ring-1 ring-green-100" : "border-gray-100"}`, children: [_jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-8 bg-gray-100 rounded flex items-center justify-center font-bold text-xs text-gray-500", children: "VISA" }), _jsxs("div", { className: "flex flex-col", children: [_jsxs("span", { className: "font-bold flex items-center gap-2", children: ["\u2022\u2022\u2022\u2022 ", pm.last4, pm.isDefault && (_jsx("span", { className: "text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold", children: t.default }))] }), _jsx("span", { className: "text-xs text-gray-400", children: pm.expiry })] })] }), _jsxs("div", { className: "flex gap-2", children: [!pm.isDefault && (_jsx(Button, { onClick: () => setDefaultPaymentMethod(pm.id), className: "text-xs font-bold text-gray-400 hover:text-black transition-colors", children: t.setDefault })), _jsx(Button, { onClick: () => removePaymentMethod(pm.id), className: "text-gray-400 hover:text-red-500 transition-colors", children: _jsx(Trash2, { size: 16 }) })] })] }), _jsx("div", { className: "text-sm font-medium text-gray-500 uppercase tracking-widest", children: pm.holder })] }, pm.id))) })), _jsx(PaymentMethodModal, { lang: lang, isOpen: isModalOpen, onClose: () => setIsModalOpen(false), onSave: addPaymentMethod })] }));
}
