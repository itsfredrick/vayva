import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET() {
    // Alpha Feature: AI Coach
    // Logic: Retrieve recent conversation history for the Coach.
    // In future, this will use Vector DB retrieval or `Conversation` model with type='COACH'.
    try {
        const session = await getServerSession(authOptions);
        // If real implementation, we would query:
        // const history = await prisma.message.findMany({ ... });
        // For Alpha Scrub: Return empty array instead of static Demo data
        // to prevent "Fake" messages from appearing in production.
        return NextResponse.json([]);
    }
    catch (error) {
        return NextResponse.json([]);
    }
}
