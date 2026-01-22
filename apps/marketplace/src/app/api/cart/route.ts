
import { NextResponse } from "next/server";
import { CartService } from "@vayva/shared/cart-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const cartId = searchParams.get("cartId");

    if (!cartId) {
        return NextResponse.json(null);
    }

    try {
        const cart = await CartService.getCart(cartId);
        return NextResponse.json(cart);
    } catch (error) {
        console.error("Cart GET error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { cartId, variantId, quantity } = body;
        const session = await getServerSession(authOptions);

        if (!cartId) {
            // Create new cart
            const newCart = await CartService.createCart(
                (session?.user)?.id as string | undefined, // Cast to string if exists
                undefined // Session token logic if needed custom
            );
            cartId = newCart.id;
        }

        if (variantId) {
            await CartService.addItem(cartId, variantId, quantity || 1);
        }

        const updatedCart = await CartService.getCart(cartId);
        return NextResponse.json(updatedCart);

    } catch (error) {
        console.error("Cart POST error:", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
