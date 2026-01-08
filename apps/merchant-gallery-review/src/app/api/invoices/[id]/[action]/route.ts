import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> },
) {
  const { id, action } = await params;

  // Test processing delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (action === "paylink") {
    return NextResponse.json({
      payLink: `https://pay.vayva.ng/${id}`,
    });
  }

  return NextResponse.json({
    success: true,
    action,
    id,
    processed_at: new Date().toISOString(),
  });
}
