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
        ProductImage: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const publicProduct = {
      id: product.id,
      title: product.title,
      description: product.description,
      price: Number(product.price),
      compareAtPrice: product.compareAtPrice
        ? Number(product.compareAtPrice)
        : null,
      images: product.ProductImage.sort(
        (a: any, b: any) => a.position - b.position,
      ).map((img: any) => img.url),
      handle: product.handle,
      options: [],
      variants: [],
      trackInventory: product.trackInventory,
      stockLevel: 100,
    };

    return NextResponse.json(publicProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}
