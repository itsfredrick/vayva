import { describe, it, expect, vi, beforeEach } from "vitest";
import { SalesAgent } from "./sales-agent";
import { GroqClient } from "./groq-client";
import { MerchantBrainService } from "./merchant-brain.service";
import { prisma } from "@vayva/db";

// Test dependencies
const { mockChatCompletion } = vi.hoisted(() => ({
    mockChatCompletion: vi.fn()
}));

vi.mock("./groq-client", () => {
    return {
        GroqClient: vi.fn().mockImplementation(() => ({
            chatCompletion: mockChatCompletion,
            client: { apiKey: "test-key" }
        }))
    };
});


vi.mock("./merchant-brain.service");
vi.mock("../support/escalation.service", () => ({
    EscalationService: {
        triggerHandoff: vi.fn().mockResolvedValue({}),
    },
}));


vi.mock("@vayva/db", () => ({
    prisma: {
        store: { findUnique: vi.fn() },
        merchantAiProfile: { findUnique: vi.fn() },
        objectionEvent: { create: vi.fn() },
        aiUsageEvent: { create: vi.fn() }
    },
}));


vi.mock("./ai-usage.service", () => ({
    AiUsageService: {
        checkLimits: vi.fn().mockResolvedValue({ allowed: true }),
        logUsage: vi.fn().mockResolvedValue({}),
    },
}));

vi.mock("../governance/data-governance.service", () => ({
    DataGovernanceService: {
        logAiTrace: vi.fn().mockResolvedValue({}),
    },
}));

vi.mock("./conversion.service", () => ({
    ConversionService: {
        classifyObjection: vi.fn().mockReturnValue(null),
        decidePersuasion: vi.fn().mockResolvedValue("NONE"),
    },
}));

describe("SalesAgent", () => {
    const STORE_ID = "test-store";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("handles a simple message and returns a response", async () => {
        // Setup mocks
        (prisma.store.findUnique as any).mockResolvedValue({ name: "Test Store", category: "Retail" });
        (MerchantBrainService.retrieveContext as any).mockResolvedValue([]);

        mockChatCompletion.mockResolvedValue({
            choices: [{ message: { content: "Hello! How can I help you today?" } }],
            usage: { prompt_tokens: 10, completion_tokens: 5 },
        });

        const response = await SalesAgent.handleMessage(STORE_ID, [
            { role: "user", content: "Hi" }
        ]);

        expect(response.message).toBe("Hello! How can I help you today?");
        expect(mockChatCompletion).toHaveBeenCalled();
    });



    it("handles escalation triggers and cuts off AI", async () => {
        const response = await SalesAgent.handleMessage(STORE_ID, [
            { role: "user", content: "This is a scam!" }
        ]);

        expect(response.data?.status).toBe("HANDED_OFF");
        expect(response.data?.trigger).toBe("FRAUD_RISK");
        expect(mockChatCompletion).not.toHaveBeenCalled();
    });


    it("returns a safe fallback if Groq call fails", async () => {
        mockChatCompletion.mockResolvedValue(null);

        const response = await SalesAgent.handleMessage(STORE_ID, [
            { role: "user", content: "Tell me about products" }
        ]);

        expect(response.message).toBe("I'm having trouble connecting right now.");
    });


});
