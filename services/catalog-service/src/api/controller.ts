
import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@vayva/db';
import { Prisma } from '@prisma/client';

interface CreateProductBody {
    storeId: string;
    title: string;
    price: number;
    description: string;
    status: string;
    trackInventory: boolean;
    variants: any[];
}

interface GenerateVariantsBody {
    options: Record<string, string[]>;
}

interface CreateVariantBody {
    title: string;
    options: Record<string, string>;
    price: number | null;
    sku?: string;
    inventory?: number; // Initial stock
}

interface UpdateVariantBody {
    title?: string;
    price?: number;
    sku?: string;
    options?: Record<string, string>;
}

interface AdjustInventoryBody {
    storeId: string;
    variantId: string;
    quantity: number;
    reason?: string;
    locationId?: string;
}

export const CatalogController = {
    // --- Products ---

    createProduct: async (req: FastifyRequest<{ Body: CreateProductBody }>, reply: FastifyReply) => {
        const { storeId, title, price, description, status, trackInventory, variants } = req.body as any;

        // Transaction to create product + variants + initial inventory
        const result = await prisma.$transaction(async (tx: any) => { // Explicit any for now if tx type inference fails
            const product = await tx.product.create({
                data: {
                    storeId,
                    title,
                    description,
                    price: price || 0,
                    status: status || 'DRAFT',
                    handle: title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000),
                    trackInventory: trackInventory ?? true,
                }
            });

            // If variants provided inline
            if (variants && Array.isArray(variants)) {
                for (const v of variants) {
                    await tx.productVariant.create({
                        data: {
                            productId: product.id,
                            title: v.title,
                            options: v.options,
                            price: v.price,
                            sku: v.sku,
                            inventoryItems: {
                                create: {
                                    // Default location for V1
                                    location: {
                                        connectOrCreate: {
                                            where: { id: "DEFAULT" }, // Needs robust logic, using placeholders or finding default
                                            create: { storeId, name: "Default Location", isDefault: true }
                                        }
                                    },
                                    onHand: v.initialStock || 0,
                                    available: v.initialStock || 0
                                }
                            }
                        }
                    });
                }
            } else {
                // Create a "Default" variant for simple products
                await tx.productVariant.create({
                    data: {
                        productId: product.id,
                        title: 'Default',
                        options: {},
                        price: price,
                        inventoryItems: {
                            create: {
                                location: {
                                    create: { storeId, name: "Default Location", isDefault: true }
                                }
                            }
                        }
                    }
                });
            }

            return product;
        });

        return reply.status(201).send(result);
    },

    getProducts: async (req: FastifyRequest<{ Querystring: { storeId: string, status?: string } }>, reply: FastifyReply) => {
        const { storeId, status } = req.query as any;
        if (!storeId) return reply.status(400).send({ error: "storeId required" });

        const products = await prisma.product.findMany({
            where: {
                storeId,
                status: status || undefined,
            },
            include: {
                variants: true,
                images: true
            },
            orderBy: { updatedAt: 'desc' }
        });
        return products;
    },

    getProduct: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                variants: {
                    include: {
                        inventoryItems: true
                    }
                },
                images: true
            }
        });
        if (!product) return reply.status(404).send({ error: "Product not found" });
        return product;
    },

    updateProduct: async (req: FastifyRequest<{ Params: { id: string }, Body: any }>, reply: FastifyReply) => {
        const { id } = req.params;
        const data = req.body;

        const product = await prisma.product.update({
            where: { id },
            data: data as any
        });
        return product;
    },

    archiveProduct: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const product = await prisma.product.update({
            where: { id },
            data: { status: 'ARCHIVED' }
        });
        return product;
    },

    publishProduct: async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
        const { id } = req.params;
        const product = await prisma.product.update({
            where: { id },
            data: { status: 'ACTIVE' }
        });
        return product;
    },

    // --- Variants ---

    generateVariants: async (req: FastifyRequest<{ Params: { id: string }, Body: GenerateVariantsBody }>, reply: FastifyReply) => {
        const { id } = req.params;
        const { options } = req.body as any;

        const keys = Object.keys(options);
        const cartesian = (...a: any[]) => a.reduce((a, b) => a.flatMap((d: any) => b.map((e: any) => [d, e].flat())));

        const valueArrays = keys.map(k => options[k]);
        const combinations = valueArrays.length > 0 ? (valueArrays.length === 1 ? valueArrays[0].map((v: any) => [v]) : cartesian(...valueArrays)) : [];

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) return reply.status(404).send({ error: "Product not found" });

        const variantsToCreate = combinations.map((combo: any[]) => {
            const variantOptions: Record<string, string> = {};
            keys.forEach((key, idx) => {
                variantOptions[key] = combo[idx];
            });
            const title = combo.join(' / ');

            return {
                productId: id,
                title,
                options: variantOptions,
                price: product.price
            };
        });

        const created = [];
        for (const v of variantsToCreate) {
            const variant = await prisma.productVariant.create({
                data: v
            });
            created.push(variant);
        }

        return created;
    },

    createVariant: async (req: FastifyRequest<{ Params: { id: string }, Body: CreateVariantBody }>, reply: FastifyReply) => {
        const { id } = req.params;
        const variant = await prisma.productVariant.create({
            data: {
                productId: id,
                ...req.body
            }
        });
        return variant;
    },

    updateVariant: async (req: FastifyRequest<{ Params: { id: string }, Body: UpdateVariantBody }>, reply: FastifyReply) => {
        const { id } = req.params;
        const variant = await prisma.productVariant.update({
            where: { id },
            data: req.body
        });
        return variant;
    },

    // --- Inventory ---

    getInventory: async (req: FastifyRequest<{ Querystring: { storeId: string } }>, reply: FastifyReply) => {
        const { storeId } = req.query as any;
        // For V1 simple list
        const items = await prisma.inventoryItem.findMany({
            where: {
                location: { storeId }
            },
            include: {
                variant: true,
                product: true
            }
        });
        return items;
    },

    adjustInventory: async (req: FastifyRequest<{ Body: AdjustInventoryBody }>, reply: FastifyReply) => {
        const { storeId, variantId, quantity, reason, locationId } = req.body as any;

        const result = await prisma.$transaction(async (tx: any) => {
            let locId = locationId;
            if (!locId) {
                // Find or create default location
                const defaultLoc = await tx.inventoryLocation.findFirst({ where: { storeId, isDefault: true } });
                if (defaultLoc) locId = defaultLoc.id;
                else {
                    const newLoc = await tx.inventoryLocation.create({ data: { storeId, name: "Main", isDefault: true } });
                    locId = newLoc.id;
                }
            }

            if (!locId) throw new Error("Could not determine location");

            // Find or Create Item
            let item = await tx.inventoryItem.findUnique({
                where: { locationId_variantId: { locationId: locId, variantId } }
            });

            if (!item) {
                const variant = await tx.productVariant.findUnique({ where: { id: variantId } });
                if (!variant) throw new Error("Variant not found");

                item = await tx.inventoryItem.create({
                    data: {
                        locationId: locId,
                        variantId: variantId,
                        productId: variant.productId,
                        onHand: 0,
                        available: 0
                    }
                });
            }

            const newOnHand = item.onHand + quantity;
            const newAvailable = newOnHand - item.reserved;

            const updatedItem = await tx.inventoryItem.update({
                where: { id: item.id },
                data: {
                    onHand: newOnHand,
                    available: newAvailable
                }
            });

            await tx.inventoryMovement.create({
                data: {
                    storeId,
                    locationId: locId,
                    variantId,
                    type: quantity > 0 ? 'ADJUSTMENT_INC' : 'ADJUSTMENT_DEC',
                    quantity,
                    reason: reason || 'Manual Adjustment'
                }
            });

            return updatedItem;
        });

        return result;
    }
};
