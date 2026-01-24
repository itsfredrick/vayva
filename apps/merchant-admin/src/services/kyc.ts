import { prisma } from "@vayva/db";
import { NotificationManager } from "@vayva/shared/server";
import { assertFeatureEnabled } from "@/lib/env-validation";
import { YouverifyService } from "@/lib/kyc/youverify";
// Name matching logic
export function calculateNameMatch(provided: any, verified: any) {
    const normalize = (s: any) => s
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, "");
    const pFirst = normalize(provided.first);
    const pLast = normalize(provided.last);
    const vFirst = normalize(verified.first);
    const vLast = normalize(verified.last);
    if (pFirst === vFirst && pLast === vLast)
        return 100;
    // Simple heuristic for fuzzy matching (swapped names, etc)
    if (pFirst === vLast && pLast === vFirst)
        return 90;
    // Partial matches or containment
    if (vFirst.includes(pFirst) && vLast.includes(pLast))
        return 80;
    return 0;
}
// Youverify Adapter (Real Implementation)
class YouverifyProvider {
    async verify(request: any) {
        try {
            const validationData = {
                firstName: request.firstName,
                lastName: request.lastName,
                dateOfBirth: request.dob,
            };
            let response;
            if (request.method === "BVN") {
                response = await YouverifyService.verifyBVN(request.idNumber, validationData, request.selfie);
            }
            else {
                // NIN is mapped to vNIN for Youverify
                response = await YouverifyService.verifyVNIN(request.idNumber, validationData, request.selfie);
            }
            const selfieMatch = response.data.validations?.selfie?.selfieVerification;
            return {
                success: response.success && response.data.status === "found",
                providerReference: response.data.id,
                matchScore: response.data.allValidationPassed
                    ? 100
                    : selfieMatch?.confidenceLevel || 0,
                status: response.success && response.data.status === "found"
                    ? "VERIFIED"
                    : "REJECTED",
                rawResponse: response.data,
                error: response.data.validations?.validationMessages ||
                    (response.data.status === "not_found"
                        ? "Identity not found"
                        : undefined),
            };
        }
        catch (error: any) {
            return {
                success: false,
                matchScore: 0,
                status: "FAILED",
                error: error.message,
            };
        }
    }
}
export class KycService {
    provider: any;

    constructor() {
        // Only real provider allowed - no tests
        this.provider = new YouverifyProvider();
    }
    async verifyIdentity(storeId: any, request: any) {
        // Enforce feature flag at runtime call, not build time
        assertFeatureEnabled("KYC_ENABLED");
        if (!request.consent) {
            throw new Error("User consent is required for verification");
        }
        // Rate limiting would go here (Check recent attempts in DB)
        const result = await this.provider.verify(request);
        // Save record to database
        await prisma.kycRecord.upsert({
            where: { storeId },
            create: {
                storeId,
                ninLast4: request.method === "NIN" ? request.idNumber.slice(-4) : "",
                bvnLast4: request.method === "BVN" ? request.idNumber.slice(-4) : "",
                status: result.status,
                audit: [
                    {
                        timestamp: new Date().toISOString(),
                        action: "VERIFICATION_ATTEMPT",
                        method: request.method,
                        result: result.status,
                        score: result.matchScore,
                        firstName: request.firstName,
                        lastName: request.lastName,
                        idNumber: request.idNumber,
                        ipAddress: request.ipAddress,
                    },
                ],
            },
            update: {
                status: result.status,
                ninLast4: request.method === "NIN" ? request.idNumber.slice(-4) : undefined,
                bvnLast4: request.method === "BVN" ? request.idNumber.slice(-4) : undefined,
                audit: {
                    push: {
                        timestamp: new Date().toISOString(),
                        action: "VERIFICATION_ATTEMPT",
                        method: request.method,
                        result: result.status,
                        score: result.matchScore,
                        firstName: request.firstName,
                        lastName: request.lastName,
                        idNumber: request.idNumber,
                        ipAddress: request.ipAddress,
                    },
                },
            },
        });
        // Update cache fields for quick access and Ops visibility
        await Promise.all([
            prisma.store.update({
                where: { id: storeId },
                data: { kycStatus: result.status as any }
            }),
            prisma.wallet.upsert({
                where: { storeId },
                create: { storeId, kycStatus: result.status as any },
                update: { kycStatus: result.status as any }
            })
        ]);

        // Trigger Automated Notifications
        try {
            if (result.status === "VERIFIED") {
                await NotificationManager.trigger(storeId, "KYC_VERIFIED");
            }
            else if (result.status === "REJECTED") {
                await NotificationManager.trigger(storeId, "KYC_FAILED", {
                    reason: result.error || "Identity mismatch",
                });
            }
        }
        catch (notifierErr: any) {
            console.error("[KycService] Failed to trigger notification:", notifierErr);
        }
        // Log audit event
        await prisma.auditLog.create({
            data: {
                storeId,
                actorType: "SYSTEM",
                actorLabel: "KYC_SERVICE",
                action: result.status === "VERIFIED" ? "KYC_VERIFIED" : "KYC_FAILED",
                entityType: "KycRecord",
                ipAddress: request.ipAddress,
                correlationId: `kyc-${Date.now()}`,
            },
        });
        return result;
    }
}
export const kycService = new KycService();
