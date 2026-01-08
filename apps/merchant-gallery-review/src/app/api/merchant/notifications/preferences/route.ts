import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";

const DEFAULT_PREFS = {
  channels: { in_app: true, banner: true, whatsapp: false, email: true },
  categories: { orders: true, payments: true, account: true, system: true },
  quietHours: { enabled: false, start: "22:00", end: "08:00" },
};

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.storeId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storeId = (session!.user as any).storeId;

  const prefs = await prisma.notificationPreference.findUnique({
    where: { storeId },
  });

  if (!prefs) {
    return NextResponse.json({
      ...DEFAULT_PREFS,
      merchantId: (session!.user as any).id,
    });
  }

  return NextResponse.json({
    channels: prefs.channels,
    categories: prefs.categories,
    quietHours: prefs.quietHours,
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.storeId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const storeId = (session!.user as any).storeId;
  const body = await req.json();

  // Upsert
  const updated = await prisma.notificationPreference.upsert({
    where: { storeId },
    update: {
      channels: body.channels,
      categories: body.categories,
      quietHours: body.quietHours,
    },
    create: {
      storeId,
      channels: body.channels || DEFAULT_PREFS.channels,
      categories: body.categories || DEFAULT_PREFS.categories,
      quietHours: body.quietHours || DEFAULT_PREFS.quietHours,
    },
  });

  return NextResponse.json(updated);
}
