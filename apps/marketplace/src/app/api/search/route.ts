import { NextRequest } from "next/server";
import { handleSearch } from "@/services/search/handler";

export async function GET(req: NextRequest) {
    return handleSearch(req);
}
