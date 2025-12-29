import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_ADMIN_KEY || '',
});

export interface AIMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface AIResponse {
    message: string;
    intent?: 'order_inquiry' | 'product_question' | 'complaint' | 'general' | 'order_placement';
    confidence?: number;
    suggestedActions?: string[];
}

/**
 * AI Service for handling customer conversations
 * Uses Groq (FREE) with Llama 3.1 70B model
 */
export class AIService {

    /**
     * Get AI response for customer message
     */
    static async chat(
        messages: AIMessage[],
        context?: {
            storeName?: string;
            products?: Array<{ name: string; price: number; available: boolean }>;
            customerName?: string;
        }
    ): Promise<AIResponse> {
        try {
            // Build system prompt with business context
            const systemPrompt = this.buildSystemPrompt(context);

            const completion = await groq.chat.completions.create({
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...messages
                ],
                model: process.env.AI_MODEL || 'llama-3.1-70b-versatile',
                temperature: parseFloat(process.env.AI_TEMPERATURE || '0.7'),
                max_tokens: parseInt(process.env.AI_MAX_TOKENS || '2048'),
                top_p: 1,
                stream: false,
            });

            const responseMessage = completion.choices[0]?.message?.content || 'I apologize, I could not process that request.';

            // Analyze intent
            const intent = this.detectIntent(messages[messages.length - 1].content);

            return {
                message: responseMessage,
                intent,
                confidence: 0.85,
                suggestedActions: this.getSuggestedActions(intent)
            };

        } catch (error) {
            console.error('AI Service Error:', error);
            return {
                message: 'I apologize, but I\'m having trouble processing your request right now. A human agent will assist you shortly.',
                intent: 'general',
                confidence: 0
            };
        }
    }

    /**
     * Build system prompt with business context
     */
    private static buildSystemPrompt(context?: {
        storeName?: string;
        products?: Array<{ name: string; price: number; available: boolean }>;
        customerName?: string;
    }): string {
        const storeName = context?.storeName || 'our store';
        const customerName = context?.customerName || 'there';

        let prompt = `You are a helpful AI assistant for ${storeName}, an e-commerce business in Nigeria. 

Your role is to:
1. Answer customer questions about products, orders, and services
2. Help customers place orders via WhatsApp
3. Provide order status updates
4. Handle complaints professionally
5. Collect necessary information for order processing (name, address, phone, payment method)

Guidelines:
- Be friendly, professional, and concise
- Use Nigerian English and local context
- Mention prices in Nigerian Naira (₦)
- For orders, collect: full name, delivery address, phone number, payment method (bank transfer/card/cash on delivery)
- If you don't know something, admit it and offer to connect them with a human agent
- Always confirm order details before finalizing

`;

        // Add product catalog if available
        if (context?.products && context.products.length > 0) {
            prompt += `\nAvailable Products:\n`;
            context.products.forEach(p => {
                prompt += `- ${p.name}: ₦${p.price.toLocaleString()} ${p.available ? '(In Stock)' : '(Out of Stock)'}\n`;
            });
        }

        prompt += `\nCustomer name: ${customerName}`;

        return prompt;
    }

    /**
     * Detect customer intent from message
     */
    private static detectIntent(message: string): AIResponse['intent'] {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('order') && (lowerMessage.includes('status') || lowerMessage.includes('where') || lowerMessage.includes('track'))) {
            return 'order_inquiry';
        }

        if (lowerMessage.includes('buy') || lowerMessage.includes('purchase') || lowerMessage.includes('want to order') || lowerMessage.includes('how much')) {
            return 'order_placement';
        }

        if (lowerMessage.includes('complaint') || lowerMessage.includes('problem') || lowerMessage.includes('issue') || lowerMessage.includes('wrong')) {
            return 'complaint';
        }

        if (lowerMessage.includes('product') || lowerMessage.includes('available') || lowerMessage.includes('stock') || lowerMessage.includes('price')) {
            return 'product_question';
        }

        return 'general';
    }

    /**
     * Get suggested actions based on intent
     */
    private static getSuggestedActions(intent?: AIResponse['intent']): string[] {
        switch (intent) {
            case 'order_inquiry':
                return ['Check order status', 'View order details', 'Contact support'];
            case 'order_placement':
                return ['Add to cart', 'Proceed to checkout', 'View similar products'];
            case 'complaint':
                return ['Escalate to human agent', 'Request refund', 'Track resolution'];
            case 'product_question':
                return ['View product details', 'Check availability', 'Compare products'];
            default:
                return ['Browse products', 'Contact support', 'View FAQs'];
        }
    }

    /**
     * Generate order confirmation message
     */
    static generateOrderConfirmation(orderDetails: {
        items: Array<{ name: string; quantity: number; price: number }>;
        total: number;
        deliveryAddress: string;
        customerName: string;
    }): string {
        const itemsList = orderDetails.items
            .map(item => `- ${item.quantity}x ${item.name} @ ₦${item.price.toLocaleString()}`)
            .join('\n');

        return `✅ Order Confirmed!

Hi ${orderDetails.customerName}, your order has been received:

${itemsList}

Total: ₦${orderDetails.total.toLocaleString()}
Delivery Address: ${orderDetails.deliveryAddress}

We'll send you tracking details once your order is dispatched. Thank you for shopping with us! 🎉`;
    }
}
