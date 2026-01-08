import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await request.json();

  // In real app, save to DB

  return NextResponse.json({
    success: true,
    data: {
      id: `note_${Date.now()}`,
      customerId: id,
      content: body.content,
      authorName: "You",
      createdAt: new Date().toISOString(),
    },
  });
}
