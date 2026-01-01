import { FastifyInstance } from "fastify";
import {
  listProductsHandler,
  createProductHandler,
  getProductHandler,
  updateProductHandler,
  deleteProductHandler,
  listPublicProductsHandler,
} from "./controller";

export const productRoutes = async (server: FastifyInstance) => {
  server.get("/", listProductsHandler);
  server.get("/public", listPublicProductsHandler);
  server.post("/", createProductHandler);
  server.get("/:id", getProductHandler);
  server.put("/:id", updateProductHandler);
  server.delete("/:id", deleteProductHandler);
};
