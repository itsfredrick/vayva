import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CustomerStatus } from "@vayva/shared";
import { Button, Icon, cn } from "@vayva/ui";
import { WhatsAppAction } from "./WhatsAppAction";
import { ResponsiveTable } from "@/components/ui/ResponsiveTable";
export const CustomerList = ({ customers, isLoading, onSelectCustomer, }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-NG", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            minimumFractionDigits: 0,
        }).format(amount);
    };
    const columns = [
        {
            key: "name",
            label: "Customer",
            mobileLabel: "Name",
            priority: "high",
            render: (customer) => (_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: cn("w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0", customer.status === "vip"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-gray-100 text-gray-700"), children: customer.name.charAt(0) }), _jsxs("div", { children: [_jsx("div", { className: "font-bold text-gray-900 text-sm md:text-base", children: customer.name }), _jsx("div", { className: "text-xs text-gray-500 font-mono", children: customer.phone })] })] })),
        },
        {
            key: "status",
            label: "Status",
            priority: "high",
            render: (customer) => (_jsxs("span", { className: cn("px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1", customer.status === CustomerStatus.VIP
                    ? "bg-amber-100 text-amber-700"
                    : customer.status === CustomerStatus.NEW
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"), children: [customer.status === CustomerStatus.VIP && (_jsx(Icon, { name: "Crown", size: 10 })), customer.status] })),
        },
        {
            key: "totalOrders",
            label: "Orders",
            priority: "medium",
            render: (customer) => (_jsxs("span", { className: "text-sm text-gray-600", children: [customer.totalOrders, " orders"] })),
        },
        {
            key: "totalSpend",
            label: "Total Spent",
            mobileLabel: "Spent",
            priority: "high",
            render: (customer) => (_jsx("span", { className: "font-mono font-bold text-gray-900", children: formatCurrency(customer.totalSpend) })),
        },
        {
            key: "lastSeenAt",
            label: "Last Active",
            priority: "low",
            render: (customer) => (_jsx("span", { className: "text-xs text-gray-400", children: formatDate(customer.lastSeenAt) })),
        },
        {
            key: "actions",
            label: "Actions",
            priority: "high",
            render: (customer) => (_jsxs("div", { className: "flex items-center justify-end gap-2", onClick: (e) => e.stopPropagation(), children: [_jsx(WhatsAppAction, { phone: customer.phone, name: customer.name, variant: "icon" }), _jsx(Button, { size: "sm", variant: "ghost", className: "text-gray-400 hover:text-gray-900 touch-target-sm", onClick: () => onSelectCustomer(customer), children: _jsx(Icon, { name: "ChevronRight", size: 16 }) })] })),
        },
    ];
    return (_jsx("div", { className: "bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm", children: _jsx(ResponsiveTable, { data: customers, columns: columns, keyExtractor: (customer) => customer.id, onRowClick: onSelectCustomer, loading: isLoading, emptyMessage: "No customers found. Try adjusting your filters or search." }) }));
};
