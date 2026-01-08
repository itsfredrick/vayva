import { NextResponse } from "next/server";
import { KYCStatus } from "@vayva/shared";

export async function GET() {
  return NextResponse.json({
    status: KYCStatus.APPROVED,
    submittedAt: new Date().toISOString(),
    documents: [
      { id: "doc_1", type: "CAC Certificate", status: "approved" },
      { id: "doc_2", type: "Director ID", status: "approved" },
    ],
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    message: "KYC documents submitted for review",
    details: body,
  });
}
