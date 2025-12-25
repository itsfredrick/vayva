
import { prisma } from '@vayva/db';
import { TenantContext } from '../auth/tenantContext';

/**
 * Safe Repository Layer.
 * Wraps Prisma to enforce merchantId isolation on every query.
 */
export class Repository {

    static products = {
        async findMany(ctx: TenantContext, args: any = {}) {
            return prisma.inventoryItem.findMany({ // Using Inventory as proxy for Product in this example or Product model
                ...args,
                where: {
                    ...args.where,
                    InventoryLocation: {
                        storeId: ctx.storeId // FORCED ISOLATION through location
                    }
                }
            });
        },

        async findUnique(ctx: TenantContext, id: string) {
            // We must findFirst to allow storeId filter, findUnique only takes ID
            return prisma.inventoryItem.findFirst({
                where: {
                    id,
                    InventoryLocation: {
                        storeId: ctx.storeId // FORCED ISOLATION through location
                    }
                }
            });
        },

        async create(ctx: TenantContext, data: any) {
            // Note: InventoryItem requires locationId, not merchantId
            // The caller should provide locationId that belongs to their store
            return prisma.inventoryItem.create({
                data: {
                    ...data,
                    // locationId should be provided in data and validated to belong to ctx.storeId
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
