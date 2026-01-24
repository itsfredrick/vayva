import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";
export async function POST(request: Request) {
    try {
        // Clear session and delete from database
        await clearSession();
        return NextResponse.json({
            message: "Logged out successfully",
        });
    }
    catch (error: any) {
        console.error("Logout error:", error);
        return NextResponse.json({ error: "Logout failed" }, { status: 500 });
    }
}
