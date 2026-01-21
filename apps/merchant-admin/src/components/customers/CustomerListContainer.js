"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerList } from "./CustomerList";
import { CustomerOverview } from "./CustomerOverview";
import { CustomerDrawer } from "./CustomerDrawer";
import { Button, Icon, Modal } from "@vayva/ui";
import { CustomerForm } from "./CustomerForm";
export const CustomerListContainer = ({ customers }) => {
    const router = useRouter();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [search, setSearch] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.phone && c.phone.includes(search)));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Customers" }), _jsx("p", { className: "text-gray-500 text-sm", children: "View and manage your customer base" })] }), _jsxs(Button, { onClick: () => setIsCreateModalOpen(true), children: [_jsx(Icon, { name: "Plus", className: "mr-2", size: 16 }), " Add Customer"] })] }), _jsx(CustomerOverview, { customers: customers }), _jsxs("div", { className: "bg-white rounded-xl border border-gray-200 p-4 shadow-sm", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { className: "relative max-w-sm w-full", children: [_jsx(Icon, { name: "Search", className: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400", size: 16 }), _jsx("input", { type: "text", placeholder: "Search customers...", className: "w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black/5 focus:border-black transition-all", value: search, onChange: (e) => setSearch(e.target.value) })] }), _jsx("div", { className: "flex gap-2", children: _jsxs(Button, { variant: "outline", size: "sm", onClick: () => router.refresh(), children: [_jsx(Icon, { name: "RefreshCw", className: "mr-2", size: 14 }), " Refresh"] }) })] }), _jsx(CustomerList, { customers: filteredCustomers, isLoading: false, onSelectCustomer: setSelectedCustomer })] }), _jsx(CustomerDrawer, { customerId: selectedCustomer?.id || null, isOpen: !!selectedCustomer, onClose: () => setSelectedCustomer(null) }), _jsx(Modal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), title: "Add New Customer", children: _jsx(CustomerForm, { onSuccess: () => setIsCreateModalOpen(false) }) })] }));
};
