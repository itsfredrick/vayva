import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "inv_1",
      invoiceNumber: "INV-1001",
      customer: { name: "John Doe", email: "john@example.com" },
      totalAmount: 50000,
      status: "paid",
      issuedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "inv_2",
      invoiceNumber: "INV-1002",
      customer: { name: "Alice Smith", email: "alice@example.com" },
      totalAmount: 75000,
      status: "pending",
      issuedAt: new Date().toISOString(),
    },
  ]);
}

export async function POST(request: Request) {
  const data = await request.json();
  return NextResponse.json({
    id: `inv_${Date.now()}`,
    ...data,
    status: "draft",
    created_at: new Date().toISOString(),
  });
}
