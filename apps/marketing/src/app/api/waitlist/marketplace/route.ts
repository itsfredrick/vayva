import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { email } = await request.json();

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return NextResponse.json(
                { error: "Valid email is required" },
                { status: 400 }
            );
        }

        // Database integration will be added later. For now, just validate and accept.
        console.log("Marketplace waitlist signup:", email);

        return NextResponse.json(
            { message: "Successfully joined marketplace waitlist" },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Marketplace waitlist error:", error);
        return NextResponse.json(
            { error: "Failed to join waitlist" },
            { status: 500 }
        );
    }
}
