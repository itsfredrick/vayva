import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { integration } = await request.json();
  return NextResponse.json({ integration, isConnected: false });
}
