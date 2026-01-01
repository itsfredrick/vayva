import { NextResponse } from "next/server";

export async function GET() {
  const activity = [
    {
      id: 1,
      type: "ORDER",
      message: "New order #1024 received",
      user: "Amara K.",
      time: "2m ago",
    },
    {
      id: 2,
      type: "PAYMENT",
      message: "Payment of ₦15,000 confirmed",
      user: "System",
      time: "5m ago",
    },
    {
      id: 3,
      type: "WHATSAPP",
      message: 'New message about "Nike Air.."',
      user: "Chidi",
      time: "12m ago",
    },
    {
      id: 4,
      type: "ORDER",
      message: "Order #1023 marked as delivered",
      user: "Logistics",
      time: "1h ago",
    },
    {
      id: 5,
      type: "BOOKING",
      message: "Appointment confirmed",
      user: "Sarah J.",
      time: "2h ago",
    },
  ];

  return NextResponse.json(activity);
}
