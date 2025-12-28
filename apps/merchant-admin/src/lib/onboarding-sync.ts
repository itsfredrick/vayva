
import { prisma } from '@vayva/db';
import { OnboardingState } from '@/types/onboarding';

export async function syncOnboardingData(storeId: string, state: OnboardingState) {
    if (!storeId || !state) return;

    // Schema Version Guardrail
    const EXPECTED_SCHEMA_VERSION = 1;
    if (state.schemaVersion && state.schemaVersion !== EXPECTED_SCHEMA_VERSION) {
        console.warn(`[Sync][Drift Alarm] Schema version mismatch! Expected ${EXPECTED_SCHEMA_VERSION}, got ${state.schemaVersion}. Sync logic may be outdated.`);
    }

    console.log(`[Sync] Starting onboarding sync for store ${storeId}`);

    try {
        await prisma.$transaction(async (tx) => {
            // 1. Update Core Store Details
            await tx.store.update({
                where: { id: storeId },
                data: {
                    name: state.business?.name || undefined,
                    slug: state.storeDetails?.slug || undefined,
                    category: state.business?.category || undefined,
                    // Store settings for domain preference and currency
                    settings: {
                        domainPreference: state.storeDetails?.domainPreference || 'subdomain',
                        currency: state.payments?.currency || 'NGN',
                        payoutScheduleAcknowledged: state.payments?.payoutScheduleAcknowledged,
                    },
                    isLive: state.storeDetails?.publishStatus === 'published',
                }
            });

            // 2. Sync Store Profile (Location & Contact)
            // Check if profile exists
            const existingProfile = await tx.storeProfile.findUnique({ where: { storeId } });
            const profileData = {
                state: state.business?.location?.state,
                city: state.business?.location?.city,
                displayName: state.storeDetails?.storeName || state.business?.name,
                whatsappNumberE164: state.identity?.phone, // Assuming owner phone is contact
            };

            if (existingProfile) {
                await tx.storeProfile.update({
                    where: { storeId },
                    data: profileData
                });
            } else {
                await tx.storeProfile.create({
                    data: {
                        storeId,
                        slug: state.storeDetails?.slug || `store-${storeId.substring(0, 8)}`,
                        displayName: profileData.displayName || 'My Store',
                        state: profileData.state,
                        city: profileData.city,
                        whatsappNumberE164: profileData.whatsappNumberE164
                    }
                });
            }

            // [NEW] 2.1 Sync WhatsApp Channel
            if (profileData.whatsappNumberE164) {
                await tx.whatsappChannel.upsert({
                    where: { storeId },
                    create: {
                        storeId,
                        displayPhoneNumber: profileData.whatsappNumberE164,
                        status: 'CONNECTED',
                    },
                    update: {
                        displayPhoneNumber: profileData.whatsappNumberE164,
                        status: 'CONNECTED',
                    }
                });
            }

            // 3. Sync Billing Profile (Legal Name)
            if (state.business?.legalName) {
                await tx.billingProfile.upsert({
                    where: { storeId },
                    create: {
                        storeId,
                        legalName: state.business.legalName,
                        billingEmail: state.business.email,
                    },
                    update: {
                        legalName: state.business.legalName,
                        billingEmail: state.business.email,
                    }
                });
            }

            // 4. Sync Bank Account
            if (state.payments?.settlementBank) {
                // Deactivate old default
                await tx.bankBeneficiary.updateMany({
                    where: { storeId, isDefault: true },
                    data: { isDefault: false }
                });

                await tx.bankBeneficiary.create({
                    data: {
                        storeId,
                        bankName: state.payments.settlementBank.bankName,
                        accountNumber: state.payments.settlementBank.accountNumber,
                        accountName: state.payments.settlementBank.accountName,
                        bankCode: '000', // Placeholder or needs lookup
                        isDefault: true
                    }
                });
            }

            // 5. Sync Delivery Settings
            const deliveryMethods: string[] = [];
            if (state.delivery?.policy !== 'pickup_only') {
                deliveryMethods.push(state.delivery?.defaultProvider || 'manual');
            }

            // TODO: [Hardening] Pickup Address is currently referenced from the JSON blob.
            // When InventoryLocation schema supports specific address fields, migrate this data there.
            if (state.delivery?.pickupAddress) {
                console.warn('[Sync] Pickup address persists in blob only. Future migration required for table normalization.');
            }

            await tx.storeProfile.update({
                where: { storeId },
                data: {
                    pickupAvailable: state.delivery?.policy !== 'required',
                    deliveryMethods: deliveryMethods.length > 0 ? deliveryMethods : undefined
                }
            });

            // [NEW] 5.1 Sync Delivery Policy as Merchant Policy
            if (state.delivery?.policy) {
                const policyContent = state.delivery.policy === 'pickup_only'
                    ? 'Orders are only available for pickup at our physical location.'
                    : state.delivery.policy; // e.g. "Shipped within 24 hours"

                // We use upsert for the policy
                const store = await tx.store.findUnique({ where: { id: storeId }, select: { slug: true } });
                await tx.merchantPolicy.upsert({
                    where: { storeId_type: { storeId, type: 'SHIPPING_DELIVERY' } },
                    create: {
                        storeId,
                        merchantId: storeId, // Using storeId as merchantId for simple tenant mapping
                        storeSlug: store?.slug || 'unknown',
                        type: 'SHIPPING_DELIVERY',
                        title: 'Delivery Policy',
                        contentMd: policyContent,
                        contentHtml: `<p>${policyContent}</p>`,
                        status: 'PUBLISHED'
                    },
                    update: {
                        contentMd: policyContent,
                        contentHtml: `<p>${policyContent}</p>`,
                        status: 'PUBLISHED'
                    }
                });
            }

            // 6. Sync KYC Status
            if (state.kycStatus === 'verified' || state.kycStatus === 'pending') {
                await tx.kycRecord.upsert({
                    where: { storeId },
                    create: {
                        storeId,
                        status: state.kycStatus === 'verified' ? 'VERIFIED' : 'PENDING',
                        ninLast4: '0000',
                        bvnLast4: '0000'
                    },
                    update: {
                        status: state.kycStatus === 'verified' ? 'VERIFIED' : 'PENDING'
                    }
                });
            }
        });
        console.log(`[Sync] Onboarding sync completed for ${storeId}`);
    } catch (error) {
        console.error('[Sync] Failed to sync onboarding data:', error);
        // We log but maybe allow completion logic to proceed or fail?
        // Throwing allows caller to handle it.
        throw error;
    }
}
