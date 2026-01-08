import { NextResponse } from "next/server";
import { CustomerActivity } from "@vayva/shared";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const history: CustomerActivity[] = [
    {
      id: "act_1",
      type: "order",
      status: "completed",
      amount: 25000,
      date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      description: "Order #9921 - 3 Items",
      metadata: { orderId: "ord_9921" },
    },
    {
      id: "act_2",
      type: "message",
      status: "received",
      date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
      description: "Inquired about delivery time.",
      metadata: { channel: "whatsapp" },
    },
    {
      id: "act_3",
      type: "order",
      status: "completed",
      amount: 12000,
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
      description: "Order #8812 - 1 Item",
      metadata: { orderId: "ord_8812" },
    },
    {
      id: "act_4",
      type: "note",
      status: "internal",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
      description: "Added to VIP list manually.",
      metadata: { author: "Admin" },
    },
  ];

  return NextResponse.json(history);
}
