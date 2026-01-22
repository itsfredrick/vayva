import { NextRequest } from "next/server";
import { handleGetKyc } from "@/services/ops/handlers";

export async function GET(req: NextRequest) {
  return handleGetKyc(req);
}
