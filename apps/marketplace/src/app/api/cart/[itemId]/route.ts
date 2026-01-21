
import { NextResponse } from "next/server";
import { CartService } from "@vayva/shared/cart-service";

export async function PUT(req: Request, context: { params: Promise<{ itemId: string }> }) {
    try {
        const body = await req.json();
        const { quantity } = body;
        const params = await context.params;
        const { itemId } = params;

        await CartService.updateItem(itemId, quantity);

        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Error updating item", { status: 500 });
    }
}

export async function DELETE(req: Request, context: { params: Promise<{ itemId: string }> }) {
    try {
        const params = await context.params;
        const { itemId } = params;
        await CartService.removeItem(itemId);
        return NextResponse.json({ success: true });
    } catch (error) {
        return new NextResponse("Error removing item", { status: 500 });
    }
}
