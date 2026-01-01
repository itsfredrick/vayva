import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    count: 2,
    items: [
      {
        id: "n1",
        type: "unanswered",
        conversation_id: "conv_123",
        customer_name: "Alice Cooper",
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 mins ago
      },
      {
        id: "n2",
        type: "order_inquiry",
        conversation_id: "conv_456",
        customer_name: "Bob Brown",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
      },
    ],
  });
}
