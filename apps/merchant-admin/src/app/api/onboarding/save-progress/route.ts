import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/security/encryption";

// POST /api/onboarding/save-progress
export async function POST(request: NextRequest) {
    try {
        const sessionUser = await getSessionUser();

        if (!sessionUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await request.json();
        const { currentStep, data, completedSteps } = body;

        // Extract specific fields for columns if present in data
        // data is the OnboardingState object from frontend
        const industryCategory = data?.intent?.segment;
        const industrySlug = data?.industrySlug || industryCategory;
        const isGuided = data?.setupPath === "guided"; // 'guided' | 'blank'
        const hasDelivery = data?.intent?.hasDelivery;

        // Scrub sensitive PII from stored JSON
        const scrubbedData = data ? JSON.parse(JSON.stringify(data)) : undefined;
        if (scrubbedData?.identity) {
            delete scrubbedData.identity.nin;
            delete scrubbedData.identity.bvn;
            delete scrubbedData.identity.cacNumber;
        }
        if (scrubbedData?.kyc) {
            delete scrubbedData.kyc.nin;
            delete scrubbedData.kyc.bvn;
            delete scrubbedData.kyc.cacNumber;
        }

        // Prepare upsert data
        const updateData: any = {
            currentStepKey: currentStep || undefined,
            data: scrubbedData || undefined,
            completedSteps: completedSteps || undefined,
            updatedAt: new Date(),
        };

        if (data?.setupPath) {
            updateData.setupPath = data.setupPath;
        }
        if (typeof hasDelivery !== 'undefined') {
            updateData.hasDelivery = hasDelivery;
        }

        const createData: any = {
            storeId: sessionUser.storeId,
            status: "IN_PROGRESS",
            currentStepKey: currentStep || "welcome",
            data: scrubbedData || {},
            completedSteps: completedSteps || [],
            setupPath: data?.setupPath || "guided",
            hasDelivery: hasDelivery ?? true,
        };

        // 1. Upsert MerchantOnboarding
        const onboarding = await prisma.merchantOnboarding.upsert({
            where: { storeId: sessionUser.storeId },
            update: updateData,
            create: createData,
        });

        // 2. Update Store level fields (Resume Step, Category)
        const storeUpdateData: any = {};
        if (currentStep) {
            storeUpdateData.onboardingLastStep = currentStep;
        }
        if (industryCategory) {
            storeUpdateData.category = industryCategory;
        }
        if (industrySlug) {
            storeUpdateData.industrySlug = industrySlug;
        }

        if (Object.keys(storeUpdateData).length > 0) {
            await prisma.store.update({
                where: { id: sessionUser.storeId },
                data: storeUpdateData,
            });
        }

        // 3. Handle KYC Data (identity/kyc) with simple encryption mocks
        const kycData = data?.kyc || data?.identity;
        if (kycData) {
            const kycUpdate: any = {};

            if (kycData.nin) {
                kycUpdate.ninLast4 = kycData.nin.slice(-4);
                kycUpdate.fullNinEncrypted = encrypt(kycData.nin);
            }
            if (kycData.bvn) {
                kycUpdate.bvnLast4 = kycData.bvn.slice(-4);
                kycUpdate.fullBvnEncrypted = encrypt(kycData.bvn);
            }
            if (kycData.cacNumber) {
                kycUpdate.cacNumberEncrypted = encrypt(kycData.cacNumber);
            }
            kycUpdate.status = "PENDING";

            if (Object.keys(kycUpdate).length > 0) {
                await prisma.kycRecord.upsert({
                    where: { storeId: sessionUser.storeId },
                    update: kycUpdate,
                    create: {
                        storeId: sessionUser.storeId,
                        ninLast4: kycUpdate.ninLast4 || "",
                        bvnLast4: kycUpdate.bvnLast4 || "0000",
                        ...kycUpdate
                    }
                });
            }
        }

        // 4. Handle Financial Data Persistence (Audit Fix: Sector 1)
        // If we are on the finance step or data.finance is updated, sync to BankBeneficiary
        if (data?.finance) {
            const finance = data.finance;
            if (finance.accountNumber && finance.bankName) {
                // Use provided bankCode or default to generic code
                const bankCode = finance.bankCode || "000";

                const existingBeneficiary = await prisma.bankBeneficiary.findFirst({
                    where: { storeId: sessionUser.storeId, isDefault: true }
                });

                await prisma.bankBeneficiary.upsert({
                    where: {
                        id: existingBeneficiary?.id || "new-record"
                    },
                    update: {
                        bankName: finance.bankName,
                        accountNumber: finance.accountNumber,
                        accountName: finance.accountName || "",
                        bankCode: bankCode,
                        isDefault: true
                    },
                    create: {
                        storeId: sessionUser.storeId,
                        bankName: finance.bankName,
                        accountNumber: finance.accountNumber,
                        accountName: finance.accountName || "",
                        bankCode: bankCode,
                        isDefault: true
                    }
                });
            }
        }

        return NextResponse.json({
            message: "Progress saved",
            step: onboarding.currentStepKey
        });

    } catch (error) {
        console.error("Save progress error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
