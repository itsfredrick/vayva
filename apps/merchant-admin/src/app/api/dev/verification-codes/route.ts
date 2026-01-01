import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

/**
 * DEV/TEST ONLY: Get verification codes for an email or the latest ones.
 * Useful for E2E testing when you cannot access the email provider.
 */
export async function GET(request: NextRequest) {
  // Safety check: Only allow in non-production or if explicitly enabled
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_DEV_ENDPOINTS !== "true"
  ) {
    return NextResponse.json(
      { error: "Not allowed in production" },
      { status: 403 },
    );
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  try {
    if (email) {
      const codes = await prisma.otpCode.findMany({
        where: { identifier: email.toLowerCase() },
        orderBy: { createdAt: "desc" },
        take: 10,
      });
      return NextResponse.json({ codes });
    }

    const latestCodes = await prisma.otpCode.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return NextResponse.json({ latestCodes });
  } catch (error) {
    console.error("Dev verification codes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch codes" },
      { status: 500 },
    );
  }
}
