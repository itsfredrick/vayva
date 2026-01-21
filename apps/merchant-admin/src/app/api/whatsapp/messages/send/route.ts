import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { conversation_id, message, mode } = await request.json();

  if (!message)
    return NextResponse.json({ error: "Message empty" }, { status: 400 });

  // Test send delay
  // No artificial latency

  return NextResponse.json({
    message_id: `msg_${Date.now()}`,
    status: "sent", // or queued
    timestamp: new Date().toISOString(),
  });
}
