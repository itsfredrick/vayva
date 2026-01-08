import { NextRequest, NextResponse } from "next/server";
import {
  normalizePhoneToE164,
  applyConsentUpdate,
} from "@/lib/consent/consent";
import { ConsentChannel, ConsentSource } from "@vayva/db";

export async function POST(req: NextRequest) {
  // In a real scenario, verify this request comes from the storefront backend
  // or is protected by a shared secret/session.
  // For this implementation, we assume it's called from a secure context or server action.

  const body = await req.json();
  const { merchantId, phone, optInOffers } = body;

  if (!merchantId || !phone) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  if (optInOffers) {
    const phoneE164 = normalizePhoneToE164(phone);
    if (phoneE164) {
      await applyConsentUpdate(
        merchantId,
        phoneE164,
        {
          marketingOptIn: true,
          marketingOptInSource: "checkout",
        },
        {
          channel: ConsentChannel.EMAIL,
          source: ConsentSource.CUSTOMER_ACTION, // It is customer action at checkout
          reason: "Checkout opt-in",
        },
      );
    }
  }

  return NextResponse.json({ ok: true });
}
