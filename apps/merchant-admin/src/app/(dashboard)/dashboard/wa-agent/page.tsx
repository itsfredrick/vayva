"use client";

import { useEffect, useState } from "react";
import { Button, Icon, Input, Switch } from "@vayva/ui";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const TONES = [
    { value: "friendly", label: "Friendly & Casual" },
    { value: "professional", label: "Professional" },
    { value: "urgent", label: "Direct & Concise" },
    { value: "luxurious", label: "Luxurious & Elegant" },
];

const LANGUAGES = [
    { value: "en", label: "English" },
    { value: "fr", label: "French" },
    { value: "es", label: "Spanish" },
    { value: "pidgin", label: "Pidgin English" },
];

export default function WhatsappSettingsPage() {
    const [status, setStatus] = useState<"disconnected" | "connecting" | "connected">("disconnected");
    const [qrCode, setQrCode] = useState<string | null>(null);
    const [aiEnabled, setAiEnabled] = useState(false);

    // Persona State
    const [persona, setPersona] = useState({
        name: "Vayva Assistant",
        tone: "friendly",
        language: "en"
    });

    const [testInput, setTestInput] = useState("");
    const [testResponse, setTestResponse] = useState<string | null>(null);
    const [isTesting, setIsTesting] = useState(false);

    const handleConnect = async () => {
        setStatus("connecting");
        try {
            await fetch("/api/whatsapp/instance", { method: "POST" });
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

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (qrCode) {
            timer = setTimeout(() => {
                setStatus("connected");
                setQrCode(null);
                setAiEnabled(true);
            }, 5000);
        }
        return () => clearTimeout(timer);
    }, [qrCode]);

    const handleSavePersona = async () => {
        toast.success("Persona settings saved!");
        // API call would go here: await fetch('/api/whatsapp/config', { method: 'POST', body: JSON.stringify({ aiConfig: persona }) })
    };

    const handleTestSend = async () => {
        if (!testInput.trim()) return;
        setIsTesting(true);
        setTestResponse(null);

        // Simulate API call
        setTimeout(() => {
            const responses: unknown = {
                friendly: `Hey there! 🌟 I'm ${persona.name}. Thanks for reaching out! How can I help you today?`,
                professional: `Hello. This is ${persona.name}. How may I assist you with your inquiry?`,
                urgent: `${persona.name} here. State your request.`,
                luxurious: `Greetings. ${persona.name} at your service. Indulge in our collection.`
            };
            setTestResponse(responses[persona.tone] || responses.friendly);
            setIsTesting(false);
        }, 1200);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">WhatsApp AI Agent</h1>
                    <p className="text-gray-500">
                        Configure your 24/7 automated sales assistant.
                    </p>
                </div>
                {status === "connected" && <Badge variant="default">Active</Badge>}
            </header>

            <div className="grid md:grid-cols-12 gap-8">
                {/* Left Col: Status & Persona (4 Cols) */}
                <div className="md:col-span-4 space-y-6">
                    {/* Connection Card */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-lg mb-4">Connection</h3>

                        {status === "disconnected" && (
                            <div className="text-center">
                                <Button onClick={handleConnect} className="w-full bg-green-600 hover:bg-green-700">Link WhatsApp</Button>
                            </div>
                        )}
                        {status === "connecting" && (
                            <div className="text-center">
                                {qrCode ? (
                                    <div className="space-y-2">
                                        <p className="text-xs">Scan QR</p>
                                        <img src={qrCode} alt="WhatsApp QR Code" className="w-32 h-32 mx-auto border-4 border-black rounded-lg" />
                                    </div>
                                ) : (
                                    <Icon name="Loader" className="animate-spin" />
                                )}
                            </div>
                        )}
                        {status === "connected" && (
                            <div className="flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg">
                                <Icon name="Check" className="w-4 h-4" />
                                <span className="text-sm font-medium">Linked & Ready</span>
                            </div>
                        )}
                    </div>

                    {/* Persona Settings */}
                    <div className={`bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 ${status !== 'connected' ? 'opacity-50 pointer-events-none' : ''}`}>
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Icon name="User" className="w-4 h-4" /> Persona
                        </h3>

                        <div className="space-y-2">
                            <Label>Agent Name</Label>
                            <Input value={persona.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPersona({ ...persona, name: e.target.value })} />
                        </div>

                        <div className="space-y-2">
                            <Label>Tone</Label>
                            <Select value={persona.tone} onValueChange={(v: string) => setPersona({ ...persona, tone: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TONES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select value={persona.language} onValueChange={(v: string) => setPersona({ ...persona, language: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button variant="outline" className="w-full" onClick={handleSavePersona}>Save Settings</Button>
                    </div>
                </div>

                {/* Right Col: AI Config & Playground (8 Cols) */}
                <div className="md:col-span-8 space-y-6">
                    {/* Feature Toggle */}
                    <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg flex items-center gap-2">
                                <Icon name="Bot" /> AI Auto-Reply
                            </h3>
                            <p className="text-indigo-200 text-sm">Automatically respond to customer inquiries 24/7.</p>
                        </div>
                        <Switch checked={aiEnabled} onCheckedChange={setAiEnabled} />
                    </div>

                    {/* Playground */}
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
                        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                            <h3 className="font-medium text-sm text-gray-700">Test Playground</h3>
                            <Badge variant="outline">Preview Mode</Badge>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50">
                            {/* User Msg (Simulated) */}
                            {testInput && isTesting && (
                                <div className="flex justify-end">
                                    <div className="bg-green-100 text-green-900 p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm">
                                        {testInput}
                                    </div>
                                </div>
                            )}

                            {/* AI Response */}
                            {isTesting && !testResponse && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border shadow-sm flex gap-2 items-center">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" />
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                                    </div>
                                </div>
                            )}
                            {testResponse && (
                                <div className="flex justify-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">AI</div>
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none border shadow-sm max-w-[80%] text-gray-800">
                                        {testResponse}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t flex gap-2">
                            <Input
                                placeholder="Type a message to test..."
                                value={testInput}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTestInput(e.target.value)}
                                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleTestSend()}
                            />
                            <Button onClick={handleTestSend} disabled={isTesting || !testInput}>Send</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
