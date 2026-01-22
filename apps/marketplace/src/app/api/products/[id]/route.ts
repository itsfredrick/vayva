import { handleGetProduct } from "@/services/products/handler";

export async function GET(req: Request, context: any) {
    return handleGetProduct(req, context);
}
