import { NextResponse } from "next/server";
import { prisma, Prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("q") || searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    const where: Prisma.StoreWhereInput = {
      AND: [
        search ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { slug: { contains: search, mode: "insensitive" } },
          ]
        } : {}
      ]
    };

    const [stores, total] = await Promise.all([
      prisma.store.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
        include: {
          tenant: {
            include: {
              TenantMembership: {
                include: {
                  User: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true
                    }
                  }
                }
              }
            }
          },
          _count: {
            select: {
              orders: true,
            },
          },
        },
      }),
      prisma.store.count({ where }),
    ]);

    const data = stores.map((store: any) => {
      // Find owner from tenant memberships
      const members = store.tenant?.TenantMembership || [];
      // Assuming default owner role string "OWNER", adjust if it is strictly typed enum
      const ownerMember = members.find((m: any) => m.role === "OWNER") || members[0];
      const owner = ownerMember?.User;

      const ownerName = owner
        ? `${owner.firstName || ""} ${owner.lastName || ""}`.trim()
        : "Unknown";

      return {
        id: store.id,
        name: store.name,
        slug: store.slug,
        ownerName: ownerName || "Unknown",
        ownerEmail: owner?.email || "Unknown",
        status: "ACTIVE", // TODO: Map from store.onboardingStatus or similar?
        plan: store.plan || "FREE",
        kycStatus: "APPROVED", // Placeholder
        riskFlags: [],
        gmv30d: 0, // Placeholder needs aggregation
        lastActive: store.createdAt.toISOString(),
        createdAt: store.createdAt.toISOString(),
        location: "N/A",
      };
    });

    return NextResponse.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Fetch Merchants Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
