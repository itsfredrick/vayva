import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getSessionUser } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventName, properties } = body;

    // Optional: Get user context if logged in
    // We don't block on this, and fail gracefully if auth fails/missing
    let storeId = properties?.storeId;
    try {
      const sessionUser = await getSessionUser();
      if (sessionUser?.storeId) {
        storeId = sessionUser.storeId;
      }
    } catch (e) {
      // Ignore auth, might be anon
    }

    // Extract canonical fields from props
    // Normalize 'template' vs 'templateSlug'
    const templateSlug =
      properties?.templateSlug ||
      properties?.template ||
      properties?.templateId;
    const plan = properties?.plan;
    const entryPoint = properties?.entryPoint;
    const step = properties?.step || properties?.stepKey;
    const fastPath = !!properties?.fastPath;

    await prisma.onboardingAnalyticsEvent.create({
      data: {
        storeId,
        sessionId: properties?.sessionId,
        eventName,
        templateSlug,
        plan,
        entryPoint,
        step,
        fastPath,
        metadata: properties || {},
      },
    });

    // ---------------------------------------------------------
    // ALERTING: Simple In-Stream Checks
    // ---------------------------------------------------------
    if (eventName === "ONBOARDING_ABANDONED") {
      console.warn(
        `[ALERT] Onboarding Abandoned: Template=${templateSlug} Step=${step}`,
      );
    }

    // Alert on critical step failure
    if (eventName === "ONBOARDING_STEP_ERROR") {
      console.error(
        `[ALERT] Onboarding Step Error: Template=${templateSlug} Step=${step} Error=${properties?.error}`,
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Telemetry ingest error:", e);
    // Return 200 even on error to not break client
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
