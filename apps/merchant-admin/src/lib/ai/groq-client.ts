import { Groq } from "groq-sdk";
import { logger } from "@/lib/logger";
import { prisma } from "@vayva/db";


// Regex to identify potential emails and phone numbers for stripping
const PII_REGEX = {
    EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    PHONE: /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3,4}[-.]?\d{4}/g,

    CARD: /\b(?:\d[ -]*?){13,16}\b/g, // Simplified card-like pattern
};


export class GroqClient {
    private client: Groq;
    private context: "MERCHANT" | "SUPPORT";

    constructor(context: "MERCHANT" | "SUPPORT" = "MERCHANT") {
        this.context = context;
        const apiKey =
            context === "MERCHANT"
                ? process.env.GROQ_API_KEY_MERCHANT
                : process.env.GROQ_API_KEY_SUPPORT;

        if (!apiKey) {
            logger.warn(`[GroqClient] No API key found for ${context} context. AI features will fallback.`);
        }

        this.client = new Groq({
            apiKey: apiKey || "placeholder-key", // Prevent crash on init, fail on call if needed
            dangerouslyAllowBrowser: false,
        });
    }

    /**
     * Strip PII from input text
     */
    private sanitizeInput(text: string): string {
        return text
            .replace(PII_REGEX.EMAIL, "[REDACTED_EMAIL]")
            .replace(PII_REGEX.PHONE, "[REDACTED_PHONE]")
            .replace(PII_REGEX.CARD, "[REDACTED_SENSITIVE]");
    }


    /**
     * Generate a completion with safe handling
     */
    async chatCompletion(
        messages: { role: "system" | "user" | "assistant" | "tool"; content: string | null; tool_call_id?: string; name?: string; tool_calls?: any[] }[],
        options: {
            model?: string;
            temperature?: number;
            maxTokens?: number;
            jsonMode?: boolean;
            tools?: any[];
            tool_choice?: "auto" | "none" | any;
            requestId?: string;
            storeId?: string;
        } = {}

    ) {
        if (!this.client.apiKey || this.client.apiKey === "placeholder-key") {
            logger.warn("[GroqClient] Call skipped due to missing API key");
            return null;
        }

        try {
            // 1. Sanitize user messages
            const safeMessages = messages.map((m) => ({
                ...m,
                content: m.content ? this.sanitizeInput(m.content) : null,
            }));

            // 2. Call API with Timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const response = await this.client.chat.completions.create({
                messages: safeMessages as any,
                model: options.model || "llama3-70b-8192",
                temperature: options.temperature ?? 0.7,
                max_tokens: options.maxTokens ?? 1024,
                response_format: options.jsonMode ? { type: "json_object" } : undefined,
                tools: options.tools,
                tool_choice: options.tool_choice,
            }, { signal: controller.signal });

            clearTimeout(timeoutId);

            // 3. Real Audit Logging (No secrets)
            if (options.storeId) {
                await prisma.aiUsageEvent.create({
                    data: {
                        storeId: options.storeId,
                        model: response.model,
                        inputTokens: response.usage?.prompt_tokens ?? 0,
                        outputTokens: response.usage?.completion_tokens ?? 0,
                        toolCallsCount: response.choices[0]?.message.tool_calls?.length ?? 0,
                        requestId: options.requestId,
                        success: true,
                        channel: this.context === "MERCHANT" ? "INAPP" : "WHATSAPP",
                    }
                }).catch(e => logger.warn("[GroqClient] Audit log failed", { error: e }));
            }


            return response;
        } catch (error) {
            logger.error("[GroqClient] API call failed", { error });
            return null; // Graceful degradation
        }
    }
}
