import { NextResponse } from "next/server";

export async function GET() {
  // Simulate live status
  return NextResponse.json({
    status: "live",
    reasons: [],
    updated_at: new Date().toISOString(),
  });
}
