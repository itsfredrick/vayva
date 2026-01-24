import { NextRequest, NextResponse } from "next/server";

// Simplified implementation - database table will be added via Prisma migration
// For now, just validate email and send confirmation

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 }
            );
        }

        // Logic scheduled for upcoming waitlist database model integration
        // For now, just log and send confirmation email

        // Send confirmation email (async, don't wait)
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3003';
        fetch(`${appUrl}/api/emails/waitlist-confirmation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        }).catch((err) => console.error("Email send failed:", err));

        return NextResponse.json(
            { message: "Successfully joined waitlist" },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Waitlist error:", error);
        return NextResponse.json(
            { error: "Failed to join waitlist" },
            { status: 500 }
        );
    }
}
