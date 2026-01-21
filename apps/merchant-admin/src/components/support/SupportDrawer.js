"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, Drawer, Icon } from "@vayva/ui";
export const SupportDrawer = ({ isOpen, onClose, initialContext, }) => {
    const [view, setView] = useState("home");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setView("self_resolution");
    };
    const renderContent = () => {
        switch (view) {
            case "home":
                return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-4 bg-gray-50 rounded-lg", children: [_jsx("h3", { className: "font-bold text-gray-900 mb-2", children: "How can we help?" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsx(CategoryButton, { icon: "CreditCard", label: "Payments", onClick: () => handleCategorySelect("payment") }), _jsx(CategoryButton, { icon: "Package", label: "Orders", onClick: () => handleCategorySelect("order") }), _jsx(CategoryButton, { icon: "Wallet", label: "Wallet", onClick: () => handleCategorySelect("wallet") }), _jsx(CategoryButton, { icon: "UserCheck", label: "KYC", onClick: () => handleCategorySelect("kyc") }), _jsx(CategoryButton, { icon: "Globe", label: "Domain", onClick: () => handleCategorySelect("domain") }), _jsx(CategoryButton, { icon: "MoreHorizontal", label: "Other", onClick: () => handleCategorySelect("other") })] })] }), _jsx("div", { className: "border-t pt-4", children: _jsxs(Button, { variant: "outline", className: "w-full justify-between", onClick: () => setView("ticket_list"), children: [_jsx("span", { children: "My Tickets" }), _jsx(Icon, { name: "ChevronRight", size: 16 })] }) })] }));
            case "self_resolution":
                return (_jsxs("div", { children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setView("home"), className: "mb-4", children: [_jsx(Icon, { name: "ArrowLeft", size: 16, className: "mr-2" }), " Back"] }), _jsxs("div", { className: "p-4 text-center", children: [_jsxs("p", { className: "text-gray-500", children: ["Self Resolution Flow Placeholder for ", selectedCategory] }), _jsx(Button, { className: "mt-4", onClick: () => setView("ticket_form"), children: "Contact Support" })] })] }));
            case "ticket_form":
                return (_jsxs("div", { children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setView("self_resolution"), className: "mb-4", children: [_jsx(Icon, { name: "ArrowLeft", size: 16, className: "mr-2" }), " Back"] }), _jsx("p", { children: "Ticket Form Placeholder" })] }));
            case "ticket_list":
                return (_jsxs("div", { children: [_jsxs(Button, { variant: "ghost", size: "sm", onClick: () => setView("home"), className: "mb-4", children: [_jsx(Icon, { name: "ArrowLeft", size: 16, className: "mr-2" }), " Back"] }), _jsx("p", { children: "Ticket List Placeholder" })] }));
            default:
                return null;
        }
    };
    return (_jsx(Drawer, { isOpen: isOpen, onClose: onClose, title: "Support", children: _jsx("div", { className: "flex-1 overflow-y-auto p-4", children: renderContent() }) }));
};
const CategoryButton = ({ icon, label, onClick, }) => (_jsxs(Button, { onClick: onClick, className: "flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-900 transition-colors", variant: "outline", children: [_jsx(Icon, { name: icon, size: 24, className: "mb-2 text-gray-700" }), _jsx("span", { className: "text-xs font-medium text-gray-900", children: label })] }));
