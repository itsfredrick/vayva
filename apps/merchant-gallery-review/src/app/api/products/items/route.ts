import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withRBAC } from "@/lib/team/rbac";
import { PERMISSIONS } from "@/lib/team/permissions";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

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
  async (session: any, request: Request) => {
    try {
      const storeId = session.user.storeId;
      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");
      const limit = parseInt(searchParams.get("limit") || "50");
      const offset = parseInt(searchParams.get("offset") || "0");

      const where: any = { storeId };
      if (status) where.status = status;

      const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
        include: {
          InventoryItem: true
        }
      });

      const formattedProducts = products.map((product: any) => {
        const totalQuantity = product.InventoryItem?.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) || 0;

        return {
          id: product.id,
          merchantId: product.storeId,
          type: "RETAIL",
          name: product.title,
          description: product.description || "",
          price: Number(product.price),
          currency: "NGN",
          status: product.status,
          inventory: {
            enabled: product.trackInventory,
            quantity: totalQuantity,
          },
          itemsSold: 0,
          createdAt: product.createdAt.toISOString(),
        };
      });

      return NextResponse.json(formattedProducts);
    } catch (error) {
      console.error("Fetch Products Error:", error);
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }
  },
);

export const POST = withRBAC(
  PERMISSIONS.COMMERCE_MANAGE,
  async (session: any, request: Request) => {
    try {
      const storeId = session.user.storeId;
      const userId = session.user.id;
      const body = await request.json();

      const product = await prisma.product.create({
        data: {
          storeId,
          title: body.name,
          description: sanitizeHtml(body.description),
          handle:
            body.handle || (body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
              "-" +
              Math.random().toString(36).substring(2, 7)),
          price: body.price,
          status: body.status || "ACTIVE",
          productType: body.type,
          sku: body.sku,
          trackInventory: body.trackInventory ?? true,
          ProductImage: body.images ? {
            create: body.images.map((img: any, idx: number) => ({
              url: img.url,
              position: idx,
            }))
          } : undefined,
        },
        include: {
          ProductImage: true,
        }
      });

      // Audit Log
      await logAuditEvent(storeId, userId, "PRODUCT_CREATED", {
        productId: product.id,
        name: product.title,
        price: product.price,
      });

      return NextResponse.json(product);
    } catch (error: any) {
      console.error("Create Product Error:", error);
      return NextResponse.json(
        { error: "Failed to create product" },
        { status: 500 },
      );
    }
  },
);
