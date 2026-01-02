import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: NextRequest) {
    try {
        const { messages } = await req.json();

        const apiKey =
            process.env.GROQ_API_KEY_RESCUE ||
            process.env.NEXT_PUBLIC_GROQ_API_KEY;

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                message: "AI service temporarily unavailable (Configuration Error)",
            });
        }

        const client = new Groq({
            apiKey,
            dangerouslyAllowBrowser: false,
        });

        const completion = await client.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are Vayva AI, a helpful assistant for Vayva, a WhatsApp-based business platform for Nigerian merchants. Your goal is to explain Vayva's features (automated orders, payments, inventory, delivery) and encourage users to sign up. Be concise, friendly, and professional. Keep answers under 3 sentences.",
                },
                ...messages,
            ],
            model: "llama3-70b-8192",
            temperature: 0.7,
            max_tokens: 150,
        });

        return NextResponse.json({
            success: true,
            message: completion.choices[0]?.message?.content || "I didn't catch that.",
        });
    } catch (error) {
        console.error("Marketing AI Error:", error);
        return NextResponse.json({
            success: false,
            message: "Sorry, I'm having trouble connecting right now.",
        });
    }
}
