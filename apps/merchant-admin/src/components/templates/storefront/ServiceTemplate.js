"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Icon, Input, cn } from "@vayva/ui";
import { getThemeStyles } from "@/utils/theme-utils";
import { WhatsAppPreviewModal } from "./WhatsAppPreviewModal";
// --- Components ---
const PaymentBadge = ({ rule }) => {
    if (!rule)
        return null;
    const config = {
        pay_to_confirm: {
            label: "Pay to Confirm",
            color: "bg-blue-100 text-blue-700",
        },
        pay_after: { label: "Pay Later", color: "bg-green-100 text-green-700" },
        deposit: {
            label: "Deposit Required",
            color: "bg-purple-100 text-purple-700",
        },
    };
    const c = config[rule];
    if (!c)
        return null;
    return (_jsx("span", { className: cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide", c.color), children: c.label }));
};
const ServiceDetailModal = ({ service, onClose, onBook, }) => {
    if (!service)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsxs("div", { className: "bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl relative z-10 animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] flex flex-col", children: [_jsxs("div", { className: "p-6 pb-0 flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold mb-1", children: service.name }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-500", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Icon, { name: "Clock", size: 14 }), " ", service.duration] }), _jsx(PaymentBadge, { rule: service.paymentRule })] })] }), _jsx(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors h-auto w-auto text-black", children: _jsx(Icon, { name: "X", size: 20 }) })] }), _jsxs("div", { className: "p-6 overflow-y-auto", children: [_jsxs("div", { className: "bg-gray-50 p-4 rounded-xl mb-6", children: [_jsxs("div", { className: "text-3xl font-bold text-blue-600 mb-1", children: ["\u20A6", service.price.toLocaleString()] }), _jsx("p", { className: "text-sm opacity-60", children: "Base price per session" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm mb-2", children: "Description" }), _jsx("p", { className: "text-gray-600 leading-relaxed text-sm", children: service.description })] }), service.included && (_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-sm mb-2", children: "What's Included" }), _jsx("ul", { className: "space-y-2", children: service.included.map((inc, i) => (_jsxs("li", { className: "flex gap-2 text-sm text-gray-600", children: [_jsx(Icon, { name: "Check", size: 16, className: "text-green-500 mt-0.5" }), inc] }, i))) })] })), _jsxs("div", { className: "bg-blue-50 p-4 rounded-xl flex gap-3 text-blue-900 text-sm", children: [_jsx(Icon, { name: "Info", size: 20, className: "shrink-0" }), _jsx("p", { children: "Cancellation Policy: Please cancel at least 24 hours in advance to avoid a fee." })] })] })] }), _jsx("div", { className: "p-4 border-t safe-area-bottom", children: _jsx(Button, { className: "w-full h-12 rounded-xl text-lg font-bold bg-blue-600 hover:bg-blue-700 text-white", onClick: () => onBook(service), children: "Book Appointment" }) })] })] }));
};
const BookingRequestModal = ({ service, onClose, onConfirm, }) => {
    if (!service)
        return null;
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const handleConfirm = () => {
        if (!date || !time)
            return; // Simple validation
        onConfirm(date, time);
    };
    return (_jsxs("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", children: [_jsx("div", { className: "absolute inset-0 bg-black/60 backdrop-blur-sm", onClick: onClose }), _jsxs("div", { className: "bg-white w-full max-w-sm rounded-3xl shadow-2xl relative z-10 p-6 animate-in zoom-in-95 duration-200", children: [_jsxs("div", { className: "text-center mb-6", children: [_jsx("div", { className: "w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3", children: _jsx(Icon, { name: "Calendar", size: 24 }) }), _jsx("h3", { className: "font-bold text-xl", children: "Request Slot" }), _jsxs("p", { className: "text-sm text-gray-500", children: ["for ", service.name] })] }), _jsxs("div", { className: "space-y-4 mb-6", children: [_jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-gray-500 uppercase mb-1 block", children: "Preferred Date" }), _jsx(Input, { type: "date", className: "w-full", onChange: (e) => setDate(e.target.value) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-xs font-bold text-gray-500 uppercase mb-1 block", children: "Preferred Time" }), _jsxs("select", { className: "w-full h-10 rounded-md border border-gray-300 px-3 text-sm bg-white", onChange: (e) => setTime(e.target.value), "aria-label": "Select booking time", children: [_jsx("option", { value: "", children: "Select Time..." }), _jsx("option", { value: "Morning (9AM - 12PM)", children: "Morning (9AM - 12PM)" }), _jsx("option", { value: "Afternoon (12PM - 4PM)", children: "Afternoon (12PM - 4PM)" }), _jsx("option", { value: "Evening (4PM - 8PM)", children: "Evening (4PM - 8PM)" })] })] })] }), _jsxs(Button, { className: "w-full h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2", onClick: handleConfirm, disabled: !date || !time, children: [_jsx(Icon, { name: "MessageCircle", size: 18 }), " Send Request"] }), _jsx(Button, { variant: "ghost", onClick: onClose, className: "w-full py-3 text-sm text-gray-500 mt-2 font-medium h-auto hover:bg-gray-50", children: "Cancel" })] })] }));
};
export function ServiceTemplate({ config }) {
    const theme = getThemeStyles(config.theme);
    const { content } = config;
    const services = (content.services || []);
    const [selectedService, setSelectedService] = useState(null);
    const [isBooking, setIsBooking] = useState(false);
    const [waModal, setWaModal] = useState({ open: false, message: "" });
    const handleInitialBook = (s) => {
        setSelectedService(s);
    };
    const handleProceedToBooking = (s) => {
        // Close detail, open booking input
        // Actually detail modal stays open? No, easier to switch context.
        setIsBooking(true);
    };
    const handleFinalizeBooking = (date, time) => {
        if (!selectedService)
            return;
        const msg = `Hello, I'd like to book *${selectedService.name}*.\n\n📅 Date: ${date}\n⏰ Time: ${time}\n\nPlease confirm availability.`;
        setWaModal({ open: true, message: msg });
        setIsBooking(false);
        setSelectedService(null);
    };
    return (_jsxs("div", { className: cn("min-h-[800px] flex flex-col transition-colors duration-300 relative bg-gray-50", theme.text, theme.font), children: [_jsx("div", { className: "bg-blue-600 text-white text-[10px] uppercase font-bold text-center py-2 tracking-widest sticky top-0 z-50", children: "Preview mode \u2014 bookings are simulated." }), _jsxs("header", { className: "px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-[30px] z-40 border-b", children: [_jsxs("div", { className: "font-bold text-xl tracking-tight", children: ["STUDIO", _jsx("span", { className: "text-blue-600", children: "." })] }), _jsx(Button, { size: "sm", className: "rounded-full bg-black text-white px-5 font-bold hover:bg-gray-800", onClick: () => {
                            const first = services[0];
                            if (first)
                                setSelectedService(first);
                        }, children: "Book Now" })] }), _jsx("section", { className: "px-6 py-12 text-center bg-white border-b", children: _jsxs("div", { className: "max-w-xl mx-auto", children: [_jsx("h1", { className: "text-4xl font-extrabold mb-4 leading-tight text-gray-900", children: content.headline }), _jsx("p", { className: "text-lg text-gray-500 mb-8", children: content.subtext }), _jsxs("div", { className: "flex justify-center gap-8 text-sm font-medium text-gray-400", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Icon, { name: "Check", size: 14, className: "text-blue-500" }), " WhatsApp Booking"] }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Icon, { name: "Check", size: 14, className: "text-blue-500" }), " Secure Payments"] })] })] }) }), _jsxs("section", { className: "p-6 max-w-2xl mx-auto w-full pb-24", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "font-bold text-lg", children: "Services Menu" }), _jsxs("span", { className: "text-xs bg-gray-200 px-2 py-1 rounded-md font-bold text-gray-600", children: [services.length, " Items"] })] }), _jsx("div", { className: "grid gap-4", children: services.map((s) => (_jsxs("div", { className: "bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group", onClick: () => setSelectedService(s), children: [_jsxs("div", { className: "flex justify-between items-start mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "font-bold text-lg group-hover:text-blue-600 transition-colors", children: s.name }), _jsxs("div", { className: "flex items-center gap-3 text-xs text-gray-500 mt-1", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Icon, { name: "Clock", size: 12 }), " ", s.duration] }), s.paymentRule && (_jsx("span", { className: "w-1 h-1 bg-gray-300 rounded-full" })), _jsx("span", { className: "capitalize", children: s.paymentRule?.replace(/_/g, " ") })] })] }), _jsx("div", { className: "text-right", children: _jsxs("div", { className: "font-bold text-lg", children: ["\u20A6", s.price.toLocaleString()] }) })] }), _jsx("p", { className: "text-sm text-gray-500 line-clamp-2 mt-2", children: s.description }), _jsxs("div", { className: "mt-4 pt-4 border-t border-dashed flex justify-between items-center", children: [_jsx("span", { className: "text-xs font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity", children: "View Details" }), _jsx("div", { className: "w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 transition-colors", children: _jsx(Icon, { name: "ArrowRight", size: 16 }) })] })] }, s.id))) })] }), _jsx(ServiceDetailModal, { service: selectedService, onClose: () => setSelectedService(null), onBook: handleProceedToBooking }), isBooking && selectedService && (_jsx(BookingRequestModal, { service: selectedService, onClose: () => setIsBooking(false), onConfirm: handleFinalizeBooking })), _jsx(WhatsAppPreviewModal, { isOpen: waModal.open, onClose: () => setWaModal({ ...waModal, open: false }), message: waModal.message }), _jsx("footer", { className: "py-8 text-center text-xs text-gray-400 border-t bg-white", children: _jsx("p", { children: "\u00A9 2024 Studio Services. Powered by Vayva." }) })] }));
}
