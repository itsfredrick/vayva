import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const session = await OpsAuthService.getSession();
  if (!session || !["OPS_OWNER", "OPS_ADMIN"].includes(session.user.role)) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    await OpsAuthService.logEvent(
      session?.user?.id || null,
      "OPS_UNAUTHORIZED_ACCESS",
      {
        ip,
        path: req.nextUrl.pathname,
        method: "GET",
        reason: "Role mismatch",
      },
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const users = await prisma.opsUser.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      lastLoginAt: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  role: z.enum(["OPS_ADMIN", "OPS_AGENT", "OPS_READONLY"]),
});

export async function POST(req: NextRequest) {
  const session = await OpsAuthService.getSession();
  if (!session || session.user.role !== "OPS_OWNER") {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    await OpsAuthService.logEvent(
      session?.user?.id || null,
      "OPS_UNAUTHORIZED_ACCESS",
      {
        ip,
        path: req.nextUrl.pathname,
        method: "POST",
        reason: "Not Owner",
      },
    );
    return NextResponse.json(
      { error: "Unauthorized. Only Owner can create users." },
      { status: 403 },
    );
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const { user, tempPassword } = await OpsAuthService.createUser(
      session.user.role,
      data,
    );

    await OpsAuthService.logEvent(session.user.id, "OPS_USER_CREATED", {
      targetUser: user.email,
      role: user.role,
    });

    return NextResponse.json({ user, tempPassword });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
