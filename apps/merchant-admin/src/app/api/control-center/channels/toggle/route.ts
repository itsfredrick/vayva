import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { channel, enabled } = await request.json();
  return NextResponse.json({
    channel,
    enabled,
    updated_at: new Date().toISOString(),
  });
}
