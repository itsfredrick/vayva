import { NextResponse } from "next/server";

export async function POST() {
  // In a real app, this would clear cookies
  return new NextResponse(null, { status: 204 });
}
