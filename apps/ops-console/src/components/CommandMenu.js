"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { LayoutDashboard, Users, ShoppingBag, CreditCard, ShieldAlert, Settings, Truck, Search, LifeBuoy, Zap, BrainCircuit, FileSignature, Activity, MessageSquare, Bot, Shield, History, Terminal } from "lucide-react";
export function CommandMenu() {
    const router = useRouter();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [searchResults, setSearchResults] = React.useState([]);
    // Debounce Search
    React.useEffect(() => {
        if (!query || query.length < 2) {
            setSearchResults([]);
            return;
        }
        const timeout = setTimeout(async () => {
            const res = await fetch(`/api/ops/search?q=${encodeURIComponent(query)}`);
            const json = await res.json();
            if (json.results)
                setSearchResults(json.results);
        }, 300);
        return () => clearTimeout(timeout);
    }, [query]);
    React.useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);
    const runCommand = React.useCallback((command) => {
        setOpen(false);
        command();
    }, []);
    return (_jsxs(Command.Dialog, { open: open, onOpenChange: setOpen, label: "Global Command Menu", className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[640px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 p-0", overlayClassName: "fixed inset-0 bg-black/40 backdrop-blur-sm z-50", children: [_jsxs("div", { className: "flex items-center border-b border-gray-100 px-4", children: [_jsx(Search, { className: "mr-2 h-5 w-5 shrink-0 text-gray-400" }), _jsx(Command.Input, { placeholder: "Type a command or search...", value: query, onValueChange: setQuery, className: "flex h-14 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50" })] }), _jsxs(Command.List, { className: "max-h-[300px] overflow-y-auto overflow-x-hidden p-2", children: [_jsx(Command.Empty, { className: "py-6 text-center text-sm text-gray-500", children: "No results found." }), _jsxs(Command.Group, { heading: "Navigation", className: "px-2 py-1.5 text-xs font-medium text-gray-500 uppercase", children: [_jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops")), icon: LayoutDashboard, children: "Dashboard" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/merchants")), icon: Users, children: "Merchants" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/orders")), icon: ShoppingBag, children: "Orders" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/deliveries")), icon: Truck, children: "Deliveries" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/financials/subscriptions")), icon: CreditCard, children: "Billing Monitor" })] }), _jsxs(Command.Group, { heading: "Platform Admin", children: [_jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/admin/team")), icon: Shield, children: "Team Management" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/admin/audit")), icon: History, children: "System Audit" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/admin/system")), icon: Terminal, children: "Environment" })] }), _jsxs(Command.Group, { heading: "Tools & Settings", className: "px-2 py-1.5 text-xs font-medium text-gray-500 uppercase mt-2", children: [_jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/rescue")), icon: ShieldAlert, children: "Rescue Dashboard" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/tools")), icon: Settings, children: "System Tools" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/support")), icon: LifeBuoy, children: "Support Tickets" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/ai")), icon: BrainCircuit, children: "AI Intelligence" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/approvals")), icon: FileSignature, children: "Approval Center" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/payouts")), icon: CreditCard, children: "Payouts Operation" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/communications")), icon: MessageSquare, children: "Communications Logs" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/webhooks")), icon: Activity, children: "Webhook Inspector" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/security/sessions")), icon: ShieldAlert, children: "Session Manager" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/ai/quality")), icon: Bot, children: "AI Quality Lab" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/marketplace")), icon: ShoppingBag, children: "Marketplace Manager" }), _jsx(CommandItem, { onSelect: () => runCommand(() => router.push("/ops/growth/campaigns")), icon: Zap, children: "Campaign Monitor" })] }), searchResults.length > 0 && (_jsx(Command.Group, { heading: "Search Results", className: "px-2 py-1.5 text-xs font-medium text-gray-500 uppercase mt-2", children: searchResults.map((res, i) => (_jsx(CommandItem, { onSelect: () => runCommand(() => router.push(res.url)), icon: Search, children: _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { children: res.label }), _jsxs("span", { className: "text-[10px] text-gray-400 capitalize", children: [res.type, " \u2022 ", res.subLabel] })] }) }, i))) }))] }), _jsxs("div", { className: "border-t border-gray-100 py-2 px-4 text-xs text-gray-400 flex justify-between", children: [_jsx("span", { children: "Use \u2191\u2193 to navigate" }), _jsx("span", { children: "ESC to close" })] })] }));
}
function CommandItem({ children, onSelect, icon: Icon }) {
    return (_jsxs(Command.Item, { onSelect: onSelect, className: "flex items-center px-4 py-3 text-sm text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 cursor-pointer transition-colors aria-selected:bg-gray-100 aria-selected:text-gray-900", children: [_jsx(Icon, { className: "mr-3 h-4 w-4 text-gray-500" }), children] }));
}
