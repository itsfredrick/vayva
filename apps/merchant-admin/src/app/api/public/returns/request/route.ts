import { NextRequest, NextResponse } from "next/server";
import { ReturnTokenService } from "@/lib/returns/returnToken";
import { ReturnService } from "@/lib/returns/returnService";
import { prisma } from "@vayva/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, items, reason, notes, preferredMethod } = body;

    if (!token) return new NextResponse("Missing token", { status: 400 });

    const claims = ReturnTokenService.validate(token);
    if (!claims)
      return new NextResponse("Invalid or expired token", { status: 401 });

    // Lookup Order to get Store ID
    // const order = await prisma.order.findUnique({ where: { id: claims.orderId } });
    // Testing Store ID for V1 if Orders not fully seeded or linked
    // Ideally: const storeId = order.storeId;
    const storeId = "store_test_id";

    const request = await ReturnService.createRequest(
      storeId,
      claims.orderId,
      claims.customerPhone,
      { items, reason, notes, preferredMethod },
    );

    return NextResponse.json({ success: true, id: request.id });
  } catch (e: any) {
    console.error(e);
    return new NextResponse(e.message || "Error", { status: 500 });
  }
}
