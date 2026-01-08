import { NextResponse } from "next/server";
import { Integration } from "@vayva/shared";

const DEMO_INTEGRATIONS: Integration[] = [
  {
    id: "int_paystack",
    name: "Paystack",
    provider: "paystack",
    logoUrl: "CreditCard", // Using Icon name proxy
    description: "Accept payments via Card, Bank Transfer, and USSD.",
    status: "connected",
    connectedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    configRequired: false,
  },
  {
    id: "int_whatsapp",
    name: "WhatsApp Business",
    provider: "whatsapp",
    logoUrl: "MessageCircle",
    description: "Automated order notifications and customer support.",
    status: "connected",
    connectedAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    configRequired: false,
  },
  {
    id: "int_ga",
    name: "Google Analytics",
    provider: "google_analytics",
    logoUrl: "BarChart",
    description: "Track website traffic and user behavior.",
    status: "not_connected",
    configRequired: true,
  },
];

export async function GET() {
  return NextResponse.json(DEMO_INTEGRATIONS);
}
