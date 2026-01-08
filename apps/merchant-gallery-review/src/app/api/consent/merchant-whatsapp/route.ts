import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    ...body,
    updatedAt: new Date().toISOString(),
  });
}

export async function GET() {
  return NextResponse.json({
    authorizedNumber: true,
    customerConsent: true,
    updatedAt: new Date().toISOString(),
  });
}
