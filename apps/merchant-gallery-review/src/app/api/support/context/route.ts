import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Adjust path as per repo structure
import { SupportContextService } from "@/lib/support/support-context.service";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const storeId = (session.user as any).storeId;
    const context = await SupportContextService.getMerchantSnapshot(storeId);

    if (!context) {
      return NextResponse.json(
        { error: "Store context not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(context);
  } catch (error) {
    console.error("[SupportContext] Error fetching context", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
