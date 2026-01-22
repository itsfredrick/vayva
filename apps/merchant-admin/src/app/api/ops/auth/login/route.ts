import { NextRequest } from "next/server";
import { handleOpsLogin } from "@/services/ops/handlers";

export async function POST(req: NextRequest) {
  return handleOpsLogin(req);
}
