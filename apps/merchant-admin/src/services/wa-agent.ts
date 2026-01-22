import { FEATURES } from "@/lib/env-validation";

export interface WaSettings {
  enabled: boolean;
  businessHours: unknown;
  autoReplyOutsideHours: boolean;
  outsideHoursMessage: string;
  catalogMode: string;
  allowImageUnderstanding: boolean;
  orderStatusAccess: boolean;
  paymentGuidanceMode: string;
  maxDailyMsgsPerUser: number;
  humanHandoffEnabled: boolean;
  handoffDestination: string;
}

export interface AiProfile {
  agentName: string;
  tonePreset: string;
  greetingTemplate: string;
  signoffTemplate: string;
  persuasionLevel: number;
  brevityMode: string;
  oneQuestionRule: boolean;
  prohibitedClaims: string[];
}

export const WaAgentService = {
  // 1. Settings & Profile
  getSettings: async (): Promise<WaSettings> => {
    if (!FEATURES.WHATSAPP_ENABLED) {
      throw new Error("WhatsApp integration is not configured");
    }

    const res = await fetch("/api/seller/ai/whatsapp-settings");
    const data = await res.json();
    return (
      data.data || {
        enabled: false,
        businessHours: {},
        autoReplyOutsideHours: false,
        catalogMode: "StrictCatalogOnly",
        allowImageUnderstanding: false,
        orderStatusAccess: true,
        paymentGuidanceMode: "ExplainAndLink",
        maxDailyMsgsPerUser: 50,
        humanHandoffEnabled: true,
      }
    );
  },

  updateSettings: async (settings: WaSettings): Promise<boolean> => {
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

  getProfile: async (): Promise<AiProfile> => {
    if (!FEATURES.WHATSAPP_ENABLED) {
      throw new Error("WhatsApp integration is not configured");
    }

    const res = await fetch("/api/seller/ai/profile");
    const data = await res.json();
    return (
      data.data || {
        agentName: "Assistant",
        tonePreset: "Friendly",
        greetingTemplate: "Hi {customer_name}! How can I help?",
        signoffTemplate: "Best regards!",
        persuasionLevel: 1,
        brevityMode: "Short",
        oneQuestionRule: true,
        prohibitedClaims: [],
      }
    );
  },

  updateProfile: async (profile: AiProfile): Promise<boolean> => {
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
  getConversations: async (): Promise<unknown[]> => {
    if (!FEATURES.WHATSAPP_ENABLED) {
      // Return empty instead of error to prevent UI crash
      return [];
    }

    try {
      const res = await fetch("/api/support/conversations");
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      console.error("Failed to fetch conversations", e);
      return [];
    }
  },

  // 3. Test Message
  sendTestMessage: async (text: string) => {
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
  getApprovals: async (): Promise<WaApproval[]> => {
    if (!FEATURES.WHATSAPP_ENABLED) return [];
    try {
      const res = await fetch("/api/support/approvals");
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch (_error) {
      return [];
    }
  },

  actionApproval: async (id: string, action: "approve" | "reject") => {
    if (!FEATURES.WHATSAPP_ENABLED) throw new Error("Not configured");
    const res = await fetch(`/api/support/approvals/${id}/action`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action })
    });
    return res.ok;
  },

  // 5. Inbox Pendings
  getThread: async (threadId: string): Promise<WaThread | null> => {
    if (!FEATURES.WHATSAPP_ENABLED) return null;
    try {
      const res = await fetch(`/api/support/conversations/${threadId}`);
      if (!res.ok) return null;
      const json = await res.json();
      return json.data;
    } catch (_error) {
      return null;
    }
  },

  getKnowledgeBase: async (): Promise<KbItem[]> => {
    if (!FEATURES.WHATSAPP_ENABLED) return [];
    try {
      const res = await fetch("/api/seller/ai/knowledge-base");
      if (!res.ok) return [];
      const json = await res.json();
      const entries = json.data || [];

      // Map knowledge base entries to UI interface
      // Map knowledge base entries to UI interface
      return entries.map((eStr: unknown) => {
        const e = eStr as Record<string, unknown>;
        return {
          id: e.id as string,
          question: (e.sourceType as string) === "FILE" ? "Document Upload" : "Manual Entry",
          answer: (e.content as string).length > 100 ? (e.content as string).substring(0, 100) + "..." : (e.content as string),
          fullContent: e.content as string,
          tags: [e.sourceType as string],
          category: "General",
          status: "ACTIVE"
        };
      });
    } catch (e) {
      console.error("Failed to load KB", e);
      return [];
    }
  },
};

export interface WaApproval {
  id: string;
  type: string;
  status: string;
  content: string;
  timestamp: string;
  // UI Alignment (mandatory where used without check)
  description: string;
  customerName: string;
  risk: "HIGH" | "MEDIUM" | "LOW" | "high" | "medium" | "low"; // Allow both cases
  createdTime: string;
}

export interface WaThread {
  id: string;
  customerName: string;
  customerPhone: string;
  lastMessage: string;
  lastMessageTime: string;
  status: string;
  unreadCount: number;
  messages: unknown[]; // Mandatory array
  aiSuggestions?: {
    reply?: string;
    action?: {
      description: string;
      risk: string;
    };
  };
}

export interface WaMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export interface KbItem {
  id: string;
  question: string;
  answer: string;
  tags: string[];
  // UI Alignment
  category: string;
  status: string; // Allow 'synced', 'ACTIVE', etc.
}
