import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { domain } = await request.json();

  // Simulate domain addition process
  return NextResponse.json({
    success: true,
    message: "Domain added. Please verify DNS records.",
    domain: {
      id: `dom_${Math.random().toString(36).substr(2, 9)}`,
      name: domain,
      type: "custom",
      status: "connecting",
      sslStatus: "pending",
      dnsStatus: "pending",
      verificationRecord: {
        type: "TXT",
        name: "@",
        value: "vayva-verification=123xyz",
      },
    },
  });
}
