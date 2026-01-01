import { NextResponse } from "next/server";
import { Customer, CustomerStatus, CustomerInsight } from "@vayva/shared";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  // In a real app, fetch from DB. Here we test based on ID or return a generic VIP profile.

  // Using the same test data source concept
  const customer: Customer = {
    id: id,
    merchantId: "mer_123",
    name: "Chioma Okeke",
    phone: "+234 801 234 5678",
    firstSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    lastSeenAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    totalOrders: 12,
    totalSpend: 156000,
    status: CustomerStatus.VIP,
    preferredChannel: "whatsapp",
  };

  const insights: CustomerInsight[] = [
    {
      id: "ins_1",
      type: "timing",
      title: "Weekend Shopper",
      description: "Places 80% of orders on Saturdays.",
      icon: "CalendarClock",
      variant: "neutral",
    },
    {
      id: "ins_2",
      type: "preference",
      title: 'Loves "Summer Collection"',
      description: "Bought 3 items from this category.",
      icon: "Heart",
      variant: "positive",
    },
    {
      id: "ins_3",
      type: "spending",
      title: "High Value",
      description: "Top 5% of customers by spend.",
      icon: "TrendingUp",
      variant: "positive",
    },
  ];

  return NextResponse.json({
    profile: customer,
    insights: insights,
    stats: {
      aov: 13000,
      refunds: 0,
      cancelRate: "0%",
    },
  });
}
