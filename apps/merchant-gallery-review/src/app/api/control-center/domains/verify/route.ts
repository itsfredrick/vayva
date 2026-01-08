import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { domain } = await request.json();
  return NextResponse.json({ domain, status: "verified" });
}
