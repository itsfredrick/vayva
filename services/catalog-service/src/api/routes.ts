import { FastifyInstance } from "fastify";
import { CatalogController } from "./controller";

export async function catalogRoutes(fastify: FastifyInstance) {
  // Products
  fastify.post("/products", CatalogController.createProduct);
  fastify.get("/products", CatalogController.getProducts);
  fastify.get("/products/:id", CatalogController.getProduct);
  fastify.put("/products/:id", CatalogController.updateProduct);
  fastify.post("/products/:id/archive", CatalogController.archiveProduct);
  fastify.post("/products/:id/publish", CatalogController.publishProduct);

  // Variants
  fastify.post(
    "/products/:id/variants/generate",
    CatalogController.generateVariants,
  );
  fastify.post("/products/:id/variants", CatalogController.createVariant);
  fastify.put("/variants/:id", CatalogController.updateVariant);

  // Inventory
  fastify.get("/inventory", CatalogController.getInventory);
  fastify.post("/inventory/adjust", CatalogController.adjustInventory);

  // Collections
  // TODO: fastify.post('/collections', CatalogController.createCollection);
}
