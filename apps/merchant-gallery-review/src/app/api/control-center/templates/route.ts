import { NextResponse } from "next/server";
import { StoreTemplate, SubscriptionPlan } from "@vayva/shared";

const DEMO_TEMPLATES: StoreTemplate[] = [
  {
    id: "tmpl_nova",
    name: "Nova Minimal",
    description: "Clean, product-focused design for modern retail brands.",
    category: "retail",
    type: "website",
    planLevel: SubscriptionPlan.STARTER,
    thumbnailUrl: "/templates/nova.jpg",
    isActive: true, // Default active
    isLocked: false,
  },
  {
    id: "tmpl_bistro",
    name: "Bistro Direct",
    description: "Quick-order interface optimized for food delivery.",
    category: "food",
    type: "hybrid",
    planLevel: SubscriptionPlan.STARTER,
    thumbnailUrl: "/templates/bistro.jpg",
    isActive: false,
    isLocked: false,
  },
  {
    id: "tmpl_luxe",
    name: "Luxe Atelier",
    description: "Premium aesthetic with advanced galleries for luxury items.",
    category: "retail",
    type: "website",
    planLevel: SubscriptionPlan.GROWTH,
    thumbnailUrl: "/templates/luxe.jpg",
    isActive: false,
    isLocked: true, // Locked for starter
  },
  {
    id: "tmpl_service_pro",
    name: "Service Pro",
    description: "Booking-centric layout for consultants and salons.",
    category: "services",
    type: "website",
    planLevel: SubscriptionPlan.PRO,
    thumbnailUrl: "/templates/service.jpg",
    isActive: false,
    isLocked: true, // Locked
  },
];

export async function GET() {
  return NextResponse.json(DEMO_TEMPLATES);
}
