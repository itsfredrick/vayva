import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        productImages: true,
        inventoryItems: {
          select: { available: true }
        }
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Calculate total stock from all inventory locations
    const stockLevel = product.inventoryItems.reduce((sum: number, item: unknown) => sum + item.available, 0);

    const publicProduct = {
      id: product.id,
      name: product.title,
      description: product.description,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice
        ? Number(product.compareAtPrice)
        : null,
      images: product.productImages.sort(
        (a: unknown, b: unknown) => a.position - b.position,
      ).map((img: unknown) => img.url),
      handle: product.handle,
      options: [],
      variants: [],
      trackInventory: product.trackInventory,
      stockLevel: stockLevel,
    };

    return NextResponse.json(publicProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
