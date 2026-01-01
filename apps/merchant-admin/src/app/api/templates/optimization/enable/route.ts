import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    active: body.active,
    message: body.active
      ? "Auto-Optimization enabled"
      : "Auto-Optimization disabled",
  });
}
