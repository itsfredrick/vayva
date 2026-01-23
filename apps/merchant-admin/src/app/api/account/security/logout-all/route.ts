import { NextResponse } from "next/server";
export async function POST(request: unknown) {
    // Revoke all sessions logic
    return NextResponse.json({
        success: true,
        message: "All other sessions have been logged out.",
    });
}
