import { FEATURES } from "@/lib/env-validation";
export const WaAgentService = {
    // 1. Settings & Profile
    getSettings: async () => {
        if (!FEATURES.WHATSAPP_ENABLED) {
            throw new Error("WhatsApp integration is not configured");
        }
        const res = await fetch("/api/seller/ai/whatsapp-settings");
        const data = await res.json();
        return (data.data || {
            enabled: false,
            businessHours: {},
            autoReplyOutsideHours: false,
            catalogMode: "StrictCatalogOnly",
            allowImageUnderstanding: false,
            orderStatusAccess: true,
            paymentGuidanceMode: "ExplainAndLink",
            maxDailyMsgsPerUser: 50,
            humanHandoffEnabled: true,
        });
    },
    updateSettings: async (settings: any) => {
        if (!FEATURES.WHATSAPP_ENABLED) {
            throw new Error("WhatsApp integration is not configured");
        }
        const res = await fetch("/api/seller/ai/whatsapp-settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(settings),
        });
        return res.ok;
    },
    getProfile: async () => {
        if (!FEATURES.WHATSAPP_ENABLED) {
            throw new Error("WhatsApp integration is not configured");
        }
        const res = await fetch("/api/seller/ai/profile");
        const data = await res.json();
        return (data.data || {
            agentName: "Assistant",
            tonePreset: "Friendly",
            greetingTemplate: "Hi {customer_name}! How can I help?",
            signoffTemplate: "Best regards!",
            persuasionLevel: 1,
            brevityMode: "Short",
            oneQuestionRule: true,
            prohibitedClaims: [],
        });
    },
    updateProfile: async (profile: any) => {
        if (!FEATURES.WHATSAPP_ENABLED) {
            throw new Error("WhatsApp integration is not configured");
        }
        const res = await fetch("/api/seller/ai/profile", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(profile),
        });
        return res.ok;
    },
    // 2. Inbox
    getConversations: async () => {
        if (!FEATURES.WHATSAPP_ENABLED) {
            // Return empty instead of error to prevent UI crash
            return [];
        }
        try {
            const res = await fetch("/api/support/conversations");
            if (!res.ok)
                return [];
            const json = await res.json();
            return json.data || [];
        }
        catch (e: any) {
            console.error("Failed to fetch conversations", e);
            return [];
        }
    },
    // 3. Test Message
    sendTestMessage: async (text: any) => {
        if (!FEATURES.WHATSAPP_ENABLED) {
            throw new Error("WhatsApp integration is not configured");
        }
        const res = await fetch("/api/ai/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: [{ role: "user", content: text }] }),
        });
        return res.json();
    },
    // 4. Approvals
    getApprovals: async () => {
        if (!FEATURES.WHATSAPP_ENABLED)
            return [];
        try {
            const res = await fetch("/api/support/approvals");
            if (!res.ok)
                return [];
            const json = await res.json();
            return json.data || [];
        }
        catch (e: any) {
            return [];
        }
    },
    actionApproval: async (id: any, action: any) => {
        if (!FEATURES.WHATSAPP_ENABLED)
            throw new Error("Not configured");
        const res = await fetch(`/api/support/approvals/${id}/action`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action })
        });
        return res.ok;
    },
    // 5. Inbox Pendings
    getThread: async (threadId: any) => {
        if (!FEATURES.WHATSAPP_ENABLED)
            return null;
        try {
            const res = await fetch(`/api/support/conversations/${threadId}`);
            if (!res.ok)
                return null;
            const json = await res.json();
            return json.data;
        }
        catch (e: any) {
            return null;
        }
    },
    getKnowledgeBase: async () => {
        if (!FEATURES.WHATSAPP_ENABLED)
            return [];
        try {
            const res = await fetch("/api/seller/ai/knowledge-base");
            if (!res.ok)
                return [];
            const json = await res.json();
            const entries = json.data || [];
            // Map knowledge base entries to UI interface
            return entries.map((e: any) => ({
                id: e.id,
                question: e.sourceType === "FILE" ? "Document Upload" : "Manual Entry",
                answer: e.content.length > 100 ? e.content.substring(0, 100) + "..." : e.content,
                fullContent: e.content,
                tags: [e.sourceType],
                category: "General",
                status: "ACTIVE"
            }));
        }
        catch (e: any) {
            console.error("Failed to load KB", e);
            return [];
        }
    },
};
