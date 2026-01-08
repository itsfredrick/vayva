import { NextResponse } from "next/server";

export async function GET() {
  // Determine season logic here (tested to Ramadan for now)
  return NextResponse.json({
    season: "Ramadan",
    id: "season_ramadan_2025",
    active: true,
    expected_uplift: "+18%",
    changes: [
      'Hero Banner: "Ramadan Kareem" with special offer',
      "Menu: Iftar specials prioritized",
      'CTA: "Order before Iftar" enabled',
    ],
    preview_image: "/assets/demo-preview-ramadan.jpg", // Placeholder
  });
}
