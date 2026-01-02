import {
  prisma,
  ConsentEventType,
  ConsentChannel,
  ConsentSource,
} from "@vayva/db";
import type { communication_consent } from "@vayva/db";

export enum MessageIntent {
  TRANSACTIONAL = "TRANSACTIONAL",
  MARKETING = "MARKETING",
}

// -----------------------------------------------------------------------------
// Phone Normalization
// -----------------------------------------------------------------------------
export function normalizePhoneToE164(
  input: string,
  country = "NG",
): string | null {
  let digits = input.replace(/\D/g, "");

  if (country === "NG") {
    if (digits.startsWith("0") && digits.length === 11) {
      digits = "234" + digits.substring(1);
    } else if (digits.length === 10 && ["7", "8", "9"].includes(digits[0])) {
      digits = "234" + digits;
    }
  }

  if (digits.length < 10) return null;

  return "+" + digits;
}

// -----------------------------------------------------------------------------
// Get Consent (with defaults)
// -----------------------------------------------------------------------------
export async function getConsent(
  merchantId: string,
  phoneE164: string,
): Promise<communication_consent> {
  const consent = await prisma.communication_consent.findFirst({
    where: {
      merchantId,
      phoneE164,
    },
  });

  if (consent) return consent;

  return {
    merchantId,
    phoneE164,
    marketingOptIn: false,
    marketingOptInSource: "unknown",
    transactionalAllowed: true,
    fullyBlocked: false,
    customerId: null,
  } as any;
}

// -----------------------------------------------------------------------------
// Update Consent + Log Event
// -----------------------------------------------------------------------------
interface ConsentPatch {
  marketingOptIn?: boolean;
  marketingOptInSource?: string;
  transactionalAllowed?: boolean;
  fullyBlocked?: boolean;
}

export async function applyConsentUpdate(
  merchantId: string,
  phoneE164: string,
  patch: ConsentPatch,
  meta: {
    channel: ConsentChannel;
    source: ConsentSource;
    reason?: string;
  },
): Promise<communication_consent> {
  const existing = await getConsent(merchantId, phoneE164);

  let eventType: ConsentEventType = ConsentEventType.OPT_IN;

  if (patch.fullyBlocked === true) eventType = ConsentEventType.BLOCK_ALL;
  else if (patch.fullyBlocked === false && (existing as any).fullyBlocked)
    eventType = ConsentEventType.UNBLOCK;
  else if (patch.marketingOptIn === true) eventType = ConsentEventType.OPT_IN;
  else if (patch.marketingOptIn === false) eventType = ConsentEventType.OPT_OUT;
  else if (patch.transactionalAllowed === true)
    eventType = ConsentEventType.TRANSACTIONAL_ON;
  else if (patch.transactionalAllowed === false)
    eventType = ConsentEventType.TRANSACTIONAL_OFF;

  // Use transaction with safe explicit logic since upsert via compound ID is tricky without known input type
  const [updated] = await prisma.$transaction(async (tx: any) => {
    const found = await tx.communication_consent.findFirst({
      where: { merchantId, phoneE164 },
    });

    let result;
    if (found) {
      result = await tx.communication_consent.update({
        where: { id: found.id },
        data: {
          marketingOptIn: patch.marketingOptIn,
          marketingOptInSource: patch.marketingOptInSource,
          transactionalAllowed: patch.transactionalAllowed,
          fullyBlocked: patch.fullyBlocked,
          updatedAt: new Date(),
        },
      });
    } else {
      result = await tx.communication_consent.create({
        data: {
          merchantId,
          phoneE164,
          marketingOptIn: patch.marketingOptIn ?? false,
          marketingOptInSource: patch.marketingOptInSource || "unknown",
          transactionalAllowed: patch.transactionalAllowed ?? true,
          fullyBlocked: patch.fullyBlocked ?? false,
        },
      });
    }

    await tx.compliance_event.create({
      data: {
        merchantId,
        phoneE164,
        eventType,
        channel: meta.channel,
        source: meta.source,
        // Cast patch to any to avoid strict Json compatibility issues
        metadata: { reason: meta.reason, patch: patch as any },
      },
    });

    return [result];
  });

  return updated;
}

// -----------------------------------------------------------------------------
// Send-Time Enforcement
// -----------------------------------------------------------------------------
export function shouldSendMessage(
  messageIntent: MessageIntent,
  consent: communication_consent,
): { allowed: boolean; reason?: string } {
  if (consent.fullyBlocked) {
    return { allowed: false, reason: "blocked_all" };
  }

  if (messageIntent === MessageIntent.MARKETING) {
    if (!consent.marketingOptIn) {
      return { allowed: false, reason: "no_marketing_consent" };
    }
  }

  if (messageIntent === MessageIntent.TRANSACTIONAL) {
    if (!consent.transactionalAllowed) {
      return { allowed: false, reason: "transactional_disabled" };
    }
  }

  return { allowed: true };
}
