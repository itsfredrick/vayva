import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { kycService, KycMethod } from "@/services/kyc";
import { checkRateLimit } from "@/lib/rate-limit";
import { FlagService } from "@/lib/flags/flagService";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;
    const userId = session.user.id;
    const body = await req.json();

    // Kill Switch & Rate Limit
    const isEnabled = await FlagService.isEnabled("kyc.enabled", {
      merchantId: storeId,
    });
    if (!isEnabled) {
      return NextResponse.json(
        { error: "Identity verification is temporarily paused" },
        { status: 503 },
      );
    }

    await checkRateLimit(userId, "kyc_verify", 2, 3600, storeId);

    const { method, idNumber, firstName, lastName, dob, consent, selfie } =
      body;
    const ip = req.headers.get("x-forwarded-for") || "unknown";

    if (!method || !idNumber || !firstName || !lastName || !consent) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await kycService.verifyIdentity(storeId, {
      method: method as KycMethod,
      idNumber,
      firstName,
      lastName,
      dob,
      consent,
      ipAddress: ip,
      selfie,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Verification failed" },
        { status: 422 },
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("KYC verification error:", error);

    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 },
    );
  }
}
