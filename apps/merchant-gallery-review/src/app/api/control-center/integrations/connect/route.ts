import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { integrationId } = await request.json();
  return NextResponse.json({
    success: true,
    message: "Integration connected successfully",
    status: "connected",
  });
}
