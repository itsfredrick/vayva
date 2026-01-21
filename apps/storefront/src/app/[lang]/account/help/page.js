"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button } from "@vayva/ui";
import { useParams } from "next/navigation";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { LOCALES } from "@/data/locales";
export default function HelpPage({ params }) {
    const { lang: rawLang } = useParams();
    const lang = (rawLang === "tr" ? "tr" : "en");
    const t = LOCALES[lang].account.help;
    const faqs = [
        {
            q: lang === "tr"
                ? "Teslimat saatlerini değiştirebilir miyim?"
                : "Can I change my delivery times?",
            a: lang === "tr"
                ? "Evet, siparişiniz yola çıkmadan önce müşteri hizmetlerimizi arayarak değişiklik yapabilirsiniz."
                : "Yes, you can change it by calling support before your order is dispatched.",
        },
        {
            q: lang === "tr"
                ? "Menü içeriğini nasıl görebilirim?"
                : "How can I see the menu ingredients?",
            a: lang === "tr"
                ? "Haftalık menü sayfasında her yemeğin üzerine tıklayarak detaylı içerik ve alerjen bilgilerine ulaşabilirsiniz."
                : "You can click on any meal in the weekly menu page to see details and allergens.",
        },
        {
            q: lang === "tr"
                ? "Aboneliğimi nasıl iptal ederim?"
                : "How do I cancel my subscription?",
            a: lang === "tr"
                ? "Hesabım sayfasından plan detaylarına giderek aboneliğinizi dondurabilir veya iptal edebilirsiniz."
                : "You can freeze or cancel your subscription from the plan details in your account page.",
        },
    ];
    const [openIndex, setOpenIndex] = useState(0);
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold mb-2", children: t.title }), _jsx("p", { className: "text-gray-500", children: t.subtitle })] }), _jsx("div", { className: "bg-white rounded-2xl border border-gray-100 overflow-hidden", children: faqs.map((faq, idx) => (_jsxs("div", { className: "border-b border-gray-100 last:border-0", children: [_jsxs(Button, { onClick: () => setOpenIndex(openIndex === idx ? null : idx), className: "w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors", children: [_jsx("span", { className: "font-bold", children: faq.q }), _jsx(ChevronDown, { className: `transition-transform duration-300 ${openIndex === idx ? "rotate-180" : ""}`, size: 20 })] }), openIndex === idx && (_jsx("div", { className: "px-6 pb-6 text-gray-500 leading-relaxed animate-fade-in", children: faq.a }))] }, idx))) }), _jsxs("div", { className: "bg-black text-white rounded-2xl p-8", children: [_jsx("h2", { className: "text-xl font-bold mb-6", children: t.contact }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-white/10 rounded-full flex items-center justify-center", children: _jsx(Phone, { size: 24 }) }), _jsxs("div", { children: [_jsx("div", { className: "opacity-60 text-sm mb-1", children: "Phone" }), _jsx("div", { className: "font-bold text-xl", children: t.phone })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-12 h-12 bg-white/10 rounded-full flex items-center justify-center", children: _jsx(Mail, { size: 24 }) }), _jsxs("div", { children: [_jsx("div", { className: "opacity-60 text-sm mb-1", children: "Email" }), _jsx("div", { className: "font-bold text-xl", children: t.email })] })] })] }), _jsx("div", { className: "mt-8 pt-8 border-t border-white/10 text-sm opacity-60", children: t.contactDesc })] })] }));
}
