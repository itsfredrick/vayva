import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { linked_type, linked_id } = await request.json();

  return NextResponse.json({
    conversation_id: id,
    linked_entity: {
      type: linked_type,
      id: linked_id,
    },
    status: "linked",
  });
}
