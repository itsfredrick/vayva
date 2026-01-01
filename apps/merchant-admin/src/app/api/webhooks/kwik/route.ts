import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { FEATURES } from "@/lib/env-validation";

// Kwik Webhook Receiver
export async function POST(request: Request) {
  try {
    if (!FEATURES.DELIVERY_ENABLED) {
      return NextResponse.json(
        { error: "Delivery integration not configured" },
        { status: 503 },
      );
    }

    const bodyText = await request.text();
    const payload = JSON.parse(bodyText);

    // Kwik payload structure assumption:
    // { job_id: "...", status: "...", tracking_url: "..." }
    const { job_id, status, tracking_url } = payload;

    if (!job_id || !status) {
      return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
    }

    // 3. Find Shipment using trackingCode (mapped to External Job ID)
    // @ts-ignore - Schema confirms field exists
    const shipment = await prisma.shipment.findFirst({
      where: { trackingCode: job_id },
    });

    if (!shipment) {
      console.warn(`Kwik Webhook: Shipment not found for Job ID ${job_id}`);
      return NextResponse.json({ message: "Ignored: Shipment not found" });
    }

    // 4. Map Status
    const newStatus = mapKwikStatusToInternal(status);

    // 5. Update Shipment
    // Append update to notes since providerRawStatus might be missing in older Prisma client
    // @ts-ignore - Schema confirms field exists
    const currentNotes = shipment.notes || "";
    const newNote = `[${new Date().toISOString()}] Status Update: ${status}`;

    await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        status: newStatus,
        trackingUrl: tracking_url || shipment.trackingUrl,
        // @ts-ignore - Schema confirms field exists
        notes: currentNotes ? `${currentNotes}\n${newNote}` : newNote,
      },
    });

    // NOT writing to DeliveryEvent as it appears missing in the generated client

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mapKwikStatusToInternal(kwikStatus: string): string {
  const s = kwikStatus.toUpperCase();

  if (["QUEUED", "PENDING", "UPCOMING"].includes(s)) return "REQUESTED";
  if (["ASSIGNED", "ACCEPTED"].includes(s)) return "ACCEPTED";
  if (["PICKED_UP", "STARTED", "ON_WAY_TO_DROPOFF"].includes(s))
    return "IN_TRANSIT";
  if (["DELIVERED", "COMPLETED", "ENDED"].includes(s)) return "DELIVERED";
  if (["CANCELLED", "CANCELED"].includes(s)) return "CANCELED";
  if (["FAILED", "RETURNED"].includes(s)) return "FAILED";

  return "IN_TRANSIT";
}
