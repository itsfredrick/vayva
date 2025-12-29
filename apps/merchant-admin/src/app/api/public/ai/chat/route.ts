import { NextRequest, NextResponse } from 'next/server';
import { MarketingAIService } from '@/lib/ai/marketing-ai';

export async function POST(request: NextRequest) {
    try {
        const { messages } = await request.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
        }

        const result = await MarketingAIService.getResponse(messages);
        return NextResponse.json(result);
    } catch (error) {
        console.error('Marketing AI Route Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
