import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit-enhanced";
import { sanitizeFormData } from "@/lib/input-sanitization";
// GET /api/merchant/onboarding/state - Retrieve onboarding state
export async function GET(request: Request) {
    try {
        // Get authenticated user from session
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }
        // Get onboarding state from database
        const onboarding = await prisma.merchantOnboarding.findUnique({
            where: { storeId: sessionUser.storeId },
        });
        // Get store for onboarding metadata
        const store = await prisma.store.findUnique({
            where: { id: sessionUser.storeId },
        });
        if (!onboarding || !store) {
            // Return default state if not found
            return NextResponse.json({
                onboardingStatus: "IN_PROGRESS",
                currentStep: "welcome",
                completedSteps: [],
                data: {
                    business: {
                        name: store?.name || "",
                        email: sessionUser.email,
                    },
                    user: {
                        firstName: sessionUser.firstName,
                        lastName: sessionUser.lastName,
                    },
                },
            });
        }
        // Return onboarding state
        return NextResponse.json({
            onboardingStatus: onboarding.status,
            currentStep: onboarding.currentStepKey,
            completedSteps: onboarding.completedSteps || [],
            data: onboarding.data || {},
        });
    }
    catch (error: any) {
        console.error("Get onboarding state error:", error);
        return NextResponse.json({ error: "Failed to retrieve onboarding state" }, { status: 500 });
    }
}
// Valid step sequence - Order matters!
const ONBOARDING_STEPS = [
    "welcome",
    "identity",
    "business",
    "url",
    "branding",
    "finance",
    "review"
];

// POST /api/merchant/onboarding/state - Save onboarding progress
export async function POST(request: Request) {
    try {
        // Apply rate limiting
        const rateLimitResult = await applyRateLimit(request, "onboarding-update", RATE_LIMITS.ONBOARDING_UPDATE);
        if (!rateLimitResult.allowed) {
            return rateLimitResult.response;
        }

        // Get authenticated user from session
        const sessionUser = await getSessionUser();
        if (!sessionUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await request.json();
        const { currentStep, data, completedSteps } = body;

        // Fetch existing state
        const existingState = await prisma.merchantOnboarding.findUnique({
            where: { storeId: sessionUser.storeId },
        });

        // Validation 1: Ensure step is valid
        if (currentStep && !ONBOARDING_STEPS.includes(currentStep)) {
            return NextResponse.json({ error: "Invalid step" }, { status: 400 });
        }

        // Validation 2: Ensure sequential progress (no skipping)
        // Users can go back (previous index) or stay on current, or go to next (current + 1)
        // But they cannot jump 2 steps ahead.
        // If no existing state, they must start at 'welcome' or 'identity' (if guided).
        // Let's rely on completedSteps for validation if available, or index logic.

        const currentStepIndex = currentStep ? ONBOARDING_STEPS.indexOf(currentStep) : -1;
        const previousStepKey = existingState?.currentStepKey || "welcome";
        const previousStepIndex = ONBOARDING_STEPS.indexOf(previousStepKey);

        // Allow: 
        // 1. Updating current step (re-save) -> index == prevIndex
        // 2. Moving to next immediate step -> index == prevIndex + 1
        // 3. Moving back -> index < prevIndex
        // Block: 
        // 4. Jumping ahead -> index > prevIndex + 1

        // Exception: If we have 'completedSteps' in DB, allow jumping to any completed step + 1?
        // For simplicity and security, strict next-step logic is best for the "currentStep" pointer.
        // However, the UI might send "completedSteps" array updates. 
        // If the user tries to claim they completed "review" when they are on "welcome", block it.

        if (currentStep && existingState) {
            if (currentStepIndex > previousStepIndex + 1) {
                // Check if the target step was already completed previously (users jumping around via UI nav)
                const isTargetAlreadyCompleted = existingState.completedSteps.includes(currentStep);
                // Also check if all intermediate steps are completed
                const intermediateSteps = ONBOARDING_STEPS.slice(previousStepIndex + 1, currentStepIndex);
                const allIntermediatesDone = intermediateSteps.every(s => existingState.completedSteps.includes(s));

                if (!isTargetAlreadyCompleted && !allIntermediatesDone) {
                    return NextResponse.json({
                        error: "Cannot skip steps. Complete previous steps first.",
                        requiredStep: ONBOARDING_STEPS[previousStepIndex + 1]
                    }, { status: 400 });
                }
            }
        }

        // Sanitize input data
        const sanitizedData = data ? sanitizeFormData(data) : undefined;

        // Update onboarding state
        const onboarding = await prisma.merchantOnboarding.upsert({
            where: { storeId: sessionUser.storeId },
            update: {
                currentStepKey: currentStep || undefined,
                data: sanitizedData || undefined,
                completedSteps: completedSteps || undefined,
                updatedAt: new Date(),
            },
            create: {
                storeId: sessionUser.storeId,
                status: "IN_PROGRESS",
                currentStepKey: currentStep || "welcome",
                data: sanitizedData || {},
                completedSteps: completedSteps || [],
            },
        });

        // Also update store's onboarding metadata
        if (currentStep) {
            await prisma.store.update({
                where: { id: sessionUser.storeId },
                data: {
                    onboardingLastStep: currentStep,
                    onboardingUpdatedAt: new Date()
                },
            });
        }

        return NextResponse.json({
            success: true,
            onboardingStatus: onboarding.status,
            currentStep: onboarding.currentStepKey,
        });
    }
    catch (error: any) {
        console.error("Save onboarding state error:", error);
        return NextResponse.json({ error: "Failed to save onboarding state" }, { status: 500 });
    }
}
