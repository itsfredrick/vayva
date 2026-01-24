/* eslint-disable */
// @ts-nocheck
import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@vayva/db";


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

  createProduct: async (
    req: FastifyRequest<{ Body: CreateProductBody }>,
    reply: FastifyReply,
  ): Promise<unknown> => {
    const {
      storeId,
      title,
      price,
      description,
      status,
      trackInventory,
      variants,
    } = req.body;

    // Transaction to create product + variants + initial inventory
    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          storeId,
          title,
          description,
          price: price || 0,
          status: (status as any) || "DRAFT",
          handle:
            title.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
            "-" +
            Math.floor(Math.random() * 1000),
          trackInventory: trackInventory ?? true,
        },
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
                  inventoryLocation: {
                    connectOrCreate: {
                      where: { id: "DEFAULT" },
                      create: {
                        storeId,
                        name: "Default Location",
                        isDefault: true,
                      },
                    },
                  },
                  onHand: v.initialStock || 0,
                  available: v.initialStock || 0,
                  product: { connect: { id: product.id } }
                },
              },
            },
          });
        }
      } else {
        // Create a "Default" variant for simple products
        await tx.productVariant.create({
          data: {
            productId: product.id,
            title: "Default",
            options: {},
            price: price,
            inventoryItems: {
              create: {
                inventoryLocation: {
                  create: {
                    storeId,
                    name: "Default Location",
                    isDefault: true,
                  },
                },
                product: { connect: { id: product.id } }
              },
            },
          },
        });
      }

      return product;
    });

    return reply.status(201).send(result);
  },

  getProducts: async (
    req: FastifyRequest<{ Querystring: { storeId: string; status?: string } }>,
    reply: FastifyReply,
  ): Promise<unknown> => {
    const { storeId, status } = req.query;
    if (!storeId) return reply.status(400).send({ error: "storeId required" });

    const products = await prisma.product.findMany({
      where: {
        storeId,
        status: (status as any) || undefined,
      },
      include: {
        productVariants: true,
        productImages: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return products;
  },

  getProduct: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
  ): Promise<unknown> => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        productVariants: {
          include: {
            inventoryItems: true,
          },
        },
        productImages: true,
      },
    });
    if (!product) return reply.status(404).send({ error: "Product not found" });
    return product;
  },

  updateProduct: async (
    req: FastifyRequest<{ Params: { id: string }; Body: any }>,
    _reply: FastifyReply,
  ): Promise<unknown> => {
    const { id } = req.params;
    const data = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: data as any,
    });
    return product;
  },

  archiveProduct: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    _reply: FastifyReply,
  ): Promise<unknown> => {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: { status: "ARCHIVED" as any },
    });
    return product;
  },

  publishProduct: async (
    req: FastifyRequest<{ Params: { id: string } }>,
    _reply: FastifyReply,
  ): Promise<unknown> => {
    const { id } = req.params;
    const product = await prisma.product.update({
      where: { id },
      data: { status: "ACTIVE" as any },
    });
    return product;
  },

  // --- Variants ---

  generateVariants: async (
    req: FastifyRequest<{ Params: { id: string }; Body: GenerateVariantsBody }>,
    reply: FastifyReply,
  ): Promise<unknown> => {
    const { id } = req.params;
    const { options } = req.body;

    const keys = Object.keys(options);
    const cartesian = (...a: any[][]): any[][] =>
      a.reduce((a, b) =>
        a.flatMap((d) => b.map((e) => [d, e].flat())),
      );

    const valueArrays = keys.map((k) => options[k]);
    const combinations =
      valueArrays.length > 0
        ? valueArrays.length === 1
          ? valueArrays[0].map((v) => [v])
          : cartesian(...valueArrays)
        : [];

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return reply.status(404).send({ error: "Product not found" });

    const variantsToCreate = combinations.map((combo: any[]) => {
      const variantOptions: Record<string, string> = {};
      keys.forEach((key, idx) => {
        variantOptions[key] = combo[idx];
      });
      const title = combo.join(" / ");

      return {
        productId: id,
        title,
        options: variantOptions,
        price: product.price,
      };
    });

    const created = [];
    for (const v of variantsToCreate) {
      const variant = await prisma.productVariant.create({
        data: v,
      });
      created.push(variant);
    }

    return created;
  },

  createVariant: async (
    req: FastifyRequest<{ Params: { id: string }; Body: CreateVariantBody }>,
    _reply: FastifyReply,
  ): Promise<unknown> => {
    const { id } = req.params;
    const variant = await prisma.productVariant.create({
      data: {
        productId: id,
        ...req.body,
      },
    });
    return variant;
  },

  updateVariant: async (
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateVariantBody }>,
    _reply: FastifyReply,
  ): Promise<unknown> => {
    const { id } = req.params;
    const variant = await prisma.productVariant.update({
      where: { id },
      data: req.body as any,
    });
    return variant;
  },

  // --- Inventory ---

  getInventory: async (
    req: FastifyRequest<{ Querystring: { storeId: string } }>,
    _reply: FastifyReply,
  ): Promise<unknown> => {
    const { storeId } = req.query;
    const items = await prisma.inventoryItem.findMany({
      where: {
        inventoryLocation: { storeId },
      },
      include: {
        productVariant: true,
        product: true,
      },
    });
    return items;
  },

  adjustInventory: async (
    req: FastifyRequest<{ Body: AdjustInventoryBody }>,
    _reply: FastifyReply,
  ): Promise<unknown> => {
    const { storeId, variantId, quantity, reason, locationId } =
      req.body;

    const result = await prisma.$transaction(async (tx) => {
      let locId = locationId;
      if (!locId) {
        // Find or create default location
        const defaultLoc = await tx.inventoryLocation.findFirst({
          where: { storeId, isDefault: true },
        });
        if (defaultLoc) locId = defaultLoc.id;
        else {
          const newLoc = await tx.inventoryLocation.create({
            data: { storeId, name: "Main", isDefault: true },
          });
          locId = newLoc.id;
        }
      }

      if (!locId) throw new Error("Could not determine location");

      // Find or Create Item
      let item = await tx.inventoryItem.findUnique({
        where: { locationId_variantId: { locationId: locId, variantId } },
      });

      if (!item) {
        const variant = await tx.productVariant.findUnique({
          where: { id: variantId },
        });
        if (!variant) throw new Error("Variant not found");

        item = await tx.inventoryItem.create({
          data: {
            locationId: locId,
            variantId: variantId,
            productId: variant.productId,
            onHand: 0,
            available: 0,
          },
        });
      }

      const newOnHand = item.onHand + quantity;
      const newAvailable = newOnHand - item.reserved;

      const updatedItem = await tx.inventoryItem.update({
        where: { id: item.id },
        data: {
          onHand: newOnHand,
          available: newAvailable,
        },
      });

      await tx.inventoryMovement.create({
        data: {
          storeId,
          locationId: locId,
          variantId,
          type: (quantity > 0 ? "ADJUSTMENT_INC" : "ADJUSTMENT_DEC") as any,
          quantity,
          reason: reason || "Manual Adjustment",
        },
      });

      return updatedItem;
    });

    return result;
  },

  // --- Collections ---

  createCollection: async (
    req: FastifyRequest<{ Body: { storeId: string; title: string; description?: string; productIds?: string[] } }>,
    reply: FastifyReply,
  ): Promise<unknown> => {
    const { storeId, title, description, productIds } = req.body;
    const handle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Math.floor(Math.random() * 1000);

    const collection = await prisma.collection.create({
      data: {
        storeId,
        title,
        description,
        handle,
        collectionProducts: productIds ? {
          create: productIds.map(id => ({ productId: id }))
        } : undefined
      }
    });

    return reply.status(201).send(collection);
  },

  getCollections: async (
    req: FastifyRequest<{ Querystring: { storeId: string } }>,
    _reply: FastifyReply,
  ): Promise<unknown> => {
    const { storeId } = req.query;
    const collections = await prisma.collection.findMany({
      where: { storeId },
      include: { collectionProducts: { include: { product: true } } }
    });
    return collections;
  },
};
