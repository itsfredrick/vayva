import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth"; // Test or real
import { authOptions } from "@/lib/auth";
import { prisma } from "@vayva/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Find all stores where user is a member
    const memberships = await prisma.membership.findMany({
      where: { userId: (session!.user as any).id },
      include: { store: true },
    });

    const stores = memberships.map((m: any) => m.store);

    return NextResponse.json({ stores });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!(session?.user as any)?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if user is allowed to create more stores (Growth/Pro limit?)
  // For now, allow open creation.

  const body = await req.json();
  const { name, slug, category } = body;
  const { id: userId } = session!.user as any;

  if (!name || !slug)
    return new NextResponse("Name and Slug required", { status: 400 });

  try {
    // Check slug uniqueness
    const existing = await prisma.store.findUnique({ where: { slug } });
    if (existing)
      return new NextResponse("Slug already taken", { status: 409 });

    const newStore = await prisma.store.create({
      data: {
        name,
        slug,
        category: category || "general",
        onboardingStatus: "NOT_STARTED", // Explicitly new
        memberships: {
          create: {
            userId: (session!.user as any).id,
            role: "OWNER",
          },
        },
      },
    });

    // Initialize default settings, policies etc if needed
    // ...

    return NextResponse.json({ store: newStore });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}
