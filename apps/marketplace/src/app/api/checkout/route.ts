
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { OrderCoreService } from "@vayva/shared/order-core-service";
import { rateLimitService } from "@/lib/security/rate-limit";
import { reportError } from "@/lib/error";

export async function POST(req: Request) {
    let session;
    let body;

    try {
        session = await getServerSession(authOptions);
        // Cast to any because our session types might be loose, but runtime checks ensure safety
        const userId = (session?.user as any)?.id;

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Rate Limit: 10 checkouts per 5 minutes (prevent spam)
        const rateLimit = await rateLimitService.middlewareCheck(req, "checkout", { windowMs: 5 * 60 * 1000, max: 10 });
        if (rateLimit) return rateLimit;

        body = await req.json();
        const { cartId } = body;

        if (!cartId) {
            return NextResponse.json({ error: "Cart ID required" }, { status: 400 });
        }

        // Execute Transactional Order Creation
        const order = await OrderCoreService.createOrdersFromCart(cartId, userId);

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error: any) {
        reportError(error, { userId: (session?.user as any)?.id, cartId: body?.cartId });
        return NextResponse.json(
            { error: error.message || "Failed to place order" },
            { status: 500 }
        );
    }
}
