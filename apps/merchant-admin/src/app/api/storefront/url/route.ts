import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    url: "https://fred-store.vayva.app",
    custom_domain_url: null,
  });
}
