import { NextResponse } from "next/server";

export async function GET() {
  // Test count
  return NextResponse.json({ count: 3 });
}
