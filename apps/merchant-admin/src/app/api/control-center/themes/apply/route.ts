import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    appliedTheme: body.themeId,
    updatedAt: new Date().toISOString(),
  });
}
