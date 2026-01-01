import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { createSession } from "@/lib/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, code } = body;

    // Validation
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 },
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        memberships: {
          where: { status: "active" },
          include: { store: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if already verified
    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 },
      );
    }

    // Find the OTP code
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        identifier: email.toLowerCase(),
        type: "EMAIL_VERIFICATION",
        isUsed: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "No valid OTP found" },
        { status: 400 },
      );
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
    }

    // Verify OTP code
    const isE2EBypass =
      (process.env.NODE_ENV === "test" ||
        process.env.NODE_ENV === "development") &&
      email.toLowerCase().includes("e2e") &&
      code === "123456";

    if (otpRecord.code !== code && !isE2EBypass) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 },
      );
    }

    // Update user and mark OTP as used in a transaction
    await prisma.$transaction([
      // Mark email as verified
      prisma.user.update({
        where: { id: user.id },
        data: { isEmailVerified: true },
      }),
      // Mark OTP as used
      prisma.otpCode.update({
        where: { id: otpRecord.id },
        data: { isUsed: true },
      }),
    ]);

    // Get user's store for session
    const membership = user.memberships[0];
    if (!membership) {
      return NextResponse.json(
        { error: "No store membership found" },
        { status: 500 },
      );
    }

    // Create session
    const sessionUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      storeId: membership.storeId,
      storeName: membership.store.name,
      role: membership.role,
    };

    await createSession(sessionUser);

    return NextResponse.json({
      message: "Email verified successfully",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: true,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
