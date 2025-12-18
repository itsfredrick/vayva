import { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@vayva/db';

export const listProductsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    if (!storeId) return reply.status(400).send({ error: 'Store ID required' });

    const products = await prisma.product.findMany({
        where: { storeId },
        include: { variants: true }
    });
    return reply.send(products);
};

export const listPublicProductsHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    // Expect storeId via query param (rewritten by gateway or passed directly)
    const { storeId } = req.query as { storeId: string };

    if (!storeId) return reply.status(400).send({ error: 'Store ID required' });

    const products = await prisma.product.findMany({
        where: {
            storeId,
            status: 'ACTIVE' // Only active products
        },
        include: { variants: true }
    });
    return reply.send(products);
};

export const createProductHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const storeId = req.headers['x-store-id'] as string;
    if (!storeId) return reply.status(400).send({ error: 'Store ID required' });

    const { name, description, price, sku, stock } = req.body as any;
    const title = name;
    const handle = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
        data: {
            storeId,
            title,
            handle: handle + '-' + Date.now(), // Ensure unique
            description,
            status: 'ACTIVE',
            variants: {
                create: {
                    title: 'Default',
                    price: parseFloat(price),
                    sku,
                    options: {} // Required by schema
                }
            }
        },
        include: { variants: true }
    });

    // Log Inventory Event
    await prisma.inventoryEvent.create({
        data: {
            variantId: (product as any).variants[0].id,
            quantity: parseInt(stock || '0'),
            action: 'ADJUSTMENT',
            reason: 'Initial stock',
            // performedBy: 'user' // Placeholder
        }
    });

    return reply.send(product);
};

export const getProductHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const product = await prisma.product.findUnique({
        where: { id },
        include: { variants: true }
    });
    if (!product) return reply.status(404).send({ error: 'Product not found' });
    return reply.send(product);
};

export const updateProductHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    const { name, description, price, stock } = req.body as any;

    // Simple V1 Update: Update Product and Default Variant Price/Stock
    // Real world needs robust variant handling.

    const product = await prisma.product.update({
        where: { id },
        data: {
            title: name,
            description,
        },
        include: { variants: true }
    });

    // Update default variant price/stock if provided
    if (product.variants.length > 0) {
        await prisma.productVariant.update({
            where: { id: (product as any).variants[0].id },
            data: {
                price: price ? parseFloat(price) : undefined,
                // inventory removed as it's not on variant model
            }
        });
    }

    // Return updated
    const updated = await prisma.product.findUnique({
        where: { id },
        include: { variants: true }
    });
    return reply.send(updated);
};

export const deleteProductHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const { id } = req.params as { id: string };
    await prisma.product.delete({ where: { id } });
    return reply.send({ status: 'deleted' });
};
