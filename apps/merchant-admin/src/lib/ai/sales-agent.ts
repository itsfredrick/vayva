import Groq from 'groq-sdk';
import { MerchantBrainService, RetrievalResult } from './merchant-brain.service';
import { prisma } from '@vayva/db';
import { AiUsageService } from './ai-usage.service';
import { DataGovernanceService } from '../governance/data-governance.service';
import { EscalationService, EscalationTrigger } from '../support/escalation.service';
import { ConversionService } from './conversion.service';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || '',
});

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
        messages: any[],
        options?: {
            userId?: string;
            requestId?: string;
        }
    ): Promise<SalesAgentResponse> {
        try {
            const lastMessage = messages[messages.length - 1]?.content || '';

            // 1. Pre-Check Limits
            const limitCheck = await AiUsageService.checkLimits(storeId);
            if (!limitCheck.allowed) {
                return {
                    message: "Store chat is currently unavailable. The owner has been notified.",
                    data: { requiredAction: 'BUY_ADDON_OR_UPGRADE', reason: limitCheck.reason }
                };
            }

            // 1.5. Escalation Trigger Detection
            const trigger = this.detectEscalationTrigger(lastMessage);
            if (trigger) {
                await EscalationService.triggerHandoff({
                    storeId,
                    conversationId: messages[messages.length - 1]?.conversationId || 'manual_handoff',
                    trigger,
                    reason: `Detected trigger word in message: ${lastMessage.substring(0, 20)}`,
                    aiSummary: `Auto-escalated via trigger: ${trigger}.`
                });

                return {
                    message: this.getHandoffCopy(trigger),
                    data: { status: 'HANDED_OFF', trigger }
                };
            }


            // 2. Load Context (Persona + RAG + Conversion Policies)
            const [store, profile, context] = await Promise.all([
                prisma.store.findUnique({
                    where: { id: storeId },
                    select: { name: true, category: true }
                }),
                (prisma as any).merchantAiProfile.findUnique({ where: { storeId } }),
                MerchantBrainService.retrieveContext(storeId, lastMessage)
            ]);

            // 2.5 Conversion Intelligence (Prompt 9)
            const objection = ConversionService.classifyObjection(lastMessage);
            const strategy = await ConversionService.decidePersuasion({
                storeId,
                intent: 'BROWSING', // In real app, derived from LLM or classifier
                sentiment: 0.5,     // Derived from sentiment service
                confidence: 0.9,
                intensity: profile?.persuasionLevel || 1
            });

            if (objection) {
                await (prisma as any).objectionEvent.create({
                    data: {
                        storeId,
                        conversationId: messages[messages.length - 1]?.conversationId || 'anon',
                        category: objection,
                        rawText: lastMessage
                    }
                });
            }

            // 3. Construct System Prompt (Enhanced with Persuasion Strategy)
            const contextString = context.map((c: RetrievalResult) => `[${c.sourceType}]: ${c.content}`).join('\n');
            const persuasionAdvice = strategy !== 'NONE'
                ? `STRATEGY: Use ${strategy}. Focus on benefits and trust. No pressure.`
                : 'STRATEGY: Be helpful but stay neutral. No active selling.';

            const systemPrompt = this.getSystemPrompt(
                store?.name || 'the store',
                store?.category,
                profile,
                contextString + '\n' + persuasionAdvice
            );

            // 4. Tool Definitions
            const tools: Groq.Chat.ChatCompletionTool[] = [
                {
                    type: 'function',
                    function: {
                        name: 'get_inventory',
                        description: 'Check real-time stock for a product',
                        parameters: { type: 'object', properties: { productId: { type: 'string' } }, required: ['productId'] }
                    }
                }
            ];

            // 5. LLM Execution
            let response = await groq.chat.completions.create({
                messages: [{ role: 'system', content: systemPrompt }, ...messages],
                model: 'llama-3.1-70b-versatile',
                tools,
                tool_choice: 'auto',
                temperature: 0.1
            });

            let choice = response.choices[0].message;

            // Handle Tool Calls
            if (choice.tool_calls) {
                const toolResults = [];
                for (const tool of choice.tool_calls) {
                    if (tool.function.name === 'get_inventory') {
                        const args = JSON.parse(tool.function.arguments);
                        const result = await MerchantBrainService.getInventoryStatus(storeId, args.productId);
                        toolResults.push({ role: 'tool', tool_call_id: tool.id, content: JSON.stringify(result) });
                    }
                }

                const secondResponse = await groq.chat.completions.create({
                    messages: [{ role: 'system', content: systemPrompt }, ...messages, choice, ...toolResults as any],
                    model: 'llama-3.1-70b-versatile'
                });
                choice = secondResponse.choices[0].message;
            }

            // 6. Log Usage & Governance
            if (response.usage) {
                await AiUsageService.logUsage({
                    storeId,
                    model: 'llama-3.1-70b-versatile',
                    inputTokens: response.usage.prompt_tokens,
                    outputTokens: response.usage.completion_tokens,
                    requestId: options?.requestId
                });

                await DataGovernanceService.logAiTrace({
                    storeId,
                    conversationId: messages[messages.length - 1]?.conversationId,
                    requestId: options?.requestId,
                    model: 'llama-3.1-70b-versatile',
                    toolsUsed: choice.tool_calls?.map(t => t.function.name) || [],
                    retrievedDocs: context.map((c: RetrievalResult) => c.sourceId),
                    inputSummary: lastMessage,
                    outputSummary: choice.content || '',
                    guardrailFlags: [],
                    latencyMs: 0
                });
            }

            return {
                message: choice.content || "I'm checking that for you right now.",
                suggestedActions: this.deriveActions(choice.content)
            };

        } catch (error) {
            console.error('[SalesAgent] Error:', error);
            return {
                message: "I'm having a quiet moment to think. Please message back in 5 minutes!"
            };
        }
    }

    private static getSystemPrompt(
        storeName: string,
        category: string | undefined,
        profile: any,
        context: string
    ): string {
        const tone = profile?.tonePreset || 'Friendly';
        const brevity = profile?.brevityMode === 'Short' ? 'Keep replies under 3 sentences.' : 'Be detailed.';

        return `You are the Lead Sales Rep for ${storeName}.
        
TONE: ${tone}.
BREVITY: ${brevity}.
PERSUASION: Level ${profile?.persuasionLevel || 1}.

GUIDELINES:
1. TRUTHFULNESS: Only suggest products you find via tools or context.
2. FLOW: Ask ONE follow-up question to help the customer decide.
3. CONTEXT: You are in Nigeria. Use ₦.

VERIFIED KNOWLEDGE:
${context || 'No specific knowledge found. Ask for clarification.'}

Always aim to close the sale with expert helpfulness.`;
    }

    private static detectEscalationTrigger(text: string): EscalationTrigger | null {
        if (!text) return null;
        const lowerText = text.toLowerCase();
        if (lowerText.includes('scam') || lowerText.includes('fraud') || lowerText.includes('fake')) return 'FRAUD_RISK';
        if (lowerText.includes('refund') || lowerText.includes('double charge') || lowerText.includes('chargeback')) return 'PAYMENT_DISPUTE';
        if (lowerText.includes('angry') || lowerText.includes('stupid bot') || lowerText.includes('hate')) return 'SENTIMENT';
        return null;
    }

    private static getHandoffCopy(trigger: EscalationTrigger): string {
        switch (trigger) {
            case 'PAYMENT_DISPUTE': return "I apologize for the confusion. I'm alerting our finance team now.";
            case 'FRAUD_RISK': return "I've alerted our security team for immediate review.";
            default: return "I've passed your request to our team. A person will continue from here.";
        }
    }

    private static deriveActions(content: string | null): string[] {
        if (!content) return [];
        const actions = [];
        if (content.toLowerCase().includes('price')) actions.push('Check Delivery Cost');
        if (content.toLowerCase().includes('item')) actions.push('View Similar Items');
        return actions.length > 0 ? actions : ['Ask about Delivery'];
    }
}
