import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { XCircle, CheckCircle } from "lucide-react";
import useSWR from "swr";
import { formatDistanceToNow } from "date-fns";
export function WebhookHealth() {
    const { data, isLoading } = useSWR("/api/settings/whatsapp/stats", fetcher);
    if (isLoading) {
        return (_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center gap-2", children: ["Webhook Status", _jsx("div", { className: "h-4 w-16 bg-muted animate-pulse rounded" })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "h-24 bg-muted/20 animate-pulse rounded-lg" }) })] }));
    }
    const stats = data || {
        status: "UNKNOWN",
        lastReceived: null,
        successRate: "0%",
        events24h: 0,
        failed: 0,
        recentEvents: []
    };
    return (_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "flex items-center gap-2", children: ["Webhook Status", stats.status === "HEALTHY" ? (_jsx(Badge, { className: "bg-green-500", children: "Healthy" })) : (_jsx(Badge, { variant: "destructive", children: stats.status }))] }), _jsx(CardDescription, { children: "Real-time status of message delivery events." })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "grid grid-cols-3 gap-4 mb-4", children: [_jsxs("div", { className: "text-center p-3 bg-muted/50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold", children: stats.events24h }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Events (24h)" })] }), _jsxs("div", { className: "text-center p-3 bg-muted/50 rounded-lg", children: [_jsx("div", { className: "text-2xl font-bold text-green-600", children: stats.successRate }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Success Rate" })] }), _jsxs("div", { className: "text-center p-3 bg-muted/50 rounded-lg", children: [_jsx("div", { className: `${stats.failed > 0 ? "text-red-500" : "text-gray-500"} text-2xl font-bold`, children: stats.failed }), _jsx("div", { className: "text-xs text-muted-foreground", children: "Failed" })] })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("h4", { className: "text-sm font-medium", children: "Recent Events" }), _jsx("div", { className: "text-sm space-y-2", children: stats.recentEvents.length === 0 ? (_jsx("div", { className: "text-xs text-muted-foreground text-center py-4", children: "No recent events found." })) : (stats.recentEvents.map((event, i) => (_jsxs("div", { className: "flex justify-between items-center p-2 border rounded", children: [_jsxs("span", { className: "flex items-center gap-2", children: [event.status === "FAILED" ? (_jsx(XCircle, { className: "h-4 w-4 text-red-500" })) : (_jsx(CheckCircle, { className: "h-4 w-4 text-green-500" })), _jsx("span", { className: "font-mono text-xs", children: event.event })] }), _jsx("span", { className: "text-xs text-muted-foreground", children: formatDistanceToNow(new Date(event.timestamp), { addSuffix: true }) })] }, i)))) })] })] })] }));
}
const fetcher = (url) => fetch(url).then((res) => res.json());
