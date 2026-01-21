import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { syncOnboardingData } from "@/lib/onboarding-sync";
import { ONBOARDING_PROFILES } from "@/lib/onboarding-profiles";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit-enhanced";
export async function POST(request) {
    try {
        // Apply rate limiting
        const rateLimitResult = await applyRateLimit(request, "onboarding-complete", RATE_LIMITS.ONBOARDING_COMPLETE);
        if (!rateLimitResult.allowed) {
            return rateLimitResult.response;
        }
        // Get authenticated user from session
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        // ENHANCED VALIDATION: Check email verification
        const user = await prisma.user.findUnique({
            where: { id: sessionUser.id },
            select: { isEmailVerified: true }
        });
        if (!user?.isEmailVerified) {
            return NextResponse.json({
                error: "Email verification required before completing onboarding.",
                code: "EMAIL_NOT_VERIFIED",
                action: "verify_email"
            }, { status: 422 });
        }
        // Fetch current onboarding state
        const onboarding = await prisma.merchantOnboarding.findUnique({
            where: { storeId: sessionUser.storeId },
        });
        if (onboarding?.data) {
            const state = onboarding.data;
            // FAST PATH VALIDATION
            if (state.template?.id) {
                const profile = ONBOARDING_PROFILES[state.template.id];
                if (profile?.requireSteps) {
                    for (const step of profile.requireSteps) {
                        if (step === "finance" && !state.finance?.bankName) {
                            return NextResponse.json({
                                error: `Missing required step: ${step}`,
                                code: "MISSING_REQUIRED_STEP",
                            }, { status: 422 });
                        }
                        if (step === "logistics" && !state.logistics?.deliveryMode) {
                            return NextResponse.json({
                                error: `Missing required step: ${step}`,
                                code: "MISSING_REQUIRED_STEP",
                            }, { status: 422 });
                        }
                        // ENHANCED VALIDATION: Strengthen KYC check
                        if (step === "kyc") {
                            const isRegistered = state.business?.businessRegistrationType === "registered";
                            const hasNin = !!state.identity?.nin;
                            const hasCac = !!state.identity?.cacNumber;
                            const kycVerified = state.kycStatus === "verified";
                            const kycPending = state.kycStatus === "pending";
                            const kycOk = isRegistered
                                ? kycVerified && hasNin && hasCac
                                : (kycVerified || kycPending) && hasNin;
                            if (!kycOk) {
                                return NextResponse.json({
                                    error: "KYC verification required. Please complete identity verification.",
                                    code: "KYC_NOT_VERIFIED",
                                    step: "kyc"
                                }, { status: 422 });
                            }
                        }
                    }
                }
            }
            // CRITICAL: Validate Industry Selection
            if (!state.industrySlug) {
                return NextResponse.json({ error: "Missing industry selection.", code: "MISSING_INDUSTRY", step: "industry" }, { status: 422 });
            }
            // CRITICAL: Validate Business Basics
            if (!state.business?.name || !state.business?.storeName || !state.business?.slug) {
                return NextResponse.json({ error: "Missing business details.", code: "MISSING_BUSINESS", step: "business" }, { status: 422 });
            }
            if (state.business.businessRegistrationType === "registered" && !state.business.cacNumber) {
                return NextResponse.json({ error: "Missing CAC Number for registered business.", code: "MISSING_CAC", step: "business" }, { status: 422 });
            }
            // CRITICAL: Validate Visuals (Logo)
            if (!state.branding?.logoUrl) {
                return NextResponse.json({ error: "Store logo is required.", code: "MISSING_LOGO", step: "visuals" }, { status: 422 });
            }
            // CRITICAL: Validate Finance
            if (!state.finance?.bankName || !state.finance?.accountNumber || !state.finance?.bvn) {
                return NextResponse.json({ error: "Missing finance details (Bank/BVN).", code: "MISSING_FINANCE", step: "finance" }, { status: 422 });
            }
            // CRITICAL: Verify payout name matches identity (simple first-token match)
            if (state.identity?.fullName &&
                state.finance?.accountName &&
                !accountNameMatchesIdentity(state.finance.accountName, state.identity.fullName)) {
                return NextResponse.json({
                    error: "Payout account name does not match identity. Please confirm bank details.",
                    code: "ACCOUNT_NAME_MISMATCH",
                    step: "finance",
                }, { status: 422 });
            }
            // CRITICAL: Validate Logistics (if strictly tracking types)
            // state.logistics.deliveryMode is required by type but let's check it
            if (!state.logistics?.deliveryMode) {
                return NextResponse.json({ error: "Missing logistics preference.", code: "MISSING_LOGISTICS", step: "logistics" }, { status: 422 });
            }
            // ENHANCED VALIDATION: Check minimum product count
            const productCount = await prisma.product.count({
                where: { storeId: sessionUser.storeId }
            });
            if (productCount === 0) {
                return NextResponse.json({
                    error: "At least one product is required before publishing your store.",
                    code: "NO_PRODUCTS",
                    step: "inventory",
                    action: "add_product"
                }, { status: 422 });
            }
            // Sync data to core tables
            await syncOnboardingData(sessionUser.storeId, state);
            // REFERRAL TRACKING
            if (state.referralCode) {
                try {
                    const { ReferralService } = await import("@/services/referral.service");
                    const refResult = await ReferralService.trackReferral(sessionUser.storeId, state.referralCode);
                    if (!refResult.success) {
                        console.warn("Referral tracking failed:", refResult.error);
                        // We don't block completion if referral tracking fails
                    }
                }
                catch (e) {
                    console.error("Referral tracking service error:", e);
                }
            }
        }
        // Mark onboarding as complete in a transaction
        await prisma.$transaction([
            // Update onboarding status
            prisma.merchantOnboarding.update({
                where: { storeId: sessionUser.storeId },
                data: {
                    status: "COMPLETE",
                    completedSteps: {
                        push: "completion",
                    },
                    completedAt: new Date(),
                },
            }),
            // Update store
            prisma.store.update({
                where: { id: sessionUser.storeId },
                data: {
                    onboardingCompleted: true,
                    onboardingLastStep: "complete",
                    onboardingStatus: "COMPLETE",
                    onboardingUpdatedAt: new Date(),
                },
            }),
        ]);
        return NextResponse.json({
            message: "Onboarding completed successfully",
            redirectUrl: "/admin/dashboard?welcome=true",
        });
    }
    catch (error) {
        console.error("Complete onboarding error:", error);
        return NextResponse.json({ error: "Failed to complete onboarding" }, { status: 500 });
    }
}
function normalizeName(name) {
    if (!name)
        return "";
    return name.replace(/[^a-zA-Z\s]/g, "").toLowerCase().trim();
}
function accountNameMatchesIdentity(accountName, fullName) {
    const acc = normalizeName(accountName);
    const tokens = normalizeName(fullName)
        .split(" ")
        .filter((t) => t.length >= 3);
    if (tokens.length === 0)
        return false;
    return tokens.every((t) => acc.includes(t));
}
