import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";
import { gateLimit } from "@/lib/billing/entitlements";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cookieStore = await cookies();
  const storeId = cookieStore.get("x-active-store-id")?.value;
  if (!storeId)
    return new NextResponse("No active store session", { status: 400 });

  try {
    // 1. Get Entitlement
    // In real app, we might cache this or fetch from MerchantSubscription
    // For V1 MVP, we fetch existing subscription or default to growth/trial
    const subscription = await prisma.merchantSubscription.findUnique({
      where: { storeId },
    });
    const entitlement = {
      planSlug: (subscription?.planSlug || "growth") as "growth" | "pro",
      status: (subscription?.status || "trial") as any,
    };

    // 2. Used Seats
    const seatsUsed = await prisma.membership.count({ where: { storeId } });

    // 3. Check Gate
    const gate = gateLimit(entitlement, "teamSeats", seatsUsed);
    if (!gate.ok) {
      return NextResponse.json(gate.error, { status: 403 }); // Standard Gate Error
    }

    // 4. Create Invite (Pending)
    // await prisma.staffInvite.create(...)

    return NextResponse.json({ success: true, message: "Invite sent" });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
