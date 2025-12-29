import { NextRequest, NextResponse } from 'next/server';
import { AIService, AIMessage } from '@/lib/ai/aiService';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { messages, context } = body;

        // Validate input
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json(
                { error: 'Messages array is required' },
                { status: 400 }
            );
        }

        // Check if AI is enabled
        if (process.env.ENABLE_AI_ASSISTANT !== 'true') {
            return NextResponse.json(
                { error: 'AI assistant is currently disabled' },
                { status: 503 }
            );
        }

        // Check if Groq API key is configured
        const isConfigured = !!process.env.GROQ_ADMIN_KEY;
        if (!isConfigured) {
            return NextResponse.json(
                {
                    error: 'AI service not configured. Please add GROQ_ADMIN_KEY to your .env file.',
                    setup_url: 'https://console.groq.com/keys'
                },
                { status: 503 }
            );
        }

        // Get session for storeId
        const { requireAuth } = await import('@/lib/auth/session');
        const session = await requireAuth();
        const storeId = session.user.storeId;

        if (!storeId) {
            return NextResponse.json(
                { error: 'No store associated with this account' },
                { status: 400 }
            );
        }

        // Get AI response using SalesAgent
        const { SalesAgent } = await import('@/lib/ai/sales-agent');
        const response = await SalesAgent.handleMessage(storeId, messages, context);

        return NextResponse.json({
            success: true,
            data: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('AI Chat API Error:', error);
        return NextResponse.json(
            {
                error: 'Failed to process AI request',
                message: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// Health check endpoint
export async function GET() {
    const isConfigured = !!process.env.GROQ_ADMIN_KEY;
    const isEnabled = process.env.ENABLE_AI_ASSISTANT === 'true';

    return NextResponse.json({
        status: isConfigured && isEnabled ? 'ready' : 'not_configured',
        ai_enabled: isEnabled,
        api_key_configured: isConfigured,
        model: process.env.AI_MODEL || 'llama-3.1-70b-versatile',
        setup_guide: !isConfigured ? 'See SETUP_GUIDE.md for instructions' : undefined
    });
}
