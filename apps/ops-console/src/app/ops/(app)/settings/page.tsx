"use client";

import React, { useState } from "react";
import { Settings, Shield, Zap, AlertTriangle, Save } from "lucide-react";
import { toast } from "sonner";

export default function GlobalSettingsPage() {
    const [settings, setSettings] = useState({
        aiEnabled: true,
        evolutionApiEnabled: true,
        maintenanceMode: false
    });

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = async () => {
        const confirmSave = confirm("Are you sure you want to update global system settings?");
        if (!confirmSave) return;

        try {
            // Mock API call to save config (Redis/DB)
            // await fetch("/api/ops/config/global", { method: "POST", body: JSON.stringify(settings) });

            toast.promise(new Promise(r => setTimeout(r, 1000)), {
                loading: "Applying changes across cluster...",
                success: "System configuration updated.",
                error: "Failed to update configuration"
            });
        } catch (e) {
            toast.error("Error saving settings");
        }
    };

    return (
        <div className="p-8 space-y-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Settings className="w-8 h-8 text-gray-700" />
                        System Settings
                    </h1>
                    <p className="text-gray-500 mt-1">Global controls and emergency switches.</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="grid gap-6">

                {/* AI & Automation */}
                <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-amber-500" />
                        AI & Automation
                    </h2>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-gray-900">Global AI Agent</div>
                                <p className="text-sm text-gray-500">Master switch for all automated AI responses (Groq/OpenAI).</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.aiEnabled}
                                    onChange={() => handleToggle("aiEnabled")}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        <div className="border-t border-gray-100 pt-6 flex items-center justify-between">
                            <div>
                                <div className="font-semibold text-gray-900">Evolution API Integration</div>
                                <p className="text-sm text-gray-500">Enable/Disable WhatsApp message sending and receiving.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={settings.evolutionApiEnabled}
                                    onChange={() => handleToggle("evolutionApiEnabled")}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                            </label>
                        </div>
                    </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <h2 className="text-xl font-bold text-red-900 mb-6 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-red-600" />
                        Emergency Controls
                    </h2>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-semibold text-red-900">Maintenance Mode</div>
                            <p className="text-sm text-red-700">Deny access to Merchant Dashboard for all users (Emergency only).</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={settings.maintenanceMode}
                                onChange={() => handleToggle("maintenanceMode")}
                            />
                            <div className="w-11 h-6 bg-red-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </section>
            </div>
        </div>
    );
}
