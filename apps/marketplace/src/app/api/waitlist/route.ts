import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In a real app, save to DB or CRM

    return NextResponse.json({
      success: true,
      message: "Joined waitlist successfully",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 },
    );
  }
}
