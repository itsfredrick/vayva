import { NextRequest } from "next/server";
import { handleCreateDispute } from "@/services/disputes/handler";

export async function POST(req: NextRequest) {
    return handleCreateDispute(req);
}
