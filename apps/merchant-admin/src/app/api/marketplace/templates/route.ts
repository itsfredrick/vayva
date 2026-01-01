import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "tpl_mkt_minimalist_lux",
      name: "Minimalist Lux",
      designer: "Studio Alpha",
      price: 50000,
      currency: "NGN",
      rating: 4.8,
      reviews: 124,
      image: "/placeholder-template-1.jpg",
      best_for: ["Fashion", "Beauty"],
      badges: ["Top Performing", "Editor's Pick"],
    },
    {
      id: "tpl_mkt_fast_food_pro",
      name: "Fast Food Pro",
      designer: "Vayva Labs",
      price: 0,
      currency: "NGN",
      rating: 4.9,
      reviews: 850,
      image: "/placeholder-template-2.jpg",
      best_for: ["Food", "Restaurants"],
      badges: ["AI Recommended", "Official"],
    },
    {
      id: "tpl_mkt_service_booking",
      name: "Service Booking Elite",
      designer: "WebFlow Masters",
      price: 35000,
      currency: "NGN",
      rating: 4.5,
      reviews: 42,
      image: "/placeholder-template-3.jpg",
      best_for: ["Salons", "Consultants"],
      badges: [],
    },
  ]);
}
