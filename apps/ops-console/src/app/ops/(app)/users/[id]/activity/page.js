"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Activity, ArrowLeft, Shield, Lock, AlertTriangle, Calendar, Mail } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
export default function UserActivityPage() {
    const params = useParams();
    const userId = params.id;
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (userId) {
            fetchData();
        }
    }, [userId]);
    const fetchData = async () => {
        setLoading(true);
        try {
            // Parallel fetch
            const [userRes, logsRes] = await Promise.all([
                fetch(`/api/ops/users?id=${userId}`),
                fetch(`/api/ops/security/logs?userId=${userId}&limit=100`)
            ]);
            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
            }
            if (logsRes.ok) {
                const logsData = await logsRes.json();
                setEvents(logsData.data || []);
            }
        }
        catch (e) {
            console.error("Failed to fetch activity", e);
        }
        finally {
            setLoading(false);
        }
    };
    const getIcon = (type) => {
        if (type.includes("LOGIN"))
            return _jsx(Lock, { className: "w-4 h-4 text-blue-500" });
        if (type.includes("FAIL"))
            return _jsx(AlertTriangle, { className: "w-4 h-4 text-red-500" });
        return _jsx(Activity, { className: "w-4 h-4 text-gray-400" });
    };
    return (_jsxs("div", { className: "p-8 max-w-5xl mx-auto space-y-6", children: [_jsxs(Link, { href: "/ops/users", className: "flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4", children: [_jsx(ArrowLeft, { className: "w-4 h-4" }), " Back to Team"] }), loading && !user ? (_jsx("div", { className: "h-32 bg-gray-50 rounded-xl animate-pulse" })) : user ? (_jsxs("div", { className: "bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-start", children: [_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg", children: user.name[0] }), _jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: user.name }), _jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-500 mt-1", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Mail, { className: "w-3 h-3" }), " ", user.email] }), _jsxs("span", { className: "flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs font-medium", children: [_jsx(Shield, { className: "w-3 h-3" }), " ", user.role] })] })] })] }), _jsxs("div", { className: "text-right text-sm text-gray-500", children: [_jsxs("div", { className: "flex items-center gap-1 justify-end", children: [_jsx(Calendar, { className: "w-3 h-3" }), " Joined ", new Date(user.createdAt).toLocaleDateString()] }), _jsxs("div", { className: "mt-1", children: ["Status: ", _jsx("span", { className: user.isActive ? "text-green-600 font-medium" : "text-gray-400", children: user.isActive ? "Active" : "Inactive" })] })] })] })) : (_jsx("div", { className: "bg-red-50 text-red-700 p-4 rounded-lg", children: "User not found" })), _jsxs("div", { className: "space-y-4", children: [_jsx("h2", { className: "text-lg font-bold text-gray-900 border-b border-gray-200 pb-2", children: "Activity Log" }), _jsx("div", { className: "relative border-l-2 border-gray-100 ml-4 space-y-8 py-2", children: loading ? (_jsx("div", { className: "pl-6 text-gray-400 italic", children: "Loading activity..." })) : events.length === 0 ? (_jsx("div", { className: "pl-6 text-gray-400 italic", children: "No activity recorded." })) : (events.map((e, i) => (_jsxs("div", { className: "relative pl-6", children: [_jsx("span", { className: "absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center", children: _jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-indigo-500" }) }), _jsxs("div", { className: "bg-white border border-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [getIcon(e.eventType), _jsx("span", { className: "font-mono text-sm font-bold text-gray-800", children: e.eventType })] }), _jsx("span", { className: "text-xs text-gray-400 whitespace-nowrap", children: formatDistanceToNow(new Date(e.createdAt), { addSuffix: true }) })] }), _jsx("p", { className: "text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2 font-mono break-all", children: JSON.stringify(e.metadata) })] })] }, e.id)))) })] })] }));
}
