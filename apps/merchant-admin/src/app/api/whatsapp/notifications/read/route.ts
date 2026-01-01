import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { ids } = await request.json();

  return NextResponse.json({
    success: true,
    marked_read_count: ids.length,
  });
}
