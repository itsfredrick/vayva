import { requireAuth } from "./session";
import { prisma } from "@vayva/db";
import { cookies } from "next/headers";
import { sign, verify } from "jsonwebtoken";

const PIN_SESSION_SECRET =
  process.env.PIN_SESSION_SECRET || "fallback-pin-secret-change-in-prod";
const PIN_COOKIE_NAME = "vayva_pin_session";

export type GatingResult = {
  allowed: boolean;
  reason?: string;
  requiredAction?: "COMPLETE_KYC" | "SUBSCRIBE" | "SET_PIN" | "VERIFY_PIN";
};

/**
 * Checks if the current merchant has access to a specific feature.
 * Enforces KYC, Subscription, and PIN requirements server-side.
 */
export async function checkFeatureAccess(
  feature: string,
): Promise<GatingResult> {
  const session = await requireAuth();
  const storeId = session.user.storeId;

  const store = await prisma.store.findUnique({
    where: { id: storeId },
    include: {
      wallet: true,
      merchantSubscription: true,
    },
  });

  if (!store) return { allowed: false, reason: "Store not found" };

  // 1. PIN Check (Critical for sensitive actions)
  const pinSensitiveFeatures = [
    "wallet",
    "payouts",
    "bank_settings",
    "billing_management",
  ];
  if (pinSensitiveFeatures.includes(feature)) {
    if (!store.wallet?.pinSet) {
      return {
        allowed: false,
        reason: "Security PIN not set",
        requiredAction: "SET_PIN",
      };
    }

    // Check PIN session cookie
    const cookieStore = await cookies();
    const pinCookie = cookieStore.get(PIN_COOKIE_NAME);
    if (!pinCookie) {
      return {
        allowed: false,
        reason: "Security PIN verification required",
        requiredAction: "VERIFY_PIN",
      };
    }

    try {
      const decoded = verify(pinCookie.value, PIN_SESSION_SECRET) as {
        storeId: string;
        pinVersion: number;
      };
      if (
        decoded.storeId !== storeId ||
        decoded.pinVersion !== (store.wallet?.pinVersion || 0)
      ) {
        return {
          allowed: false,
          reason: "Invalid or expired security session",
          requiredAction: "VERIFY_PIN",
        };
      }
    } catch (e: any) {
      return {
        allowed: false,
        reason: "Security session expired",
        requiredAction: "VERIFY_PIN",
      };
    }
  }

  // 2. KYC Check
  const kycRequiredFeatures = [
    "payouts",
    "wallet_withdraw",
    "high_volume_processing",
  ];
  if (kycRequiredFeatures.includes(feature)) {
    if (store.wallet?.kycStatus !== "VERIFIED") {
      return {
        allowed: false,
        reason: "KYC verification required",
        requiredAction: "COMPLETE_KYC",
      };
    }
  }

  // 3. Subscription Check
  const subscriptionRequiredFeatures = [
    "custom_domain",
    "premium_templates",
    "referral_rewards",
  ];
  if (subscriptionRequiredFeatures.includes(feature)) {
    const subStatus = store.merchantSubscription?.status;
    if (subStatus !== "active" && subStatus !== "trialing") {
      return {
        allowed: false,
        reason: "Active subscription required",
        requiredAction: "SUBSCRIBE",
      };
    }
  }

  return { allowed: true };
}

/**
 * Creates a secure PIN session cookie valid for 30 minutes.
 * Includes pinVersion to allow invalidation on PIN change.
 */
export async function createPinSession(storeId: string, pinVersion: number) {
  const token = sign({ storeId, pinVersion }, PIN_SESSION_SECRET, {
    expiresIn: "30m",
  });
  const cookieStore = await cookies();

  cookieStore.set(PIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 60, // 30 minutes
    path: "/",
  });
}
