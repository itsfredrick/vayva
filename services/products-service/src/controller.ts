import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "@vayva/db";

export const listProductsHandler = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const storeId = req.headers["x-store-id"] as string;
  if (!storeId) return reply.status(400).send({ error: "Store ID required" });

  const products = await prisma.product.findMany({
    where: { storeId },
    include: { productVariants: true },
  });
  return reply.send(products);
};

export const listPublicProductsHandler = async (
  req: FastifyRequest<{ Querystring: { storeId: string } }>,
  reply: FastifyReply,
) => {
  const { storeId } = req.query;

  if (!storeId) return reply.status(400).send({ error: "Store ID required" });

  const products = await prisma.product.findMany({
    where: {
      storeId,
      status: "ACTIVE", // Only active products
    },
    include: { productVariants: true },
  });
  return reply.send(products);
};

interface CreateProductBody {
  name: string;
  description?: string;
  price: string;
  sku?: string;
  stock?: string;
}

export const createProductHandler = async (
  req: FastifyRequest<{ Body: CreateProductBody }>,
  reply: FastifyReply,
) => {
  const storeId = req.headers["x-store-id"] as string;
  if (!storeId) return reply.status(400).send({ error: "Store ID required" });

  const { name, description, price, sku, stock } = req.body;
  const title = name;
  const handle = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const product = await prisma.product.create({
    data: {
      storeId,
      title,
      handle: handle + "-" + Date.now(), // Ensure unique
      description,
      status: "ACTIVE",
      productVariants: {
        create: {
          title: "Default",
          price: parseFloat(price),
          sku,
          options: {}, // Required by schema
        },
      },
    },
    include: { productVariants: true },
  });

  // Log Inventory Event
  if (product.productVariants[0]) {
    await prisma.inventoryEvent.create({
      data: {
        variantId: product.productVariants[0].id,
        quantity: parseInt(stock || "0"),
        action: "ADJUSTMENT",
        reason: "Initial stock",
      },
    });
  }

  return reply.send(product);
};

export const getProductHandler = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { productVariants: true },
  });
  if (!product) return reply.status(404).send({ error: "Product not found" });
  return reply.send(product);
};

interface UpdateProductBody {
  name?: string;
  description?: string;
  price?: string;
  stock?: string;
}

export const updateProductHandler = async (
  req: FastifyRequest<{ Params: { id: string }; Body: UpdateProductBody }>,
  reply: FastifyReply,
) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const product = await prisma.product.update({
    where: { id },
    data: {
      title: name,
      description,
    },
    include: { productVariants: true },
  });

  // Update default variant price/stock if provided
  if (product.productVariants.length > 0) {
    await prisma.productVariant.update({
      where: { id: product.productVariants[0].id },
      data: {
        price: price ? parseFloat(price) : undefined,
      },
    });
  }

  // Return updated (re-fetch to get latest state)
  const updated = await prisma.product.findUnique({
    where: { id },
    include: { productVariants: true },
  });
  return reply.send(updated);
};

export const deleteProductHandler = async (
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const { id } = req.params;
  await prisma.product.delete({ where: { id } });
  return reply.send({ status: "deleted" });
};
