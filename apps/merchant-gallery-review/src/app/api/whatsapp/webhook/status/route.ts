import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Receive test status updates (delivered, read)
  return new NextResponse("OK", { status: 200 });
}
