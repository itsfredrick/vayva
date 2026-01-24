import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { reportError } from "@/lib/error";
import { z } from "zod";

export async function POST(req: NextRequest) {
  let storeId: string | undefined;

  try {
    const body = await req.json();

    // Zod Validation Schema
    const OrderSchema = z.object({
      storeId: z.string().uuid(),
      items: z.array(z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive(),
        metadata: z.record(z.unknown()).optional()
      })).min(1),
      customer: z.object({
        email: z.string().email(),
        phone: z.string().optional(),
        note: z.string().optional()
      }).optional(),
      deliveryMethod: z.string().optional(),
      paymentMethod: z.string().optional()
    });

    const parseResult = OrderSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({
        message: "Invalid payload",
        errors: parseResult.error.flatten()
      }, { status: 400 });
    }

    const { storeId: _s, items, customer, deliveryMethod } = parseResult.data;
    storeId = _s;

    // Generate Identifiers
    const count = await prisma.order.count({ where: { storeId } });
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}-${count + 1}`;
    const refCode = `REF-${Math.random().toString(36).substring(7).toUpperCase()}`;

    let initialPaymentStatus = "PENDING";
    if (deliveryMethod === "pickup" && body.paymentMethod === "cash") {
      initialPaymentStatus = "PENDING";
    }

    // Transaction: Inventory Check & Order Creation with Server-Side Pricing
    const result = await prisma.$transaction(async (tx) => {
      let calculatedSubtotal = 0;
      const orderItemsData = [];

      // 1. Process Items & Inventory
      for (const item of items) {
        if (!item.id) continue;

        // Fetch Product from DB to get TRUSTED price
        const product = await tx.product.findUnique({
          where: { id: item.id },
          select: { id: true, title: true, price: true, trackInventory: true }
        });

        if (!product) {
          throw new Error(`Product not found: ${item.id}`);
        }

        // Use DB Price
        const itemPrice = Number(product.price);
        const itemTotal = itemPrice * item.quantity;
        calculatedSubtotal += itemTotal;

        // Type logic for metadata?
        // Assuming body.items has metadata: { spiciness?: string, bookingDate?: string }
        // We need to store this in OrderItem.metadata (Json)

        orderItemsData.push({
          productId: product.id,
          title: product.title,
          quantity: item.quantity,
          price: itemPrice, // TRUSTED PRICE
          metadata: item.metadata || {}, // Pass through client metadata (validated?)
        });

        // Inventory Management
        if (product.trackInventory) {
          // Find default location first (Relation filtering constraint in updateMany)
          const defaultLocation = await tx.inventoryLocation.findFirst({
            where: { storeId, isDefault: true },
            select: { id: true }
          });

          if (!defaultLocation) throw new Error("Default inventory location not found");

          const updateResult = await tx.inventoryItem.updateMany({
            where: {
              productId: product.id,
              locationId: defaultLocation.id,
              available: { gte: item.quantity },
            },
            data: {
              available: { decrement: item.quantity },
            },
          });

          if (updateResult.count === 0) {
            throw new Error(`Out of stock for product: ${product.title}`);
          }
        }
      }

      // 2. Create Order with Calculated Totals
      const finalTotal = calculatedSubtotal; // + delivery if logic exists

      const order = await tx.order.create({
        data: {
          storeId: storeId!,
          refCode,
          orderNumber,
          status: "DRAFT",
          paymentStatus: initialPaymentStatus as any,
          fulfillmentStatus: "UNFULFILLED",
          total: finalTotal,
          subtotal: calculatedSubtotal,
          customerEmail: customer?.email,
          customerPhone: customer?.phone,
          customerNote: customer?.note,
          deliveryMethod: deliveryMethod || "shipping",
          items: {
            create: orderItemsData,
          },
        },
      });

      // 3. Wallet Logic (If Auto-Success)
      if (initialPaymentStatus === "SUCCESS") {
        const amountKobo = BigInt(Math.round(finalTotal * 100));
        await tx.wallet.upsert({
          where: { storeId: storeId! },
          update: { availableKobo: { increment: amountKobo } },
          create: {
            storeId: storeId!,
            availableKobo: amountKobo,
            kycStatus: "VERIFIED",
            vaStatus: "CREATED",
            vaBankName: "Wema Bank",
            vaAccountNumber: `9${Math.floor(Math.random() * 9000000000)}`,
            vaAccountName: "Vayva Merchant Store",
          },
        });
      }

      return order;
    });

    // 4. Fetch Details for Response
    const wallet = await prisma.wallet.findUnique({
      where: { storeId: storeId! },
      select: { vaBankName: true, vaAccountNumber: true, vaAccountName: true }
    });

    const store = await prisma.store.findUnique({
      where: { id: storeId! },
      select: { name: true }
    });

    return NextResponse.json({
      success: true,
      orderId: result.id,
      orderNumber: result.orderNumber,
      paymentUrl: `/checkout/pay/${result.id}`,
      storeName: store?.name || "Store",
      bankDetails: wallet ? {
        bankName: wallet.vaBankName,
        accountNumber: wallet.vaAccountNumber,
        accountName: wallet.vaAccountName
      } : null
    });

  } catch (error: any) {
    reportError(error, { route: "POST /api/orders", storeId: storeId });
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
