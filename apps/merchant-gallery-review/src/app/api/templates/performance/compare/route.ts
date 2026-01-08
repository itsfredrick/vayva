import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      template_id: "tmpl_retail_simple",
      name: "Simple Retail",
      is_active: true,
      conversion_rate: 2.4,
      orders: 36,
      revenue: 450000,
      best_for: "Retail",
    },
    {
      template_id: "tmpl_food_catering",
      name: "Food & Catering",
      is_active: false,
      conversion_rate: 3.1,
      orders: 52,
      revenue: 680000,
      best_for: "Food",
      plan_required: "growth",
    },
    {
      template_id: "tmpl_services_bookings",
      name: "Services & Bookings",
      is_active: false,
      conversion_rate: 1.9,
      orders: 18,
      revenue: 210000,
      best_for: "Services",
      plan_required: "pro",
    },
  ]);
}
