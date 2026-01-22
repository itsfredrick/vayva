import { NextRequest } from "next/server";
import { handleGetMerchants } from "@/services/ops/handlers";

export async function GET(req: NextRequest) {
  return handleGetMerchants(req);
}
