import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { prisma } from '@vayva/db';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password, firstName, lastName, businessName } = body;

        // Validation
        if (!email || !password || !firstName || !lastName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: 'Invalid email format' },
                { status: 400 }
            );
        }

        // Password validation (minimum 8 characters)
        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hash(password, 10);

        // Generate OTP (6-digit code)
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiresAt = new Date();
        otpExpiresAt.setMinutes(otpExpiresAt.getMinutes() + 10); // 10 minutes expiry

        // Create user and store in a transaction
        const user = await prisma.$transaction(async (tx) => {
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
                    slug: `${storeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`,
                    onboardingCompleted: false,
                    onboardingLastStep: 'welcome',
                },
            });

            // Create membership (owner role)
            await tx.membership.create({
                data: {
                    userId: newUser.id,
                    storeId: store.id,
                    role: 'owner',
                    status: 'active',
                },
            });

            // Create OTP code
            await tx.otpCode.create({
                data: {
                    identifier: email.toLowerCase(),
                    code: otpCode,
                    type: 'EMAIL_VERIFICATION',
                    expiresAt: otpExpiresAt,
                },
            });

            // Create initial onboarding record
            await tx.merchantOnboarding.create({
                data: {
                    storeId: store.id,
                    currentStepKey: 'welcome',
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

            return newUser;
        });

        // Send OTP via email
        const { ResendEmailService } = await import('@/lib/email/resend');
        await ResendEmailService.sendOTPEmail(
            user.email,
            otpCode,
            firstName
        );

        // Log to console in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEV] Verification code for ${email}: ${otpCode}`);
        }

        return NextResponse.json({
            message: 'Registration successful. Please check your email for verification code.',
            email: user.email,
        });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}
