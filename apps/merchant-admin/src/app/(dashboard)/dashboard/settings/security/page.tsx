"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Shield, Key, Smartphone, Loader2, Trash2, Plus } from "lucide-react";
import { Button } from "@vayva/ui";

export default function SecurityPage() {
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6 max-w-4xl">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">Security</h1>
                <p className="text-slate-500">Manage your password, API keys, and active sessions.</p>
            </div>

            <div className="grid gap-6">
                {/* Password Change */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Shield className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-medium text-slate-900 mb-1">Password</h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Update your password to keep your account secure.
                            </p>
                            <Button
                                variant="link"
                                onClick={() => toast.success("Password reset email sent.")}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:underline px-0 h-auto"
                            >
                                Change Password
                            </Button>
                        </div>
                    </div>
                </div>

                {/* API Keys */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                                <Key className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-slate-900">API Keys</h3>
                                <p className="text-slate-500 text-sm">Manage keys for accessing the Vayva API.</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.error("API Key generation is limited to Owner role.")}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-sm font-medium transition-colors border-0"
                        >
                            <Plus className="h-4 w-4" />
                            Create Key
                        </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">Prefix</th>
                                    <th className="px-4 py-2">Created</th>
                                    <th className="px-4 py-2 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="bg-slate-50/50">
                                    <td className="px-4 py-3 text-slate-500 italic" colSpan={4}>No active API keys found.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Active Sessions */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Smartphone className="h-6 w-6" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-medium text-slate-900 mb-1">Active Sessions</h3>
                            <p className="text-slate-500 text-sm mb-4">
                                Devices currently logged into your account.
                            </p>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">Current Session</p>
                                            <p className="text-xs text-slate-500">Just now • {typeof navigator !== 'undefined' ? navigator.platform : 'Unknown Device'}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono">THIS DEVICE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
