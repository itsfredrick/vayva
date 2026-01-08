import { NextResponse } from "next/server";
import { SalesChannel } from "@vayva/shared";

const DEMO_CHANNELS: SalesChannel[] = [
  {
    id: "ch_web",
    type: "website",
    name: "Online Store",
    status: "enabled",
    url: "https://mystore.vayva.app",
  },
  {
    id: "ch_wa",
    type: "whatsapp",
    name: "WhatsApp Shop",
    status: "enabled",
    url: "https://wa.me/2348000000000",
  },
];

export async function GET() {
  return NextResponse.json(DEMO_CHANNELS);
}
