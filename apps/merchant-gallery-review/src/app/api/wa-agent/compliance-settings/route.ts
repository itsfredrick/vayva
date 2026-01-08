import { NextResponse } from "next/server";

let testSettings = {
  onlyInitiatedChat: true,
  requireApprovalForPayments: true,
  updatedAt: new Date().toISOString(),
};

export async function GET() {
  return NextResponse.json(testSettings);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  testSettings = {
    ...testSettings,
    ...body,
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(testSettings);
}
