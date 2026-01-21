import { NextResponse } from "next/server";

import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const store = await prisma.store.findUnique({
    where: { id: user.storeId },
    select: { slug: true }
  });

  const slug = store?.slug || "store";
  return NextResponse.json({
    url: `https://${slug}.vayva.ng`,
    custom_domain_url: null,
  });
}
