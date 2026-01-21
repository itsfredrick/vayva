import { NextResponse } from "next/server";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";
import { logger } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
export async function POST(request) {
    let body;
    try {
        body = await request.json();
        const { email, password, rememberMe } = body;
        // Rate Limit: 10 per hour per IP
        const ip = request.headers.get("x-forwarded-for") || email || "unknown";
        await checkRateLimit(ip, "login", 10, 3600);
        // Validation
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }
        // Find user with memberships
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
            include: {
                memberships: {
                    where: { status: "active" },
                    include: {
                        store: true,
                    },
                    select: {
                        storeId: true,
                        role: true,
                        status: true,
                        store: true
                    }
                },
            },
        });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        // Verify password
        const isValidPassword = await compare(password, user.password);
        if (!isValidPassword) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        // Check if email is verified (bypass in development)
        if (process.env.NODE_ENV === 'production' && !user.isEmailVerified) {
            return NextResponse.json({ error: "Please verify your email first" }, { status: 403 });
        }
        // Get user's store membership
        const membership = user.memberships[0];
        if (!membership) {
            return NextResponse.json({ error: "No active store membership found" }, { status: 500 });
        }
        // Get onboarding status
        const onboarding = await prisma.merchantOnboarding.findUnique({
            where: { storeId: membership.storeId },
        });
        // Create session
        const sessionUser = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            storeId: membership.storeId,
            storeName: membership.store.name,
            role: membership.role?.name || "MEMBER",
        };
        await createSession(sessionUser, undefined, ip, rememberMe);
        // Return user and merchant data
        return NextResponse.json({
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: membership.role?.name || "MEMBER",
                emailVerified: user.isEmailVerified,
                phoneVerified: user.isPhoneVerified || false,
                createdAt: user.createdAt,
            },
            merchant: {
                merchantId: user.id,
                storeId: membership.storeId,
                storeName: membership.store.name,
                onboardingStatus: onboarding?.status || "IN_PROGRESS",
                onboardingLastStep: membership.store.onboardingLastStep || "welcome",
                onboardingCompleted: membership.store.onboardingCompleted || false,
                onboardingUpdatedAt: onboarding?.updatedAt || new Date(),
                plan: membership.store.plan || "STARTER",
            },
        });
    }
    catch (error) {
        logger.error("Login failed", error, { email: body?.email });
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
