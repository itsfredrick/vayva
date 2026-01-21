"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Icon, Button } from "@vayva/ui";
import { ConversationList } from "@/components/whatsapp/conversation-list";
import { ChatWindowContainer } from "@/components/whatsapp/ChatWindowContainer";
import { WaAgentService } from "@/services/wa-agent";
export default function SupportPage() {
    const [activeTab, setActiveTab] = useState("tickets");
    // Data States
    const [tickets, setTickets] = useState([]);
    const [conversations, setConversations] = useState([]);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    // Loading States
    const [loading, setLoading] = useState(true);
    const [waLoading, setWaLoading] = useState(false);
    // Modals
    const [isCreateOpen, setCreateOpen] = useState(false);
    // Fetch Tickets
    useEffect(() => {
        if (activeTab === "tickets") {
            setLoading(true);
            fetch("/api/merchant/support/tickets")
                .then((res) => res.json())
                .then((data) => {
                setTickets(Array.isArray(data) ? data : []);
                setLoading(false);
            })
                .catch(() => setLoading(false));
        }
    }, [activeTab, isCreateOpen]);
    // Fetch WhatsApp
    useEffect(() => {
        if (activeTab === "whatsapp") {
            setWaLoading(true);
            WaAgentService.getConversations()
                .then((data) => {
                setConversations(data);
                setWaLoading(false);
            })
                .catch(() => setWaLoading(false));
        }
    }, [activeTab]);
    return (_jsxs("div", { className: "h-[calc(100vh-6rem)] flex flex-col", children: [_jsxs("div", { className: "px-6 py-4 flex justify-between items-center border-b border-gray-100 bg-white", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold", children: "Support & Feedback" }), _jsx("p", { className: "text-gray-500 text-sm", children: "Manage tickets and customer conversations." })] }), _jsx("div", { className: "flex bg-gray-100 p-1 rounded-lg", children: ["tickets", "whatsapp", "settings"].map((tab) => (_jsx(Button, { onClick: () => setActiveTab(tab), className: `px-4 py-2 text-sm font-bold capitalize rounded-md transition-all ${activeTab === tab
                                ? "bg-white text-black shadow-sm"
                                : "text-gray-500 hover:text-gray-900"}`, children: tab === "whatsapp" ? "WhatsApp Inbox" : tab }, tab))) }), activeTab === "tickets" && (_jsxs(Button, { onClick: () => setCreateOpen(true), className: "flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-medium", children: [_jsx(Icon, { name: "Plus", size: 16 }), "New Ticket"] }))] }), _jsxs("div", { className: "flex-1 overflow-hidden bg-gray-50", children: [activeTab === "tickets" && (_jsx("div", { className: "p-6 h-full overflow-y-auto", children: _jsx("div", { className: "max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden", children: loading ? (_jsx("div", { className: "p-8 text-center text-gray-400", children: "Loading tickets..." })) : tickets.length === 0 ? (_jsxs("div", { className: "p-12 text-center", children: [_jsx("div", { className: "w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3", children: _jsx(Icon, { name: "LifeBuoy", size: 24, className: "text-gray-400" }) }), _jsx("h3", { className: "font-bold text-gray-900", children: "No tickets yet" }), _jsx("p", { className: "text-gray-500 text-sm mt-1", children: "Found a bug or have a request? Let us know." })] })) : (_jsx("div", { className: "divide-y divide-gray-100", children: tickets.map((t) => (_jsxs("div", { className: "p-4 hover:bg-gray-50 flex justify-between items-center cursor-pointer", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${t.status === "open" ? "bg-green-500" : "bg-gray-300"}` }), _jsx("h4", { className: "font-medium text-sm", children: t.subject }), _jsx("span", { className: "text-xs text-gray-400 uppercase border px-1 rounded", children: t.type })] }), _jsx("p", { className: "text-gray-500 text-xs line-clamp-1", children: t.description })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "text-xs text-gray-400 block", children: new Date(t.updatedAt).toLocaleDateString() }), _jsx("span", { className: "text-xs font-semibold", children: t.status })] })] }, t.id))) })) }) })), activeTab === "whatsapp" && (_jsxs("div", { className: "flex h-full border-t border-gray-200 bg-white", children: [_jsx("div", { className: "w-80 border-r border-gray-200 h-full flex flex-col", children: _jsx(ConversationList, { conversations: conversations, selectedId: selectedConversationId, onSelect: setSelectedConversationId, isLoading: waLoading }) }), _jsx("div", { className: "flex-1 h-full bg-gray-50", children: selectedConversationId ? (_jsx(ChatWindowContainer, { conversationId: selectedConversationId, conversations: conversations })) : (_jsxs("div", { className: "h-full flex flex-col items-center justify-center text-gray-400", children: [_jsx(Icon, { name: "MessageCircle", size: 48, className: "mb-4 opacity-20" }), _jsx("p", { children: "Select a conversation to start chatting" })] })) })] })), activeTab === "settings" && _jsx(SettingsView, {})] }), isCreateOpen && (_jsx(CreateTicketModal, { onClose: () => setCreateOpen(false) }))] }));
}
function SettingsView() {
    const [settings, setSettings] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [newClaim, setNewClaim] = useState("");
    useEffect(() => {
        async function load() {
            try {
                const [s, p] = await Promise.all([
                    WaAgentService.getSettings(),
                    WaAgentService.getProfile(),
                ]);
                setSettings(s);
                setProfile(p);
            }
            catch (e) {
                console.error("Failed to load settings", e);
            }
            finally {
                setLoading(false);
            }
        }
        load();
    }, []);
    async function handleSave() {
        if (!settings || !profile)
            return;
        setSaving(true);
        try {
            await Promise.all([
                WaAgentService.updateSettings(settings),
                WaAgentService.updateProfile(profile),
            ]);
            // Optional: Toast success
        }
        catch (e) {
            console.error("Failed to save", e);
        }
        finally {
            setSaving(false);
        }
    }
    function toggleSetting(key) {
        if (!settings)
            return;
        setSettings({ ...settings, [key]: !settings[key] });
    }
    function addClaim() {
        if (!newClaim.trim() || !profile)
            return;
        setProfile({
            ...profile,
            prohibitedClaims: [...(profile.prohibitedClaims || []), newClaim.trim()],
        });
        setNewClaim("");
    }
    function removeClaim(idx) {
        if (!profile)
            return;
        const next = [...(profile.prohibitedClaims || [])];
        next.splice(idx, 1);
        setProfile({ ...profile, prohibitedClaims: next });
    }
    if (loading)
        return _jsx("div", { className: "p-8 text-center text-gray-400", children: "Loading settings..." });
    if (!settings || !profile)
        return _jsx("div", { className: "p-8 text-center text-red-500", children: "Failed to load settings. WhatsApp may not be enabled." });
    return (_jsxs("div", { className: "p-6 max-w-3xl mx-auto overflow-y-auto h-full pb-20", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("h3", { className: "font-bold text-xl", children: "Support & Safety Settings" }), _jsx(Button, { onClick: handleSave, disabled: saving, className: "px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-bold", children: saving ? "Saving..." : "Save Changes" })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "bg-white p-6 rounded-lg border border-gray-200 shadow-sm", children: [_jsx("h4", { className: "font-bold text-sm uppercase text-gray-500 mb-4", children: "General Configuration" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: "Enable WhatsApp Integration" }), _jsx("p", { className: "text-xs text-gray-500", children: "Allow customers to contact you via WhatsApp" })] }), _jsx(Button, { "aria-label": "Toggle WhatsApp integration", onClick: () => toggleSetting("enabled"), className: `w-10 h-6 rounded-full transition-colors relative ${settings.enabled ? "bg-green-500" : "bg-gray-200"}`, children: _jsx("div", { className: `w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.enabled ? "left-5" : "left-1"}` }) })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: "Human Handoff" }), _jsx("p", { className: "text-xs text-gray-500", children: "Allow AI to escalate complex queries to humans" })] }), _jsx(Button, { "aria-label": "Toggle Human Handoff", onClick: () => toggleSetting("humanHandoffEnabled"), className: `w-10 h-6 rounded-full transition-colors relative ${settings.humanHandoffEnabled ? "bg-green-500" : "bg-gray-200"}`, children: _jsx("div", { className: `w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.humanHandoffEnabled ? "left-5" : "left-1"}` }) })] }), _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("p", { className: "font-medium text-sm", children: "Auto-Reply Outside Hours" }), _jsx("p", { className: "text-xs text-gray-500", children: "Send an automated message when closed" })] }), _jsx(Button, { "aria-label": "Toggle Auto-Reply", onClick: () => toggleSetting("autoReplyOutsideHours"), className: `w-10 h-6 rounded-full transition-colors relative ${settings.autoReplyOutsideHours ? "bg-green-500" : "bg-gray-200"}`, children: _jsx("div", { className: `w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${settings.autoReplyOutsideHours ? "left-5" : "left-1"}` }) })] })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-lg border border-gray-200 shadow-sm", children: [_jsx("h4", { className: "font-bold text-sm uppercase text-gray-500 mb-4", children: "AI Safety Filters" }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "Configure specific claims or topics the AI should refuse to discuss." }), _jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx("input", { value: newClaim, onChange: (e) => setNewClaim(e.target.value), placeholder: "e.g. 'We offer medical advice'", className: "flex-1 border p-2 rounded text-sm", onKeyDown: (e) => e.key === "Enter" && addClaim() }), _jsx(Button, { onClick: addClaim, className: "px-3 py-2 bg-gray-100 font-bold text-xs rounded hover:bg-gray-200", children: "ADD" })] }), _jsxs("div", { className: "space-y-2", children: [profile.prohibitedClaims?.map((claim, idx) => (_jsxs("div", { className: "flex justify-between items-center bg-red-50 p-2 rounded border border-red-100", children: [_jsx("span", { className: "text-sm text-red-700", children: claim }), _jsx(Button, { title: "Remove claim", "aria-label": "Remove claim", onClick: () => removeClaim(idx), className: "text-red-400 hover:text-red-700", children: _jsx(Icon, { name: "X", size: 14 }) })] }, idx))), (!profile.prohibitedClaims || profile.prohibitedClaims.length === 0) && (_jsx("p", { className: "text-xs text-gray-400 italic", children: "No prohibited claims configured." }))] })] })] })] }));
}
function CreateTicketModal({ onClose }) {
    const [submitting, setSubmitting] = useState(false);
    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        const form = e.target;
        const data = {
            subject: form.elements.namedItem("subject").value,
            type: form.elements.namedItem("type").value,
            description: form.elements.namedItem("description").value,
        };
        await fetch("/api/merchant/support/tickets", {
            method: "POST",
            body: JSON.stringify(data),
        });
        setSubmitting(false);
        onClose();
    }
    return (_jsx("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: _jsxs("div", { className: "bg-white rounded-xl shadow-xl w-full max-w-md p-6", children: [_jsx("h2", { className: "text-lg font-bold mb-4", children: "New Support Ticket" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "ticket-type", className: "block text-xs font-bold uppercase text-gray-500 mb-1", children: "Type" }), _jsxs("select", { id: "ticket-type", name: "type", className: "w-full p-2 border rounded-lg text-sm bg-gray-50", children: [_jsx("option", { value: "bug", children: "Report a Bug" }), _jsx("option", { value: "feature", children: "Feature Request" }), _jsx("option", { value: "billing", children: "Billing Issue" }), _jsx("option", { value: "other", children: "Other" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase text-gray-500 mb-1", children: "Subject" }), _jsx("input", { name: "subject", required: true, className: "w-full p-2 border rounded-lg text-sm", placeholder: "Brief summary" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold uppercase text-gray-500 mb-1", children: "Description" }), _jsx("textarea", { name: "description", required: true, className: "w-full p-2 border rounded-lg text-sm h-32", placeholder: "Details..." })] }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx(Button, { type: "button", onClick: onClose, className: "flex-1 py-2 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-lg", children: "Cancel" }), _jsx(Button, { disabled: submitting, type: "submit", className: "flex-1 py-2 text-sm font-bold text-white bg-black rounded-lg hover:bg-gray-800", children: submitting ? "Sending..." : "Submit Ticket" })] })] })] }) }));
}
