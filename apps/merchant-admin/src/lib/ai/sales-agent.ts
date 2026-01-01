import { GroqClient } from "./groq-client";
import {
  MerchantBrainService,
  RetrievalResult,
} from "./merchant-brain.service";
import { prisma } from "@vayva/db";
import { AiUsageService } from "./ai-usage.service";
import { DataGovernanceService } from "../governance/data-governance.service";
import {
  EscalationService,
  EscalationTrigger,
} from "../support/escalation.service";
import { ConversionService } from "./conversion.service";
import { reportError } from "../error";
// Types
import Groq from "groq-sdk";

// Initialize centralised client
const groqClient = new GroqClient("SUPPORT");

export interface SalesAgentResponse {
  message: string;
  suggestedActions?: string[];
  data?: any;
}

/**
 * Vayva Sales Agent (Profile-Aware, Limit-Enforced & RAG-Powered)
 */
export class SalesAgent {
  /**
   * Handle a message from a customer
   */
  static async handleMessage(
    storeId: string,
    messages: Groq.Chat.ChatCompletionMessageParam[],
    options?: {
      conversationId?: string;
      userId?: string;
      requestId?: string;
    },
  ): Promise<SalesAgentResponse> {
    try {
      // Safe access to last message content
      const lastMsg = messages[messages.length - 1];
      const lastMessage =
        typeof lastMsg?.content === "string" ? lastMsg.content : "";

      const conversationId = options?.conversationId || "anon";

      // 1. Pre-Check Limits
      const limitCheck = await AiUsageService.checkLimits(storeId);
      if (!limitCheck.allowed) {
        return {
          message:
            "Store chat is currently unavailable. The owner has been notified.",
          data: {
            requiredAction: "BUY_ADDON_OR_UPGRADE",
            reason: limitCheck.reason,
          },
        };
      }

      // 1.5. Escalation Trigger Detection
      const trigger = this.detectEscalationTrigger(lastMessage);
      if (trigger) {
        await EscalationService.triggerHandoff({
          storeId,
          conversationId: conversationId,
          trigger,
          reason: `Detected trigger word in message: ${lastMessage.substring(0, 20)}`,
          aiSummary: `Auto-escalated via trigger: ${trigger}.`,
        });

        return {
          message: this.getHandoffCopy(trigger),
          data: { status: "HANDED_OFF", trigger },
        };
      }

      // 2. Load Context (Persona + RAG + Conversion Policies)
      const [store, profile, context] = await Promise.all([
        prisma.store.findUnique({
          where: { id: storeId },
          select: { name: true, category: true },
        }),
        prisma.merchantAiProfile.findUnique({ where: { storeId } }),
        MerchantBrainService.retrieveContext(storeId, lastMessage, 3),
      ]);

      // 2.5 Conversion Intelligence (Prompt 9)
      const objection = ConversionService.classifyObjection(lastMessage);
      const strategy = await ConversionService.decidePersuasion({
        storeId,
        intent: "BROWSING", // In real app, derived from LLM or classifier
        sentiment: 0.5, // Derived from sentiment service
        confidence: 0.9,
        intensity: profile?.persuasionLevel || 1,
      });

      if (objection) {
        await prisma.objectionEvent.create({
          data: {
            storeId,
            conversationId: "anon",
            category: objection,
            rawText: lastMessage,
          },
        });
      }

      // 3. Construct System Prompt (Enhanced with Persuasion Strategy)
      const contextString = context
        .map((c: RetrievalResult) => `[${c.sourceType}]: ${c.content}`)
        .join("\n");
      const persuasionAdvice =
        strategy !== "NONE"
          ? `STRATEGY: Use ${strategy}. Focus on benefits and trust. No pressure.`
          : "STRATEGY: Be helpful but stay neutral. No active selling.";

      const systemPrompt = this.getSystemPrompt(
        store?.name || "the store",
        store?.category,
        profile,
        contextString + "\n" + persuasionAdvice,
      );

      // 4. Tool Definitions
      const tools: Groq.Chat.ChatCompletionTool[] = [
        {
          type: "function",
          function: {
            name: "get_inventory",
            description: "Check real-time stock for a product",
            parameters: {
              type: "object",
              properties: { productId: { type: "string" } },
              required: ["productId"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "get_delivery_quote",
            description: "Calculate delivery fee and ETA for a location",
            parameters: {
              type: "object",
              properties: { location: { type: "string" } },
              required: ["location"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "get_promotions",
            description: "Get active discounts and special offers",
            parameters: { type: "object", properties: {} },
          },
        },
      ];


      // 5. LLM Execution
      let response = await groqClient.chatCompletion(
        [{ role: "system", content: systemPrompt }, ...(messages as any)],
        {
          model: "llama-3.1-70b-versatile",
          temperature: 0.1,
          tools,
          tool_choice: "auto",
          storeId,
          requestId: options?.requestId,
        },
      );


      if (!response) {
        return { message: "I'm having trouble connecting right now." };
      }

      let choice = response.choices[0].message;

      // Handle Tool Calls
      if (choice.tool_calls) {
        const toolResults: any[] = [];
        for (const tool of choice.tool_calls) {
          if (tool.function.name === "get_inventory") {
            const args = JSON.parse(tool.function.arguments);
            const result = await MerchantBrainService.getInventoryStatus(
              storeId,
              args.productId,
            );
            toolResults.push({
              role: "tool",
              tool_call_id: tool.id,
              content: JSON.stringify(result),
            });
          } else if (tool.function.name === "get_delivery_quote") {
            const args = JSON.parse(tool.function.arguments);
            const result = await MerchantBrainService.getDeliveryQuote(
              storeId,
              args.location,
            );
            toolResults.push({
              role: "tool",
              tool_call_id: tool.id,
              content: JSON.stringify(result),
            });
          } else if (tool.function.name === "get_promotions") {
            const result = await MerchantBrainService.getActivePromotions(storeId);
            toolResults.push({
              role: "tool",
              tool_call_id: tool.id,
              content: JSON.stringify(result),
            });
          }
        }


        const secondResponse = await groqClient.chatCompletion(
          [
            { role: "system", content: systemPrompt },
            ...(messages as any),
            choice as any,
            ...toolResults,
          ],
          {
            model: "llama-3.1-70b-versatile",
            temperature: 0.1,
            storeId,
            requestId: options?.requestId,
          }
        );


        if (secondResponse && secondResponse.choices[0]) {
          choice = secondResponse.choices[0].message;
        }
      }

      // 6. Log Usage & Governance
      if (response && response.usage) {
        await AiUsageService.logUsage({
          storeId,
          model: "llama-3.1-70b-versatile",
          inputTokens: response.usage.prompt_tokens,
          outputTokens: response.usage.completion_tokens,
          requestId: options?.requestId,
        });

        await DataGovernanceService.logAiTrace({
          storeId,
          conversationId: conversationId,
          requestId: options?.requestId,
          model: "llama-3.1-70b-versatile",
          toolsUsed: choice.tool_calls?.map((t: any) => t.function.name) || [],
          retrievedDocs: context.map((c: RetrievalResult) => c.sourceId),
          inputSummary: lastMessage,
          outputSummary: choice.content || "",
          guardrailFlags: [],
          latencyMs: 0,
        });
      }

      return {
        message: choice.content || "I'm checking that for you right now.",
        suggestedActions: this.deriveActions(choice.content),
      };
    } catch (error) {
      reportError(error, { context: "SalesAgent.handleMessage", storeId });
      return {
        message:
          "I'm having a quiet moment to think. Please message back in 5 minutes!",
      };
    }
  }

  private static getSystemPrompt(
    storeName: string,
    category: string | undefined,
    profile: any,
    context: string,
  ): string {
    const tone = profile?.tonePreset || "Friendly";
    const brevity =
      profile?.brevityMode === "Short"
        ? "Keep replies under 3 sentences."
        : "Be detailed.";

    return `You are the Lead Sales Rep for ${storeName}.
        
TONE: ${tone}.
BREVITY: ${brevity}.
PERSUASION: Level ${profile?.persuasionLevel || 1}.

GUIDELINES:
1. TRUTHFULNESS: Only suggest products you find via tools or context.
2. FLOW: Ask ONE follow-up question to help the customer decide.
3. CONTEXT: You are in Nigeria. Use ₦.

VERIFIED KNOWLEDGE:
${context || "No specific knowledge found. Ask for clarification."}

Always aim to close the sale with expert helpfulness.`;
  }

  private static detectEscalationTrigger(
    text: string,
  ): EscalationTrigger | null {
    if (!text) return null;
    const lowerText = text.toLowerCase();
    if (
      lowerText.includes("scam") ||
      lowerText.includes("fraud") ||
      lowerText.includes("fake")
    )
      return "FRAUD_RISK";
    if (
      lowerText.includes("refund") ||
      lowerText.includes("double charge") ||
      lowerText.includes("chargeback")
    )
      return "PAYMENT_DISPUTE";
    if (
      lowerText.includes("angry") ||
      lowerText.includes("stupid bot") ||
      lowerText.includes("hate")
    )
      return "SENTIMENT";
    return null;
  }

  private static getHandoffCopy(trigger: EscalationTrigger): string {
    switch (trigger) {
      case "PAYMENT_DISPUTE":
        return "I apologize for the confusion. I'm alerting our finance team now.";
      case "FRAUD_RISK":
        return "I've alerted our security team for immediate review.";
      default:
        return "I've passed your request to our team. A person will continue from here.";
    }
  }

  private static deriveActions(content: string | null): string[] {
    if (!content) return [];
    const actions = [];
    if (content.toLowerCase().includes("price"))
      actions.push("Check Delivery Cost");
    if (content.toLowerCase().includes("item"))
      actions.push("View Similar Items");
    return actions.length > 0 ? actions : ["Ask about Delivery"];
  }
}
