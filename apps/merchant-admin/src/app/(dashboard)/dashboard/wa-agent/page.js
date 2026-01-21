"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Button, Icon, Input } from "@vayva/ui";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
    const [status, setStatus] = useState("disconnected");
    const [qrCode, setQrCode] = useState(null);
    const [aiEnabled, setAiEnabled] = useState(false);
    // Persona State
    const [persona, setPersona] = useState({
        name: "Vayva Assistant",
        tone: "friendly",
        language: "en"
    });
    const [testInput, setTestInput] = useState("");
    const [testResponse, setTestResponse] = useState(null);
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
        }
        catch (error) {
            console.error("Connect failed", error);
            setStatus("disconnected");
        }
    };
    useEffect(() => {
        let timer;
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
        if (!testInput.trim())
            return;
        setIsTesting(true);
        setTestResponse(null);
        // Simulate API call
        setTimeout(() => {
            const responses = {
                friendly: `Hey there! 🌟 I'm ${persona.name}. Thanks for reaching out! How can I help you today?`,
                professional: `Hello. This is ${persona.name}. How may I assist you with your inquiry?`,
                urgent: `${persona.name} here. State your request.`,
                luxurious: `Greetings. ${persona.name} at your service. Indulge in our collection.`
            };
            setTestResponse(responses[persona.tone] || responses.friendly);
            setIsTesting(false);
        }, 1200);
    };
    return (_jsxs("div", { className: "max-w-6xl mx-auto p-6 space-y-8", children: [_jsxs("header", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-gray-900", children: "WhatsApp AI Agent" }), _jsx("p", { className: "text-gray-500", children: "Configure your 24/7 automated sales assistant." })] }), status === "connected" && _jsx(Badge, { variant: "default", children: "Active" })] }), _jsxs("div", { className: "grid md:grid-cols-12 gap-8", children: [_jsxs("div", { className: "md:col-span-4 space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-sm", children: [_jsx("h3", { className: "font-bold text-lg mb-4", children: "Connection" }), status === "disconnected" && (_jsx("div", { className: "text-center", children: _jsx(Button, { onClick: handleConnect, className: "w-full bg-green-600 hover:bg-green-700", children: "Link WhatsApp" }) })), status === "connecting" && (_jsx("div", { className: "text-center", children: qrCode ? (_jsxs("div", { className: "space-y-2", children: [_jsx("p", { className: "text-xs", children: "Scan QR" }), _jsx("img", { src: qrCode, alt: "WhatsApp QR Code", className: "w-32 h-32 mx-auto border-4 border-black rounded-lg" })] })) : (_jsx(Icon, { name: "Loader", className: "animate-spin" })) })), status === "connected" && (_jsxs("div", { className: "flex items-center gap-2 text-green-700 bg-green-50 p-3 rounded-lg", children: [_jsx(Icon, { name: "Check", className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: "Linked & Ready" })] }))] }), _jsxs("div", { className: `bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4 ${status !== 'connected' ? 'opacity-50 pointer-events-none' : ''}`, children: [_jsxs("h3", { className: "font-bold text-lg flex items-center gap-2", children: [_jsx(Icon, { name: "User", className: "w-4 h-4" }), " Persona"] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Agent Name" }), _jsx(Input, { value: persona.name, onChange: (e) => setPersona({ ...persona, name: e.target.value }) })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Tone" }), _jsxs(Select, { value: persona.tone, onValueChange: (v) => setPersona({ ...persona, tone: v }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: TONES.map(t => _jsx(SelectItem, { value: t.value, children: t.label }, t.value)) })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { children: "Language" }), _jsxs(Select, { value: persona.language, onValueChange: (v) => setPersona({ ...persona, language: v }), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsx(SelectContent, { children: LANGUAGES.map(l => _jsx(SelectItem, { value: l.value, children: l.label }, l.value)) })] })] }), _jsx(Button, { variant: "outline", className: "w-full", onClick: handleSavePersona, children: "Save Settings" })] })] }), _jsxs("div", { className: "md:col-span-8 space-y-6", children: [_jsxs("div", { className: "bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-6 rounded-2xl shadow-lg flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h3", { className: "font-bold text-lg flex items-center gap-2", children: [_jsx(Icon, { name: "Bot" }), " AI Auto-Reply"] }), _jsx("p", { className: "text-indigo-200 text-sm", children: "Automatically respond to customer inquiries 24/7." })] }), _jsx(Switch, { checked: aiEnabled, onCheckedChange: setAiEnabled })] }), _jsxs("div", { className: "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[500px]", children: [_jsxs("div", { className: "p-4 border-b bg-gray-50 flex justify-between items-center", children: [_jsx("h3", { className: "font-medium text-sm text-gray-700", children: "Test Playground" }), _jsx(Badge, { variant: "outline", children: "Preview Mode" })] }), _jsxs("div", { className: "flex-1 p-6 space-y-4 overflow-y-auto bg-slate-50", children: [testInput && isTesting && (_jsx("div", { className: "flex justify-end", children: _jsx("div", { className: "bg-green-100 text-green-900 p-3 rounded-2xl rounded-tr-none max-w-[80%] shadow-sm", children: testInput }) })), isTesting && !testResponse && (_jsx("div", { className: "flex justify-start", children: _jsxs("div", { className: "bg-white p-3 rounded-2xl rounded-tl-none border shadow-sm flex gap-2 items-center", children: [_jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce" }), _jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75" }), _jsx("span", { className: "w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" })] }) })), testResponse && (_jsxs("div", { className: "flex justify-start gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700", children: "AI" }), _jsx("div", { className: "bg-white p-3 rounded-2xl rounded-tl-none border shadow-sm max-w-[80%] text-gray-800", children: testResponse })] }))] }), _jsxs("div", { className: "p-4 bg-white border-t flex gap-2", children: [_jsx(Input, { placeholder: "Type a message to test...", value: testInput, onChange: (e) => setTestInput(e.target.value), onKeyDown: (e) => e.key === 'Enter' && handleTestSend() }), _jsx(Button, { onClick: handleTestSend, disabled: isTesting || !testInput, children: "Send" })] })] })] })] })] }));
}
