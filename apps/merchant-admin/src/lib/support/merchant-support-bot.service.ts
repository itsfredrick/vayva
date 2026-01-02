import Groq from "groq-sdk";
import { prisma } from "@vayva/db";
import { SupportContextService } from "./support-context.service";
import { EscalationService } from "./escalation.service";
import { EscalationPolicy } from "./escalation-policy";
import { logger } from "@/lib/logger";
import fs from "fs";
import path from "path";

const groq = new Groq({
  apiKey: process.env.GROQ_ADMIN_KEY || "",
});

export class MerchantSupportBot {
  /**
   * Handle support message from a merchant
   */
  static async handleQuery(
    storeId: string,
    query: string,
    history: any[] = [],
  ) {
    try {
      // 1. Fetch Real Context (Account Facts)
      const snapshot = await SupportContextService.getMerchantSnapshot(storeId);

      // 2. Fetch Relevant Playbooks (Simple file search for MVP)
      const playbooks = this.getRelevantPlaybooks(query);

      // 3. System Prompt
      const systemPrompt = `You are the Vayva Merchant Advisor. Your job is to help busy business owners manage their store efficiently.
            
Tone: Professional, direct, and efficient. 
Rule: Keep responses to the point (under 2 sentences). Time is money for our merchants.

Context:
${JSON.stringify(snapshot, null, 2)}

Playbooks:
${playbooks}

Support Guidelines:
1. Always use the MERCHANT CONTEXT to answer. 
2. If you don't see the info in the context, say: "I can't see that specific detail right now. Let me connect you to a human expert to check."
3. For billing or payment issues, always offer to escalate immediately.
4. If they seem frustrated, skip the AI talk and offer a human handoff.`;

      // 4. LLM Call
      const response = await groq.chat.completions.create({
        messages: [
          { role: "system", content: systemPrompt },
          ...history,
          { role: "user", content: query },
        ],
        model: "llama-3.1-70b-versatile",
        temperature: 0.2,
      });

      const reply =
        response.choices[0].message.content ||
        "I'm here to help. How can I assist you with your store today?";

      // 5. Auto-Escalation Check (Using Policy)
      // We use a test confidence score for now, but RAG could return this
      const decision = EscalationPolicy.evaluate(query, 0.95);

      if (decision.shouldEscalate) {
        await EscalationService.triggerHandoff({
          storeId,
          conversationId: "support_bot_" + Date.now(),
          trigger: decision.trigger!,
          reason: decision.reason!,
          aiSummary: `Auto-escalation triggered. Reason: ${decision.reason}. User Query: "${query}"`,
        });

        // Telemetry: Log Escalation
        const prismaCtx: any =
          (global as any).prisma || (await import("@vayva/db")).prisma;
        await prismaCtx.supportTelemetryEvent.create({
          data: {
            storeId,
            conversationId: "support_bot_" + Date.now(),
            eventType: "BOT_ESCALATED",
            payload: {
              trigger: decision.trigger,
              reason: decision.reason,
              policyVersion: "2025-12-28_v1",
            },
          },
        });
      }

      return {
        message: reply,
        suggestedActions: this.deriveSupportActions(reply),
      };
    } catch (error: any) {
      logger.error("[SupportBot] Error", error);
      return {
        message:
          "I'm currently having trouble accessing our support systems. Please opening a support ticket manually.",
      };
    }
  }

  private static getRelevantPlaybooks(query: string): string {
    // Simple keyword matcher for file-based knowledge
    const kbPath = path.join(process.cwd(), "support/knowledge/playbooks");
    try {
      const files = fs.readdirSync(kbPath);
      let context = "";
      for (const file of files) {
        if (file.endsWith(".md")) {
          const content = fs.readFileSync(path.join(kbPath, file), "utf-8");
          context += `\n--- PLAYBOOK: ${file} ---\n${content}`;
        }
      }
      return context;
    } catch (e: any) {
      return "No playbooks found.";
    }
  }

  private static shouldEscalate(reply: string, query: string): string | null {
    const lower = (reply + query).toLowerCase();
    if (
      lower.includes("billing error") ||
      lower.includes("refund") ||
      lower.includes("chargeback")
    )
      return "PAYMENT";
    if (
      lower.includes("escalat") ||
      lower.includes("human") ||
      lower.includes("agent")
    )
      return "MANUAL";
    return null;
  }

  private static deriveSupportActions(reply: string): string[] {
    const actions = [];
    if (reply.toLowerCase().includes("domain")) actions.push("Check Domains");
    if (reply.toLowerCase().includes("whatsapp"))
      actions.push("Check WhatsApp");
    if (reply.toLowerCase().includes("plan")) actions.push("View Billing");
    return actions.length > 0 ? actions : ["Talk to Human"];
  }
}
