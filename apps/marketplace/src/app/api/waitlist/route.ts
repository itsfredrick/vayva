import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // In a real app, save to DB or CRM
    console.log("Waitlist Signup:", body);

    return NextResponse.json({
      success: true,
      message: "Joined waitlist successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid request" },
      { status: 400 },
    );
  }
}
