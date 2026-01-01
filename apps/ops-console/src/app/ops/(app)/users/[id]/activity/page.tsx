
"use client";

import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import {
    Activity,
    ArrowLeft,
    Shield,
    Lock,
    AlertTriangle,
    Terminal,
    Calendar,
    Mail
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface AuditEvent {
    id: string;
    eventType: string;
    metadata: any;
    createdAt: string;
}

interface OpsUser {
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    lastLoginAt: string;
    createdAt: string;
}

export default function UserActivityPage() {
    const params = useParams();
    const userId = params.id as string;

    const [user, setUser] = useState<OpsUser | null>(null);
    const [events, setEvents] = useState<AuditEvent[]>([]);
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

        } catch (e) {
            console.error("Failed to fetch activity", e);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type: string) => {
        if (type.includes("LOGIN")) return <Lock className="w-4 h-4 text-blue-500" />;
        if (type.includes("FAIL")) return <AlertTriangle className="w-4 h-4 text-red-500" />;
        return <Activity className="w-4 h-4 text-gray-400" />;
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-6">
            <Link href="/ops/users" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-4">
                <ArrowLeft className="w-4 h-4" /> Back to Team
            </Link>

            {loading && !user ? (
                <div className="h-32 bg-gray-50 rounded-xl animate-pulse" />
            ) : user ? (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex justify-between items-start">
                    <div className="flex gap-4">
                        <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                            {user.name[0]}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {user.email}</span>
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                                    <Shield className="w-3 h-3" /> {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                        <div className="flex items-center gap-1 justify-end">
                            <Calendar className="w-3 h-3" /> Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                        <div className="mt-1">
                            Status: <span className={user.isActive ? "text-green-600 font-medium" : "text-gray-400"}>{user.isActive ? "Active" : "Inactive"}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-red-50 text-red-700 p-4 rounded-lg">User not found</div>
            )}

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Activity Log</h2>

                <div className="relative border-l-2 border-gray-100 ml-4 space-y-8 py-2">
                    {loading ? (
                        <div className="pl-6 text-gray-400 italic">Loading activity...</div>
                    ) : events.length === 0 ? (
                        <div className="pl-6 text-gray-400 italic">No activity recorded.</div>
                    ) : (
                        events.map((e, i) => (
                            <div key={e.id} className="relative pl-6">
                                <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                                </span>
                                <div className="bg-white border border-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2 mb-1">
                                            {getIcon(e.eventType)}
                                            <span className="font-mono text-sm font-bold text-gray-800">{e.eventType}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                            {formatDistanceToNow(new Date(e.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2 font-mono break-all">
                                        {JSON.stringify(e.metadata)}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
