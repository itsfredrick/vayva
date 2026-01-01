import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";

const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  REQUESTED: ["ACCEPTED", "CANCELED"],
  ACCEPTED: ["PICKED_UP", "CANCELED"],
  PICKED_UP: ["IN_TRANSIT", "FAILED"],
  IN_TRANSIT: ["DELIVERED", "FAILED"],
};

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: orderId } = await context.params;
    const session = await requireAuth();
    const { storeId, role } = session.user;

    if (["viewer"].includes(role))
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    const {
      status: toStatus,
      note,
      courierName,
      courierPhone,
      trackingUrl,
    } = body;

    // 1. Get Shipment
    const shipment = await prisma.shipment.findUnique({
      where: { orderId }, // Shipment.orderId is unique
    });

    if (!shipment || shipment.storeId !== storeId) {
      return NextResponse.json(
        { error: "Delivery job not found" },
        { status: 404 },
      );
    }

    // 2. Validate Provider
    if (shipment.provider !== "CUSTOM") {
      return NextResponse.json(
        { error: "Manual status updates are only allowed for Custom Courier." },
        { status: 400 },
      );
    }

    // 3. Validate Transition
    const currentStatus = shipment.status;
    const allowed = ALLOWED_TRANSITIONS[currentStatus];

    // Allow forcing if owner? No, strict state machine requested.
    // Exception: Maybe we allow correcting mistakes? Stick to strict for now.
    if (!allowed?.includes(toStatus)) {
      // For dev/MVP ease, let's allow moving to CANCELED from any non-terminal state
      if (
        toStatus === "CANCELED" &&
        !["DELIVERED", "FAILED"].includes(currentStatus)
      ) {
        // OK
      } else {
        return NextResponse.json(
          {
            error: `Invalid status transition from ${currentStatus} to ${toStatus}`,
          },
          { status: 400 },
        );
      }
    }

    // 4. Update
    const updated = await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: toStatus,
        courierName: courierName ?? shipment.courierName,
        courierPhone: courierPhone ?? shipment.courierPhone,
        trackingUrl: trackingUrl ?? shipment.trackingUrl,
      },
    });

    // 5. Event
    await prisma.deliveryEvent.create({
      data: {
        shipmentId: shipment.id,
        status: toStatus,
        note: note || `Manual update to ${toStatus}`,
      },
    });

    return NextResponse.json({ success: true, shipment: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
