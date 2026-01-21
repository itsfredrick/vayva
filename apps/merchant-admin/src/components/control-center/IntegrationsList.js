import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button, Icon, cn } from "@vayva/ui";
export const IntegrationsList = ({ integrations }) => {
    return (_jsxs("section", { className: "mb-12", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-bold text-gray-900", children: "Integrations" }), _jsx("p", { className: "text-sm text-gray-500", children: "Connect tools that power your business." })] }), _jsx(Button, { variant: "ghost", size: "sm", className: "text-blue-600", children: "Browse Directory" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: integrations.map((integration) => (_jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 p-6 flex flex-col h-full hover:border-gray-300 transition-colors", children: [_jsxs("div", { className: "flex justify-between items-start mb-4", children: [_jsx("div", { className: "w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100", children: _jsx(Icon, { name: integration.logoUrl || "Puzzle", size: 24, className: "text-gray-700" }) }), _jsx("span", { className: cn("text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full", integration.status === "connected"
                                        ? "bg-green-50 text-green-700"
                                        : "bg-gray-100 text-gray-500"), children: integration.status === "connected"
                                        ? "Active"
                                        : "Not Connected" })] }), _jsxs("div", { className: "flex-1 mb-6", children: [_jsx("h4", { className: "font-bold text-gray-900 mb-1", children: integration.name }), _jsx("p", { className: "text-sm text-gray-500 leading-relaxed", children: integration.description })] }), _jsxs("a", { href: integration.id === "kwik"
                                ? "/admin/control-center/delivery"
                                : "/admin/settings/billing", className: cn("w-full flex items-center justify-between group px-4 py-2 rounded-lg border text-sm font-medium transition-all", integration.status === "connected"
                                ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                                : "bg-black text-white hover:bg-gray-800 border-transparent"), children: [integration.status === "connected"
                                    ? "Manage Settings"
                                    : "Connect", _jsx(Icon, { name: integration.status === "connected" ? "Settings" : "ArrowRight", size: 16, className: cn(integration.status !== "connected" &&
                                        "group-hover:translate-x-1 transition-transform") })] })] }, integration.id))) })] }));
};
