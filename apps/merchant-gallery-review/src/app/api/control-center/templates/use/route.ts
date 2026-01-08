import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { templateId } = await request.json();
  return NextResponse.json({
    success: true,
    message: `Template ${templateId} applied successfully.`,
    activeTemplateId: templateId,
  });
}
