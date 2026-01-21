import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ShoppingBag, Users, TrendingUp, Clock, ExternalLink, Package, AlertCircle } from "lucide-react";
// Components
export const StatCard = ({ title, value, growth, icon: Icon, color }) => (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("div", { className: `p-2.5 rounded-lg ${color} bg-opacity-10`, children: _jsx(Icon, { className: `w-5 h-5 ${color.replace('bg-', 'text-')}` }) }), _jsxs("div", { className: `flex items-center text-sm font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-500'}`, children: [growth >= 0 ? '+' : '', growth, "%", _jsx(TrendingUp, { className: `w-4 h-4 ml-1 ${growth < 0 ? 'rotate-180' : ''}` })] })] }), _jsx("div", { className: "text-sm text-gray-500 font-medium mb-1", children: title }), _jsx("div", { className: "text-2xl font-bold text-gray-900 tracking-tight", children: value })] }));
export const OrderStatusBadge = ({ status }) => {
    const styles = {
        PAID: "bg-green-50 text-green-700 border-green-100",
        PENDING: "bg-amber-50 text-amber-700 border-amber-100",
        FAILED: "bg-red-50 text-red-700 border-red-100",
        CANCELLED: "bg-gray-50 text-gray-600 border-gray-100",
    };
    return (_jsx("span", { className: `px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status]}`, children: status }));
};
export const ActivityIcon = ({ type }) => {
    switch (type) {
        case "ORDER": return _jsx(ShoppingBag, { className: "w-4 h-4 text-blue-500" });
        case "CUSTOMER": return _jsx(Users, { className: "w-4 h-4 text-purple-500" });
        case "INVENTORY": return _jsx(Package, { className: "w-4 h-4 text-orange-500" });
        default: return _jsx(Clock, { className: "w-4 h-4 text-gray-400" });
    }
};
export const StoreSummaryCard = ({ store, isPublished }) => {
    const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || "vayva.app";
    const storefrontBase = process.env.NEXT_PUBLIC_STOREFRONT_URL ||
        (process.env.NODE_ENV === "production" ? "https://vayva.store" : "http://localhost:3001");
    const storeUrl = isPublished
        ? `https://${store.slug}.${APP_DOMAIN}`
        : `${storefrontBase}?store=${store.slug}`;
    return (_jsxs("div", { className: "bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col h-full gap-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { style: { "--brand-opacity-10": store.brandColor ? `${store.brandColor}10` : "transparent" }, className: "w-16 h-16 rounded-lg border border-gray-100 flex items-center justify-center overflow-hidden bg-gray-50 text-2xl font-bold text-black bg-[var(--brand-opacity-10)]", children: store.logoUrl ? (_jsx("img", { src: store.logoUrl, alt: store.storeName, className: "w-full h-full object-cover" })) : (store.storeName[0]) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("h2", { className: "text-xl font-bold text-gray-900 truncate", children: store.storeName }), isPublished ? (_jsx("span", { className: "px-2 py-0.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase rounded border border-green-100 leading-tight", children: "Live" })) : (_jsx("span", { className: "px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold uppercase rounded border border-gray-100 leading-tight", children: "Draft" }))] }), _jsxs("a", { href: storeUrl, target: "_blank", rel: "noopener noreferrer", className: "text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 group transition-colors", children: [store.slug, ".", APP_DOMAIN, _jsx(ExternalLink, { className: "w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" })] })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gray-50 rounded-lg p-3 border border-gray-100", children: [_jsx("div", { className: "text-[10px] uppercase font-bold text-gray-400 mb-1", children: "Status" }), _jsx("div", { className: "text-sm font-semibold text-gray-700", children: store.status })] }), _jsxs("div", { className: "bg-gray-50 rounded-lg p-3 border border-gray-100", children: [_jsx("div", { className: "text-[10px] uppercase font-bold text-gray-400 mb-1", children: "Last Update" }), _jsx("div", { className: "text-sm font-semibold text-gray-700", children: "Today" })] })] }), !isPublished && (_jsxs("div", { className: "mt-auto bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3 items-start", children: [_jsx(AlertCircle, { className: "w-5 h-5 text-amber-600 shrink-0 mt-0.5" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-bold text-amber-900 mb-1", children: "Finish Publishing" }), _jsx("p", { className: "text-xs text-amber-800 leading-relaxed opacity-80", children: "Your store is currently in draft mode and not visible to customers. Complete your profile to go live." })] })] }))] }));
};
