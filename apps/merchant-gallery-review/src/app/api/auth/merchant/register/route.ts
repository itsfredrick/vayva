import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@vayva/db";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { FlagService } from "@/lib/flags/flagService";
import { RevenueService } from "@/lib/ai/revenue.service";

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
    const { email, password, firstName, lastName, businessName } = body;

    // 0. Kill Switch & Rate Limit
    const isEnabled = await FlagService.isEnabled("onboarding.enabled");
    if (!isEnabled) {
      return NextResponse.json(
        { error: "Registration is temporarily disabled" },
        { status: 503 },
      );
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown";
    await checkRateLimit(ip, "register", 5, 3600);

    // 0.1 AI Anti-Abuse Check
    const ipHash = Buffer.from(ip).toString("base64"); // Simple hash for demo
    const abuseCheck = await RevenueService.checkTrialEligibility({
      ipHash,
      fingerprintHash: body.deviceFingerprint || "no-fingerprint",
      emailDomain: email.split("@")[1],
    });

    if (!abuseCheck.allowed) {
      return NextResponse.json({ error: abuseCheck.reason }, { status: 403 });
    }

    // Soft Launch Protection
    const launchMode = process.env.LAUNCH_MODE || "public";
    if (launchMode === "soft") {
      const inviteToken = body.inviteToken;
      if (!inviteToken) {
        return NextResponse.json(
          {
            error: "Early Access Only",
            message:
              "Vayva is currently in soft launch. Please join the waitlist or provide an invitation code.",
          },
          { status: 403 },
        );
      }
      // In a real app, verify inviteToken in DB.
    }

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 },
      );
    }

    // Password validation (minimum 8 characters)
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Generate OTP (6-digit code)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date();
    otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10); // 10 minutes expiry

    // Create user and store in a transaction
    const user = await prisma.$transaction(async (tx: any) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName,
          lastName,
          isEmailVerified: false,
        },
      });

      // Create initial store for the merchant
      const storeName = businessName || `${firstName}'s Store`;
      const store = await tx.store.create({
        data: {
          name: storeName,
          slug: `${storeName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
          onboardingCompleted: false,
          onboardingLastStep: "welcome",
        },
      });

      // Create membership (owner role)
      await tx.membership.create({
        data: {
          userId: newUser.id,
          storeId: store.id,
          role: "owner",
          status: "active",
        },
      });

      // Create OTP code
      await tx.otpCode.create({
        data: {
          identifier: email.toLowerCase(),
          code: otpCode,
          type: "EMAIL_VERIFICATION",
          expiresAt: otpExpiresAt,
        },
      });

      // Create initial onboarding record
      await tx.merchantOnboarding.create({
        data: {
          storeId: store.id,
          currentStepKey: "welcome",
          completedSteps: [],
          data: {
            business: {
              name: storeName,
              email: email.toLowerCase(),
            },
            user: {
              firstName,
              lastName,
            },
          },
        },
      });

      // Initialize AI Subscription
      const starterPlan = await tx.aiPlan.findUnique({
        where: { name: "STARTER" },
      });
      if (starterPlan) {
        const now = new Date();
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 14); // 14-day trial

        await tx.merchantAiSubscription.create({
          data: {
            storeId: store.id,
            planId: starterPlan.id,
            planKey: "STARTER",
            periodStart: now,
            periodEnd: expiry,
            trialExpiresAt: expiry,
            status: "TRIAL_ACTIVE",
          },
        });

        await tx.merchantAiProfile.create({
          data: {
            storeId: store.id,
            agentName: `${firstName}'s Assistant`,
            tonePreset: "Friendly",
          },
        });
      }

      return newUser;
    });

    // Send OTP via email
    const { ResendEmailService } = await import("@/lib/email/resend");
    await ResendEmailService.sendOTPEmail(user.email, otpCode, firstName);

    return NextResponse.json({
      message:
        "Registration successful. Please check your email for verification code.",
      email: user.email,
    });
  } catch (error) {
    logger.error("Registration error", error, { email: body?.email });
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
