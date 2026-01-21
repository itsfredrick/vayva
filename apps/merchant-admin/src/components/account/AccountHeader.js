import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, cn } from "@vayva/ui";
export const AccountHeader = ({ data }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-700";
            case "restricted":
                return "bg-red-100 text-red-700";
            default:
                return "bg-amber-100 text-amber-700";
        }
    };
    const getStatusLabel = (status) => {
        switch (status) {
            case "active":
                return "Fully active";
            case "restricted":
                return "Restricted";
            default:
                return "Action required";
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-16 h-16 rounded-xl bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center text-2xl font-bold shadow-lg", children: data.businessName.charAt(0) }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-heading font-bold text-gray-900", children: data.businessName }), _jsxs("div", { className: "flex items-center gap-3 mt-1", children: [_jsxs("span", { className: "text-sm text-gray-500 font-medium flex items-center gap-1", children: [_jsx(Icon, { name: "Store", size: 14 }), " ", data.businessType] }), _jsx("div", { className: "h-4 w-px bg-gray-200" }), _jsxs("span", { className: "text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full", children: [data.plan, " Plan"] })] })] })] }), _jsxs("div", { className: cn("px-4 py-2 rounded-xl flex items-center gap-3 self-start md:self-center", getStatusColor(data.overallStatus)), children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-current animate-pulse" }), _jsxs("div", { className: "text-left", children: [_jsx("p", { className: "text-[10px] uppercase font-bold tracking-wider opacity-70", children: "Account Status" }), _jsx("p", { className: "text-sm font-bold leading-none", children: getStatusLabel(data.overallStatus) })] })] })] }));
};
