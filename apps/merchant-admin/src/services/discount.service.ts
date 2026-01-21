
import { prisma } from "@/lib/prisma";
import { DiscountType, DiscountAppliesTo, CouponStatus } from "@vayva/db";

export class DiscountService {
    /**
     * Create a Discount Rule and optionally a Coupon.
     */
    static async createDiscount(storeId: string, data: {
        name: string;
        type: DiscountType;
        valueAmount?: number;
        valuePercent?: number;
        appliesTo?: DiscountAppliesTo;
        productIds?: string[];
        collectionIds?: string[];
        minOrderAmount?: number;
        startsAt: Date;
        endsAt?: Date;
        usageLimitTotal?: number;
        usageLimitPerCustomer?: number;
        code?: string; // If provided, creates a coupon linked to this rule
    }) {
        return await prisma.$transaction(async (tx) => {
            // 1. Create Rule
            const rule = await tx.discountRule.create({
                data: {
                    storeId,
                    name: data.name,
                    type: data.type,
                    valueAmount: data.valueAmount,
                    valuePercent: data.valuePercent,
                    appliesTo: data.appliesTo || "ALL",
                    productIds: data.productIds || [],
                    collectionIds: data.collectionIds || [],
                    minOrderAmount: data.minOrderAmount,
                    startsAt: data.startsAt,
                    endsAt: data.endsAt,
                    usageLimitTotal: data.usageLimitTotal,
                    usageLimitPerCustomer: data.usageLimitPerCustomer,
                    requiresCoupon: !!data.code
                }
            });

            // 2. Create Coupon if code provided
            let coupon = null;
            if (data.code) {
                // Check uniqueness
                const existing = await tx.coupon.findUnique({
                    where: {
                        storeId_code: {
                            storeId,
                            code: data.code
                        }
                    }
                });

                if (existing) {
                    throw new Error(`Coupon code ${data.code} already exists`);
                }

                coupon = await tx.coupon.create({
                    data: {
                        storeId,
                        ruleId: rule.id,
                        code: data.code,
                        status: "ACTIVE"
                    }
                });
            }

            return { rule, coupon };
        });
    }

    static async getDiscount(storeId: string, ruleId: string) {
        const rule = await prisma.discountRule.findUnique({
            where: { id: ruleId, storeId }
        });

        if (!rule) return null;

        const coupon = await prisma.coupon.findFirst({
            where: { storeId, ruleId }
        });

        return {
            ...rule,
            code: coupon?.code || null,
            couponId: coupon?.id || null
        };
    }

    static async updateDiscount(storeId: string, ruleId: string, data: {
        name?: string;
        type?: DiscountType;
        valueAmount?: number;
        valuePercent?: number;
        appliesTo?: DiscountAppliesTo;
        productIds?: string[];
        collectionIds?: string[];
        minOrderAmount?: number;
        startsAt?: Date;
        endsAt?: Date;
        usageLimitTotal?: number;
        usageLimitPerCustomer?: number;
        code?: string;
    }) {
        return await prisma.$transaction(async (tx) => {
            // 1. Update Rule
            const rule = await tx.discountRule.update({
                where: { id: ruleId, storeId },
                data: {
                    name: data.name,
                    type: data.type,
                    valueAmount: data.valueAmount,
                    valuePercent: data.valuePercent,
                    appliesTo: data.appliesTo,
                    productIds: data.productIds,
                    collectionIds: data.collectionIds,
                    minOrderAmount: data.minOrderAmount,
                    startsAt: data.startsAt,
                    endsAt: data.endsAt,
                    usageLimitTotal: data.usageLimitTotal,
                    usageLimitPerCustomer: data.usageLimitPerCustomer,
                    requiresCoupon: data.code !== undefined ? !!data.code : undefined
                }
            });

            // 2. Sync Coupon if code provided (create/update/delete)
            if (data.code !== undefined) {
                if (data.code === "") {
                    // Remove coupon
                    await tx.coupon.deleteMany({ where: { storeId, ruleId } });
                } else {
                    const existing = await tx.coupon.findFirst({ where: { storeId, ruleId } });
                    if (existing) {
                        await tx.coupon.update({
                            where: { id: existing.id },
                            data: { code: data.code }
                        });
                    } else {
                        await tx.coupon.create({
                            data: {
                                storeId,
                                ruleId,
                                code: data.code,
                                status: "ACTIVE"
                            }
                        });
                    }
                }
            }

            return rule;
        });
    }

    static async listDiscounts(storeId: string) {
        // Fetch rules
        const rules = await prisma.discountRule.findMany({
            where: { storeId },
            orderBy: { createdAt: "desc" }
        });

        // Fetch coupons for these rules (manual join since no relation)
        const ruleIds = rules.filter(r => r.requiresCoupon).map(r => r.id);
        const coupons = await prisma.coupon.findMany({
            where: {
                storeId,
                ruleId: { in: ruleIds }
            }
        });

        const couponMap = new Map(coupons.map(c => [c.ruleId, c]));

        return rules.map(rule => ({
            ...rule,
            code: couponMap.get(rule.id)?.code || null,
            couponId: couponMap.get(rule.id)?.id || null
        }));
    }

    static async deleteDiscount(storeId: string, ruleId: string) {
        return await prisma.$transaction(async (tx) => {
            // Delete associated coupons first
            await tx.coupon.deleteMany({
                where: { storeId, ruleId }
            });

            // Delete rule
            await tx.discountRule.delete({
                where: { id: ruleId, storeId }
            });
        });
    }
}
