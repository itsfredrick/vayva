import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    active: body.active,
    message: body.active ? "Checkout AI enabled" : "Checkout AI disabled",
  });
}
