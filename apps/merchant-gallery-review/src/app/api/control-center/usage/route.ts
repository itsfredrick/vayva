import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    orders: { used: 45, limit: 100, label: "Free Orders / mo" },
    products: { used: 12, limit: 20, label: "Products" },
    templates: { used: 1, limit: 2, label: "Active Templates" },
  });
}
