import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    recommended_template_id: "tmpl_food_catering",
    reason:
      "Merchants selling food with similar order volume see +23% more orders using Food & Catering (Bold theme).",
    potential_uplift: {
      orders: 23,
      revenue: 15,
    },
  });
}
