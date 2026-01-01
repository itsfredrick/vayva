import { NextRequest, NextResponse } from "next/server";
import {
  applyConsentUpdate,
  normalizePhoneToE164,
} from "@/lib/consent/consent";
import { ConsentChannel, ConsentSource } from "@vayva/db";

// This is a simplified webhook handler focusing ONLY on Keyword Opt-Out
export async function POST(req: NextRequest) {
  const body = await req.json();

  // Extract message details (structure depends on WhatsApp provider, assuming generic/meta here)
  // For simulation/testing purposes, we expect: { merchantId, from, text }
  const { merchantId, from, text } = body;

  if (!merchantId || !from || !text) {
    return new NextResponse("Invalid payload", { status: 400 });
  }

  const cleanText = text.trim().toUpperCase();
  const keywords = ["STOP", "UNSUBSCRIBE", "CANCEL", "NO PROMOS"];

  if (keywords.includes(cleanText)) {
    const phoneE164 = normalizePhoneToE164(from);
    if (phoneE164) {
      await applyConsentUpdate(
        merchantId,
        phoneE164,
        {
          marketingOptIn: false,
        },
        {
          channel: ConsentChannel.WHATSAPP,
          source: ConsentSource.CUSTOMER_ACTION,
          reason: `Keyword opt-out: ${cleanText}`,
        },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
