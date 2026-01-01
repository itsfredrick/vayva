import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withRBAC } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";

function sanitizeHtml(html: string) {
  if (!html) return "";
  // Simple regex-based sanitization for high-risk tags
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "");
}

export const GET = withRBAC(
  PERMISSIONS.COMMERCE_VIEW,
  async (
    session: any,
    request: Request,
    props: { params: Promise<{ id: string }> },
  ) => {
    try {
      const storeId = session.user.storeId;
      const { id } = await props.params;

      const product = await prisma.product.findUnique({
        where: { id, storeId },
        include: {
          ProductVariant: {
            include: {
              InventoryItem: true,
            },
          },
        },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }

      const formatted = {
        id: product.id,
        name: product.title,
        description: product.description,
        status: product.status === "ACTIVE" ? "active" : "draft",
        price: Number(product.price),
        inventory: product.ProductVariant.reduce(
          (acc: number, v: any) => acc + (v.InventoryItem[0]?.available || 0),
          0,
        ),
        category: product.productType,
        images: [],
        variants: product.ProductVariant.map((v: any) => ({
          id: v.id,
          name: v.title,
          price: Number(v.price),
          inventory: v.InventoryItem[0]?.available || 0,
          sku: v.sku,
        })),
        updatedAt: product.updatedAt.toISOString(),
      };

      return NextResponse.json(formatted);
    } catch (error) {
      console.error("GET Product Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch product" },
        { status: 500 },
      );
    }
  },
);

export const PUT = withRBAC(
  PERMISSIONS.COMMERCE_MANAGE,
  async (
    session: any,
    request: Request,
    props: { params: Promise<{ id: string }> },
  ) => {
    try {
      const storeId = session.user.storeId;
      const { id } = await props.params;
      const body = await request.json();

      // 1. Get Default Location
      let location = await prisma.inventoryLocation.findFirst({
        where: { storeId, isDefault: true },
      });

      if (!location) {
        // Auto-create default location if missing
        location = await prisma.inventoryLocation.create({
          data: {
            storeId,
            name: "Default Location",
            isDefault: true,
          },
        });
      }

      const locationId = location.id;

      // 2. Update Product Basics
      const updated = await prisma.product.update({
        where: { id, storeId },
        data: {
          title: body.name,
          description: sanitizeHtml(body.description),
          status: body.status === "active" ? "ACTIVE" : "DRAFT",
          price: body.price,
        },
      });

      // 3. Handle Variants (Re-create strategy for MVP)
      if (body.variants) {
        await prisma.inventoryItem.deleteMany({ where: { productId: id } });
        await prisma.productVariant.deleteMany({ where: { productId: id } });

        for (const v of body.variants) {
          const variant = await prisma.productVariant.create({
            data: {
              productId: id,
              title: v.name,
              price: v.price,
              sku: v.sku || "",
              options: [], // Required by schema
              trackInventory: true,
            },
          });

          // Create Inventory Item
          await prisma.inventoryItem.create({
            data: {
              locationId,
              variantId: variant.id,
              productId: id,
              onHand: Number(v.inventory),
              available: Number(v.inventory),
            },
          });
        }
      }

      return NextResponse.json(updated);
    } catch (error) {
      console.error("Update Product Error:", error);
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }
  },
);

export const DELETE = withRBAC(
  PERMISSIONS.COMMERCE_MANAGE,
  async (
    session: any,
    request: Request,
    props: { params: Promise<{ id: string }> },
  ) => {
    try {
      const storeId = session.user.storeId;
      const { id } = await props.params;

      // Clean up inventory items first (FK constraint)
      await prisma.inventoryItem.deleteMany({ where: { productId: id } });
      await prisma.productVariant.deleteMany({ where: { productId: id } });

      await prisma.product.delete({
        where: { id, storeId },
      });

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Delete Product Error:", error);
      return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    }
  },
);
