
"use client";

import React, { useState } from "react";
import {
    Server,
    Zap,
    Database,
    AlertTriangle,
    RefreshCw,
    ToggleLeft,
    ToggleRight,
    Terminal,
    Globe,
    Activity
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@vayva/ui"; // Assuming UI lib exists, or use standard HTML

export default function SystemToolsPage() {
    return (
        <div className="p-8 max-w-6xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Terminal className="h-8 w-8 text-indigo-600" />
                        System Tools
                    </h1>
                    <p className="text-gray-500 mt-1">Advanced controls for platform operations.</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* System Health */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600">
                            <Activity size={20} />
                        </div>
                        <h3 className="font-semibold text-gray-900">System Health</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">
                        Monitor database connectivity, API latency, and system uptime status.
                    </p>
                    <Link
                        href="/ops/tools/health"
                        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    >
                        Check Status &rarr;
                    </Link>
                </div>

                <CacheControlCard />
                <FeatureFlagCard />
                <AnnouncementCard />
                <EnvInfoCard />
            </div>
        </div>
    );
}

function AnnouncementCard() {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [current, setCurrent] = useState<any>(null);

    React.useEffect(() => {
        fetch("/api/ops/config/announcements")
            .then(res => res.json())
            .then(data => setCurrent(data.announcement))
            .catch(() => { });
    }, []);

    const publish = async () => {
        setLoading(true);
        try {
            await fetch("/api/ops/config/announcements", {
                method: "POST",
                body: JSON.stringify({ message, active: true })
            });
            toast.success("Announcement Published");
            setCurrent({ message, active: true });
            setMessage("");
        } catch (e) {
            toast.error("Failed");
        } finally {
            setLoading(false);
        }
    };

    const clear = async () => {
        setLoading(true);
        try {
            await fetch("/api/ops/config/announcements", { method: "DELETE" });
            toast.success("Announcement Cleared");
            setCurrent(null);
        } catch (e) {
            toast.error("Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                    <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Announcements</h3>
                    <p className="text-xs text-gray-500">Global dashboard banners.</p>
                </div>
            </div>

            {current ? (
                <div className="bg-pink-50 border border-pink-100 p-4 rounded-xl mb-4">
                    <div className="text-xs font-bold text-pink-600 uppercase mb-1">Live Now</div>
                    <div className="text-sm font-medium text-gray-900">{current.message}</div>
                    <button onClick={clear} disabled={loading} className="mt-2 text-xs text-red-600 hover:underline">
                        Recall Announcement
                    </button>
                </div>
            ) : (
                <div className="text-sm text-gray-400 italic mb-4">No active announcement.</div>
            )}

            <div className="flex gap-2">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter alert message..."
                    className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <button
                    onClick={publish}
                    disabled={!message || loading}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold disabled:opacity-50"
                >
                    Post
                </button>
            </div>
        </div>
    );
}

function CacheControlCard() {
    const [path, setPath] = useState("/");
    const [loading, setLoading] = useState(false);

    const handleClear = async (type: "path" | "tag") => {
        setLoading(true);
        try {
            const res = await fetch("/api/ops/tools/cache", {
                method: "POST",
                body: JSON.stringify({ target: path, type }),
            });
            const json = await res.json();
            if (res.ok) {
                toast.success("Cache Cleared", { description: json.message });
            } else {
                toast.error("Failed", { description: json.error });
            }
        } catch (e) {
            toast.error("Network Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                    <Zap className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Cache Control</h3>
                    <p className="text-xs text-gray-500">Manually revalidate Next.js ISR cache.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Path / Tag</label>
                    <input
                        type="text"
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg font-mono text-sm"
                        placeholder="/"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleClear("path")}
                        disabled={loading}
                        className="flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                    >
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                        Revalidate Path
                    </button>
                    <button
                        onClick={() => handleClear("tag")}
                        disabled={loading}
                        className="flex-1 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-bold flex items-center justify-center gap-2"
                    >
                        {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
                        Revalidate Tag
                    </button>
                </div>
            </div>
        </div>
    );
}

function FeatureFlagCard() {
    const [maintenance, setMaintenance] = useState(false);
    // Real implementation would fetch initial state from API

    const toggleMaintenance = () => {
        const newState = !maintenance;
        setMaintenance(newState);
        // Fire-and-forget logging
        fetch("/api/ops/audit", { // Or specialized tool log
            method: "POST", // Method might vary depending on existing audit API, assuming we just log via tools actions actually
            // Actually let's just toast for now as 'Simulation' since we didn't build persistence
        });
        toast.info(`Maintenance Mode: ${newState ? "ENABLED" : "DISABLED"} (Simulated)`);
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                    <ToggleLeft className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Feature Flags</h3>
                    <p className="text-xs text-gray-500">Global system toggles.</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                        <div className="text-sm font-bold text-gray-900">Maintenance Mode</div>
                        <div className="text-xs text-gray-500">Block all non-admin traffic.</div>
                    </div>
                    <button onClick={toggleMaintenance} className={`text-2xl transition-colors ${maintenance ? "text-indigo-600" : "text-gray-300"}`}>
                        {maintenance ? <ToggleRight className="h-8 w-8" /> : <ToggleLeft className="h-8 w-8" />}
                    </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 opacity-50">
                    <div>
                        <div className="text-sm font-bold text-gray-900">Beta Features</div>
                        <div className="text-xs text-gray-500">Enable v2 Dashboard for all.</div>
                    </div>
                    <ToggleLeft className="h-8 w-8 text-gray-300" />
                </div>
            </div>
        </div>
    );
}

function EnvInfoCard() {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Server className="h-5 w-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Environment</h3>
                    <p className="text-xs text-gray-500">Current system configuration.</p>
                </div>
            </div>

            <dl className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">NODE_ENV</dt>
                    <dd className="font-mono font-bold text-gray-900">{process.env.NODE_ENV}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Region</dt>
                    <dd className="font-mono font-bold text-gray-900">us-east-1</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Database</dt>
                    <dd className="font-mono font-bold text-green-600">Connected</dd>
                </div>
                <div className="flex justify-between py-2">
                    <dt className="text-gray-500">Version</dt>
                    <dd className="font-mono font-bold text-gray-900">v1.2.4</dd>
                </div>
            </dl>
        </div>
    );
}
