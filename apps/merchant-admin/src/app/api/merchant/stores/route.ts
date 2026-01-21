import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
  PERMISSIONS.COMMERCE_VIEW,
  async (req: NextRequest, { user }: HandlerContext) => {
    try {
      const memberships = await prisma.membership.findMany({
        where: { userId: user.id },
        include: { store: true },
      });

      const stores = memberships.map((m: any) => m.store);
      return NextResponse.json({ stores });
    } catch (error: any) {
      console.error("Fetch Stores Error:", error);
      return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
  }
);

export const POST = withVayvaAPI(
  PERMISSIONS.COMMERCE_VIEW,
  async (req: NextRequest, { user }: HandlerContext) => {
    try {
      const body = await req.json();
      const { name, slug, category } = body;

      if (!name || !slug) {
        return NextResponse.json({ error: "Name and Slug required" }, { status: 400 });
      }

      const existing = await prisma.store.findUnique({ where: { slug } });
      if (existing) {
        return NextResponse.json({ error: "Slug already taken" }, { status: 409 });
      }

      const newStore = await prisma.store.create({
        data: {
          name,
          slug,
          category: category || "general",
          onboardingStatus: "NOT_STARTED",
          memberships: {
            create: {
              userId: user.id,
              role_enum: "OWNER",
            },
          },
          aiSubscription: {
            create: {
              plan: {
                connect: { name: "STARTER" },
              },
              planKey: "STARTER",
              status: "TRIAL_ACTIVE",
              periodStart: new Date(),
              periodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              trialExpiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            },
          },
        },
      });

      return NextResponse.json({ store: newStore });
    } catch (error: any) {
      console.error("Create Store Error:", error);
      return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
  }
);
