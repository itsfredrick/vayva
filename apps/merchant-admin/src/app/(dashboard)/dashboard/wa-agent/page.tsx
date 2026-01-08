
"use client";

import React, { useEffect, useState } from "react";
import { Button, Icon } from "@vayva/ui";
import { Switch } from "@/components/ui/Switch";

export default function WhatsappSettingsPage() {
    const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [aiEnabled, setAiEnabled] = useState(false);

    const handleConnect = async () => {
        setStatus("connecting");
        try {
            // First create instance (idempotent usually)
            await fetch("/api/whatsapp/instance", { method: "POST" });

            // Then get QR
            const res = await fetch("/api/whatsapp/instance");
            const data = await res.json();

            if (data.base64 || data.qrcode) {
                setQrCode(data.base64 || data.qrcode);
            }
        } catch (error) {
            console.error("Connect failed", error);
            setStatus("disconnected");
        }
    };

    // Simulate connection success after some time if showing QR
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (qrCode) {
            timer = setTimeout(() => {
                setStatus("connected");
                setQrCode(null);
                setAiEnabled(true);
            }, 5000); // Simulate scan
        }
        return () => clearTimeout(timer);
    }, [qrCode]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">WhatsApp AI Assistant</h1>
                <p className="text-gray-500">
                    Connect your business number to enable 24/7 automated sales.
                </p>
            </header>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Connection Status Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">Connection Status</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${status === "connected" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${status === "connected" ? "bg-green-500" : "bg-gray-400"}`} />
                            {status}
                        </div>
                    </div>

                    {status === "disconnected" && (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Icon name="Smartphone" size={32} className="text-green-600" />
                            </div>
                            <p className="text-gray-600 mb-6">
                                Scan a QR code to link your existing WhatsApp number.
                                <br />No approved API account required.
                            </p>
                            <Button onClick={handleConnect} className="bg-green-600 hover:bg-green-700 text-white w-full h-12 rounded-xl">
                                Connect WhatsApp
                            </Button>
                        </div>
                    )}

                    {status === "connecting" && qrCode && (
                        <div className="text-center py-4 animate-in fade-in">
                            <p className="text-sm font-bold text-gray-900 mb-4">Scan with WhatsApp (Linked Devices)</p>
                            <img src={qrCode} alt="Scan QR" className="mx-auto border-4 border-gray-900 rounded-xl w-64 h-64 object-contain" />
                            <p className="text-xs text-gray-400 mt-4">Refreshing in 5s...</p>
                        </div>
                    )}

                    {status === "connecting" && !qrCode && (
                        <div className="flex flex-col items-center justify-center h-64">
                            <Icon name="Loader" className="animate-spin text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Generating Secure QR...</p>
                        </div>
                    )}

                    {status === "connected" && (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-green-600 text-2xl">
                                ✅
                            </div>
                            <div>
                                <h4 className="font-bold text-green-900">System Linked</h4>
                                <p className="text-xs text-green-700">Your number is active and ready to receive messages.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Configuration */}
                <div className={`space-y-6 transition-opacity ${status !== "connected" ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                    <div className="bg-gradient-to-br from-indigo-900 to-blue-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />

                        <div className="relative z-10">
                            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                                <Icon name="Bot" /> AI Sales Agent
                            </h3>
                            <p className="text-indigo-200 text-sm mb-6">
                                Successfully answers questions about your products and directs customers to checkout.
                            </p>

                            <div className="flex items-center justify-between bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                                <span className="font-bold">Enable Auto-Reply</span>
                                <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4">Notification Settings</h3>
                        <div className="space-y-4">
                            {["Welcome Message", "Order Confirmation", "Shipment Updates"].map(item => (
                                <div key={item} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <span className="text-gray-600 text-sm">{item}</span>
                                    <Switch checked={true} onCheckedChange={() => { }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
