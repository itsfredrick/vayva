import { NextRequest, NextResponse } from 'next/server';
import { prisma, Prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { user } = await OpsAuthService.requireSession();
    OpsAuthService.requireRole(user, "OPS_SUPPORT");

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
            {
              tenant: {
                tenantMemberships: {
                  some: {
                    user: {
                      OR: [
                        { email: { contains: search, mode: "insensitive" } },
                        { firstName: { contains: search, mode: "insensitive" } },
                        { lastName: { contains: search, mode: "insensitive" } },
                        { phone: { contains: search, mode: "insensitive" } },
                      ]
                    }
                  }
                }
              }
            }
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
          aiSubscription: true,
          wallet: {
            select: {
              kycStatus: true,
              isLocked: true
            }
          },
          orders: {
            where: {
              createdAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              },
              paymentStatus: "SUCCESS" // Assuming SUCCESS means paid volume
            },
            select: {
              total: true
            }
          },
          tenant: {
            include: {
              tenantMemberships: {
                include: {
                  user: {
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
      // Find owner
      const members = store.tenant?.tenantMemberships || [];
      const ownerMember = members.find((m: any) => m.role === "OWNER") || members[0];
      const owner = ownerMember?.user;
      const ownerName = owner ? `${owner.firstName || ""} ${owner.lastName || ""}`.trim() : "Unknown";

      // Calculate GMV
      const gmv30d = store.orders.reduce((sum: number, o: any) => sum + Number(o.total), 0);

      // Determine Risk
      const riskFlags = [];
      if (store.wallet?.isLocked) riskFlags.push("WALLET_LOCKED");

      return {
        id: store.id,
        name: store.name,
        slug: store.slug,
        ownerName: ownerName || "Unknown",
        ownerEmail: owner?.email || "Unknown",
        status: "ACTIVE",
        plan: store.plan || "FREE",
        trialEndsAt: (store as any).aiSubscription?.trialEndsAt
          ? (store as any).aiSubscription.trialEndsAt.toISOString()
          : null,
        kycStatus: store.wallet?.kycStatus || "NOT_SUBMITTED",
        riskFlags,
        gmv30d: gmv30d,
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
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}
