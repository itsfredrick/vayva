
import { prisma } from '@vayva/db';
import { TenantContext } from '../auth/tenantContext';

/**
 * Safe Repository Layer.
 * Wraps Prisma to enforce merchantId isolation on every query.
 */
export class Repository {

    static products = {
        async findMany(ctx: TenantContext, args: any = {}) {
            return prisma.inventoryItemV2.findMany({ // Using Inventory as proxy for Product in this example or Product model
                ...args,
                where: {
                    ...args.where,
                    merchantId: ctx.merchantId, // FORCED ISOLATION
                    // If store specific: storeId: ctx.storeId 
                }
            });
        },

        async findUnique(ctx: TenantContext, id: string) {
            // We must findFirst to allow merchantId filter, findUnique only takes ID
            return prisma.inventoryItemV2.findFirst({
                where: {
                    id,
                    merchantId: ctx.merchantId // FORCED ISOLATION
                }
            });
        },

        async create(ctx: TenantContext, data: any) {
            return prisma.inventoryItemV2.create({
                data: {
                    ...data,
                    merchantId: ctx.merchantId // FORCED OWNERSHIP
                }
            });
        }
    };

    static orders = {
        async list(ctx: TenantContext) {
            // return prisma.order.findMany... 
            // Mocking return for compilation if Order model not strictly defined in this snippet
            return [];
        }
    };

    // Add other domains...
}
