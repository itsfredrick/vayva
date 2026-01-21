import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Button, Drawer, Icon, cn, Modal } from "@vayva/ui";
import { WhatsAppAction } from "./WhatsAppAction";
import { CustomerForm } from "./CustomerForm";
export const CustomerDrawer = ({ isOpen, onClose, customerId, }) => {
    const [customer, setCustomer] = useState(null);
    const [insights, setInsights] = useState([]);
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("timeline");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    useEffect(() => {
        if (isOpen && customerId) {
            fetchData();
        }
        else {
            setCustomer(null);
            setInsights([]);
            setHistory([]);
        }
    }, [isOpen, customerId]);
    const fetchData = async () => {
        setLoading(true);
        try {
            // Parallel fetch for speed
            const [profileRes, historyRes] = await Promise.all([
                fetch(`/api/customers/${customerId}`).then((r) => r.json()),
                fetch(`/api/customers/${customerId}/history`).then((r) => r.json()),
            ]);
            setCustomer(profileRes.profile);
            setInsights(profileRes.insights);
            setStats(profileRes.stats);
            setHistory(historyRes);
        }
        catch (e) {
            console.error(e);
        }
        finally {
            setLoading(false);
        }
    };
    const handleDelete = async () => {
        if (!customer || !window.confirm("Are you sure you want to delete this customer? This action cannot be undone."))
            return;
        setIsDeleting(true);
        try {
            const res = await fetch(`/api/customers/${customer.id}`, {
                method: "DELETE"
            });
            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to delete customer");
                return;
            }
            onClose();
        }
        catch (e) {
            console.error(e);
            alert("An error occurred while deleting the customer");
        }
        finally {
            setIsDeleting(false);
        }
    };
    if (!isOpen)
        return null;
    return (_jsxs(Drawer, { isOpen: isOpen, onClose: onClose, title: loading ? "Loading..." : "Customer Profile", children: [loading || !customer ? (_jsx("div", { className: "h-full flex items-center justify-center", children: _jsx("div", { className: "animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" }) })) : (_jsxs("div", { className: "flex flex-col h-full bg-gray-50", children: [_jsxs("div", { className: "bg-white p-6 border-b border-gray-200", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-xl font-bold text-gray-600 border border-gray-100", children: customer.name.charAt(0) }), _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-900", children: customer.name }), _jsxs("p", { className: "text-gray-500 text-sm font-mono flex items-center gap-2", children: [_jsx(Icon, { name: "Phone", size: 12 }), " ", customer.phone] }), _jsxs("div", { className: "flex gap-2 mt-2", children: [insights.some((i) => i.type === "risk") && (_jsx("span", { className: "text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase tracking-wider", children: "High Risk" })), _jsxs("span", { className: "text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase tracking-wider", children: ["Seen ", new Date(customer.lastSeenAt).toLocaleDateString()] })] })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", onClick: () => setIsEditModalOpen(true), className: "h-9 w-9 p-0 rounded-full", title: "Edit Profile", children: _jsx(Icon, { name: "Edit3", size: 14 }) }), _jsx(Button, { variant: "outline", size: "sm", onClick: handleDelete, disabled: isDeleting, className: "h-9 w-9 p-0 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 border-gray-200", title: "Delete Customer", children: isDeleting ? (_jsx("div", { className: "animate-spin w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full" })) : (_jsx(Icon, { name: "Trash2", size: 14 })) }), _jsx(WhatsAppAction, { phone: customer.phone, name: customer.name, label: "Message", size: "sm" })] })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4 mt-6", children: [_jsxs("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100", children: [_jsx("p", { className: "text-xs text-gray-500 uppercase font-bold mb-1", children: "Lifetime Value" }), _jsxs("p", { className: "text-lg font-bold font-mono", children: ["\u20A6", customer.totalSpend.toLocaleString()] })] }), _jsxs("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100", children: [_jsx("p", { className: "text-xs text-gray-500 uppercase font-bold mb-1", children: "Orders" }), _jsx("p", { className: "text-lg font-bold", children: customer.totalOrders })] }), _jsxs("div", { className: "p-3 bg-gray-50 rounded-xl border border-gray-100", children: [_jsx("p", { className: "text-xs text-gray-500 uppercase font-bold mb-1", children: "AOV" }), _jsxs("p", { className: "text-lg font-bold font-mono", children: ["\u20A6", (stats?.aov || 0).toLocaleString()] })] })] })] }), insights.length > 0 && (_jsxs("div", { className: "bg-white p-4 border-b border-gray-200", children: [_jsxs("h3", { className: "text-xs font-bold text-gray-900 uppercase mb-3 flex items-center gap-1", children: [_jsx(Icon, { name: "Sparkles", size: 12, className: "text-amber-500" }), " ", "Smart Insights"] }), _jsx("div", { className: "flex gap-3 overflow-x-auto pb-2 no-scrollbar", children: insights.map((insight) => (_jsxs("div", { className: "min-w-[200px] p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx(Icon, { name: insight.icon, size: 14, className: "text-indigo-600" }), _jsx("span", { className: "text-xs font-bold text-indigo-900", children: insight.title })] }), _jsx("p", { className: "text-[10px] text-indigo-700 leading-tight", children: insight.description })] }, insight.id))) })] })), _jsxs("div", { className: "flex-1 overflow-auto p-6", children: [_jsxs("div", { className: "flex gap-4 border-b border-gray-200 mb-6", children: [_jsx(Button, { variant: "ghost", onClick: () => setActiveTab("timeline"), className: cn("pb-2 text-sm font-bold transition-colors rounded-none hover:bg-transparent h-auto p-0 hover:no-underline", activeTab === "timeline"
                                            ? "border-b-2 border-black text-black"
                                            : "text-gray-400 hover:text-gray-600"), children: "History" }), _jsx(Button, { variant: "ghost", onClick: () => setActiveTab("notes"), className: cn("pb-2 text-sm font-bold transition-colors rounded-none hover:bg-transparent h-auto p-0 hover:no-underline", activeTab === "notes"
                                            ? "border-b-2 border-black text-black"
                                            : "text-gray-400 hover:text-gray-600"), children: "Notes" })] }), activeTab === "timeline" && (_jsx("div", { className: "space-y-6 relative pl-4 border-l-2 border-gray-100 ml-2", children: history.map((item, idx) => (_jsxs("div", { className: "relative pl-6", children: [_jsx("div", { className: cn("absolute -left-[25px] top-0 w-8 h-8 rounded-full border-4 border-gray-50 flex items-center justify-center bg-white shadow-sm", item.type === "order"
                                                ? "text-blue-600"
                                                : item.type === "message"
                                                    ? "text-green-600"
                                                    : "text-gray-400"), children: _jsx(Icon, { name: (item.type === "order"
                                                    ? "ShoppingBag"
                                                    : item.type === "message"
                                                        ? "MessageCircle"
                                                        : "FileText"), size: 14 }) }), _jsxs("div", { className: "bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative group hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex justify-between items-start mb-1", children: [_jsx("span", { className: "text-xs font-bold uppercase text-gray-500", children: item.type }), _jsx("span", { className: "text-[10px] text-gray-400", children: new Date(item.date).toLocaleDateString() })] }), _jsx("div", { className: "font-medium text-gray-900 text-sm", children: item.description }), item.amount && (_jsxs("div", { className: "mt-2 font-mono font-bold text-gray-900", children: ["\u20A6", item.amount.toLocaleString()] }))] })] }, item.id))) })), activeTab === "notes" && (_jsxs("div", { className: "text-center py-10 text-gray-400", children: [_jsx(Icon, { name: "FileText", size: 32, className: "mx-auto mb-2 opacity-20" }), _jsx("p", { className: "text-sm", children: "No internal notes yet." }), _jsx(Button, { size: "sm", variant: "outline", className: "mt-4", children: "Add Note" })] }))] })] })), _jsx(Modal, { isOpen: isEditModalOpen, onClose: () => setIsEditModalOpen(false), title: "Edit Customer Profile", children: _jsx(CustomerForm, { initialData: customer, onSuccess: () => {
                        setIsEditModalOpen(false);
                        fetchData(); // Refresh profile
                    } }) })] }));
};
