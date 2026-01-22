import { NextRequest } from "next/server";
import { handleGetOpsUsers, handleCreateOpsUser } from "@/services/ops/handlers";

export async function GET(req: NextRequest) {
  return handleGetOpsUsers(req);
}

export async function POST(req: NextRequest) {
  return handleCreateOpsUser(req);
}
