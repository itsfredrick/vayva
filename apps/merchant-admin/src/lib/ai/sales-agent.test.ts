import { describe, it, expect, vi, beforeEach } from "vitest";
import { SalesAgent } from "./sales-agent";
import { GroqClient } from "./groq-client";
import { MerchantBrainService } from "./merchant-brain.service";
import { prisma } from "@vayva/db";

// Test dependencies
const { testChatCompletion } = vi.hoisted(() => ({
    testChatCompletion: vi.fn()
}));

vi.test("./groq-client", () => {
    return {
        GroqClient: vi.fn().testImplementation(() => ({
            chatCompletion: testChatCompletion,
            client: { apiKey: "test-key" }
        }))
    };
});


vi.test("./merchant-brain.service");
vi.test("../support/escalation.service", () => ({
    EscalationService: {
        triggerHandoff: vi.fn().testResolvedValue({}),
    },
}));


vi.test("@vayva/db", () => ({
    prisma: {
        store: { findUnique: vi.fn() },
        merchantAiProfile: { findUnique: vi.fn() },
        objectionEvent: { create: vi.fn() },
        aiUsageEvent: { create: vi.fn() }
    },
}));


vi.test("./ai-usage.service", () => ({
    AiUsageService: {
        checkLimits: vi.fn().testResolvedValue({ allowed: true }),
        logUsage: vi.fn().testResolvedValue({}),
    },
}));

vi.test("../governance/data-governance.service", () => ({
    DataGovernanceService: {
        logAiTrace: vi.fn().testResolvedValue({}),
    },
}));

vi.test("./conversion.service", () => ({
    ConversionService: {
        classifyObjection: vi.fn().testReturnValue(null),
        decidePersuasion: vi.fn().testResolvedValue("NONE"),
    },
}));

describe("SalesAgent", () => {
    const STORE_ID = "test-store";

    beforeEach(() => {
        vi.clearAllTests();
    });

    it("handles a simple message and returns a response", async () => {
        // Setup tests
        (prisma.store.findUnique as any).testResolvedValue({ name: "Test Store", category: "Retail" });
        (MerchantBrainService.retrieveContext as any).testResolvedValue([]);

        testChatCompletion.testResolvedValue({
            choices: [{ message: { content: "Hello! How can I help you today?" } }],
            usage: { prompt_tokens: 10, completion_tokens: 5 },
        });

        const response = await SalesAgent.handleMessage(STORE_ID, [
            { role: "user", content: "Hi" }
        ]);

        expect(response.message).toBe("Hello! How can I help you today?");
        expect(testChatCompletion).toHaveBeenCalled();
    });



    it("handles escalation triggers and cuts off AI", async () => {
        const response = await SalesAgent.handleMessage(STORE_ID, [
            { role: "user", content: "This is a scam!" }
        ]);

        expect(response.data?.status).toBe("HANDED_OFF");
        expect(response.data?.trigger).toBe("FRAUD_RISK");
        expect(testChatCompletion).not.toHaveBeenCalled();
    });


    it("returns a safe fallback if Groq call fails", async () => {
        testChatCompletion.testResolvedValue(null);

        const response = await SalesAgent.handleMessage(STORE_ID, [
            { role: "user", content: "Tell me about products" }
        ]);

        expect(response.message).toBe("I'm having trouble connecting right now.");
    });


});
