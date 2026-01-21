"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ViewingRequestCard } from "@/components/properties/ViewingRequestCard";
import { Button } from "@vayva/ui";
import { Home, Loader2, RefreshCcw } from "lucide-react";
import { useEffect, useState } from "react";
export default function ViewingsPage() {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const fetchViewings = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/properties/viewings");
            const data = await res.json();
            if (data.viewings) {
                setRequests(data.viewings);
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchViewings();
    }, []);
    const pendingRequests = requests.filter(r => r.status === "PENDING");
    const upcomingRequests = requests.filter(r => r.status === "CONFIRMED");
    return (_jsxs("div", { className: "p-6 max-w-5xl mx-auto space-y-8", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight text-gray-900", children: "Tour Requests" }), _jsx("p", { className: "text-gray-500", children: "Manage incoming property viewing requests." })] }), _jsx(Button, { variant: "outline", size: "sm", onClick: fetchViewings, disabled: isLoading, children: _jsx(RefreshCcw, { size: 16, className: isLoading ? "animate-spin" : "" }) })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-amber-500" }), _jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["New Requests (", pendingRequests.length, ")"] })] }), isLoading ? (_jsx("div", { className: "flex justify-center py-8", children: _jsx(Loader2, { className: "animate-spin text-gray-400" }) })) : pendingRequests.length === 0 ? (_jsx("div", { className: "text-sm text-gray-500 italic pl-4", children: "No new requests pending approval." })) : (_jsx("div", { className: "grid gap-4", children: pendingRequests.map(req => (_jsx(ViewingRequestCard, { request: req, onUpdate: fetchViewings }, req.id))) }))] }), _jsx("div", { className: "h-px bg-gray-100" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-2 h-2 rounded-full bg-blue-500" }), _jsxs("h2", { className: "text-lg font-semibold text-gray-900", children: ["Upcoming Tours (", upcomingRequests.length, ")"] })] }), isLoading ? (_jsx("div", { className: "flex justify-center py-8", children: _jsx(Loader2, { className: "animate-spin text-gray-400" }) })) : upcomingRequests.length === 0 ? (_jsxs("div", { className: "bg-gray-50/50 border border-gray-100 rounded-xl p-8 text-center", children: [_jsx(Home, { className: "mx-auto text-gray-300 mb-2", size: 32 }), _jsx("p", { className: "text-gray-500 font-medium", children: "No upcoming tours scheduled." })] })) : (_jsx("div", { className: "grid gap-4", children: upcomingRequests.map(req => (_jsx(ViewingRequestCard, { request: req, onUpdate: fetchViewings }, req.id))) }))] })] }));
}
