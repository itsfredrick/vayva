import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

// GET Settings
export async function GET(request: Request) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;

    const settings = await prisma.storeDeliverySettings.findUnique({
      where: { storeId },
    });

    if (!settings) {
      // Return defaults if none exist
      return NextResponse.json({
        isEnabled: false,
        provider: "CUSTOM", // Default as per spec
        isKwikConfigured: !!process.env.KWIK_API_KEY,
        autoDispatchEnabled: false,
        autoDispatchMode: "CONFIRM",
        autoDispatchWhatsapp: true,
        autoDispatchStorefront: true,
        pickup: {},
      });
    }

    return NextResponse.json({
      isEnabled: settings.isEnabled,
      provider: settings.provider,
      isKwikConfigured: !!process.env.KWIK_API_KEY, // Feature flag status
      autoDispatchEnabled: settings.autoDispatchEnabled,
      autoDispatchMode: settings.autoDispatchMode,
      autoDispatchWhatsapp: settings.autoDispatchWhatsapp,
      autoDispatchStorefront: settings.autoDispatchStorefront,
      pickup: {
        name: settings.pickupName,
        phone: settings.pickupPhone,
        addressLine1: settings.pickupAddressLine1,
        addressLine2: settings.pickupAddressLine2,
        city: settings.pickupCity,
        state: settings.pickupState,
        landmark: settings.pickupLandmark,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 },
    );
  }
}

// POST Settings (Admin/Owner only)
export async function POST(request: Request) {
  try {
    const session = await requireAuth();
    const { role, storeId } = session.user;

    // Strict Role Check
    if (role !== "owner" && role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      provider,
      isEnabled,
      pickup,
      autoDispatchEnabled,
      autoDispatchMode,
      autoDispatchWhatsapp,
      autoDispatchStorefront,
    } = body;

    // Validation: If enabled, pickup fields required
    if (isEnabled) {
      if (!pickup?.addressLine1 || !pickup?.city || !pickup?.phone) {
        return NextResponse.json(
          {
            error:
              "Pickup address (Line 1, City) and Phone are required when delivery is enabled.",
          },
          { status: 400 },
        );
      }
    }

    // Validation: Auto-Dispatch Guards
    if (autoDispatchEnabled) {
      if (!isEnabled) {
        return NextResponse.json(
          {
            error: "Cannot enable auto-dispatch if main delivery is disabled.",
          },
          { status: 400 },
        );
      }
      if (provider === "KWIK" && !process.env.KWIK_API_KEY) {
        return NextResponse.json(
          { error: "Cannot enable auto-dispatch for Kwik without API Key." },
          { status: 400 },
        );
      }
      // Ensure pickup exists (redundant if isEnabled logic holds, but safe)
      if (!pickup?.addressLine1) {
        return NextResponse.json(
          { error: "Pickup address required for auto-dispatch." },
          { status: 400 },
        );
      }
    }

    // Upsert
    const settings = await prisma.storeDeliverySettings.upsert({
      where: { storeId },
      create: {
        storeId,
        provider,
        isEnabled,
        autoDispatchEnabled,
        autoDispatchMode: autoDispatchMode || "CONFIRM",
        autoDispatchWhatsapp: autoDispatchWhatsapp ?? true,
        autoDispatchStorefront: autoDispatchStorefront ?? true,
        pickupName: pickup.name,
        pickupPhone: pickup.phone,
        pickupAddressLine1: pickup.addressLine1,
        pickupAddressLine2: pickup.addressLine2,
        pickupCity: pickup.city,
        pickupState: pickup.state,
        pickupLandmark: pickup.landmark,
      },
      update: {
        provider,
        isEnabled,
        autoDispatchEnabled,
        autoDispatchMode: autoDispatchMode || "CONFIRM",
        autoDispatchWhatsapp: autoDispatchWhatsapp ?? true,
        autoDispatchStorefront: autoDispatchStorefront ?? true,
        pickupName: pickup.name,
        pickupPhone: pickup.phone,
        pickupAddressLine1: pickup.addressLine1,
        pickupAddressLine2: pickup.addressLine2,
        pickupCity: pickup.city,
        pickupState: pickup.state,
        pickupLandmark: pickup.landmark,
      },
    });

    // Audit Log
    try {
      const { logAudit, AuditAction } = await import("@/lib/audit");
      await logAudit({
        storeId,
        actor: { type: "USER", id: session.user.id, label: session.user.email },
        action: "DELIVERY_AUTOMATION_UPDATED",
        entity: { type: "DELIVERY_SETTINGS", id: settings.id },
        after: {
          enabled: autoDispatchEnabled,
          mode: autoDispatchMode,
          whatsapp: autoDispatchWhatsapp,
          storefront: autoDispatchStorefront,
        },
      });
    } catch (ignore) {
      console.warn("[Audit] Failed to log delivery settings update");
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to save settings" },
      { status: 500 },
    );
  }
}
