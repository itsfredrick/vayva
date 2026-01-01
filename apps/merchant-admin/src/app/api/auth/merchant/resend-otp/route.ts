import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user exists and is not yet verified
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 },
      );
    }

    // Generate new OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10);

    // Mark old OTPs as used
    await prisma.otpCode.updateMany({
      where: {
        identifier: normalizedEmail,
        type: "EMAIL_VERIFICATION",
        isUsed: false,
      },
      data: { isUsed: true },
    });

    // Create new OTP code
    await prisma.otpCode.create({
      data: {
        identifier: normalizedEmail,
        code: otpCode,
        type: "EMAIL_VERIFICATION",
        expiresAt: otpExpiresAt,
      },
    });

    // Send OTP via email
    const { ResendEmailService } = await import("@/lib/email/resend");
    await ResendEmailService.sendOTPEmail(
      user.email,
      otpCode,
      user.firstName || "Merchant",
    );

    return NextResponse.json({
      message: "A new verification code has been sent to your email.",
      email: user.email,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification code" },
      { status: 500 },
    );
  }
}
