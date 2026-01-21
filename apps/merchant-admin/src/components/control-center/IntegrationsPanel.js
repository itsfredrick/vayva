import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Icon, cn, Button } from "@vayva/ui";
export const IntegrationsPanel = ({ integrations, onToggle, }) => {
    return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: integrations.map((integration) => {
            const isConnected = integration.status === "connected";
            return (_jsxs("div", { className: "p-5 border border-gray-200 rounded-2xl bg-white flex flex-col justify-between hover:border-gray-300 transition-colors", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex justify-between items-start mb-3", children: [_jsx("div", { className: cn("w-10 h-10 rounded-xl flex items-center justify-center text-lg", integration.category === "payment"
                                            ? "bg-green-50 text-green-600"
                                            : integration.category === "marketing"
                                                ? "bg-blue-50 text-blue-600"
                                                : "bg-orange-50 text-orange-600"), children: _jsx(Icon, { name: integration.id.includes("pay")
                                                ? "CreditCard"
                                                : integration.id.includes("ship")
                                                    ? "Truck"
                                                    : "Megaphone", size: 20 }) }), _jsx("div", { className: cn("w-10 h-6 rounded-full p-1 cursor-pointer transition-colors relative", isConnected ? "bg-green-500" : "bg-gray-200"), onClick: () => onToggle(integration.id, !isConnected), children: _jsx("div", { className: cn("w-4 h-4 bg-white rounded-full shadow-sm transition-transform", isConnected ? "translate-x-4" : "translate-x-0") }) })] }), _jsx("h3", { className: "font-bold text-gray-900", children: integration.name }), _jsx("p", { className: "text-xs text-gray-500 mt-1 leading-normal", children: integration.description })] }), _jsxs("div", { className: "mt-4 pt-4 border-t border-gray-50 flex justify-between items-center", children: [_jsx("span", { className: "text-[10px] uppercase font-bold text-gray-400 tracking-wider disabled", children: integration.category }), isConnected && (_jsxs(Button, { className: "text-xs font-bold text-gray-900 flex items-center gap-1 hover:underline", variant: "link", children: [_jsx(Icon, { name: "Settings", size: 12 }), " Configure"] }))] })] }, integration.id));
        }) }));
};
