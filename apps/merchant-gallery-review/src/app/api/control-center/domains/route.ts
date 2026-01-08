import { NextResponse } from "next/server";
import { Domain } from "@vayva/shared";

const DEMO_DOMAINS: Domain[] = [
  {
    id: "dom_default",
    name: "mystore.vayva.app",
    type: "subdomain",
    status: "active",
    sslStatus: "active",
    dnsStatus: "verified",
    connectedAt: new Date().toISOString(),
  },
  // No custom domain connected yet for demo
];

export async function GET() {
  return NextResponse.json(DEMO_DOMAINS);
}
