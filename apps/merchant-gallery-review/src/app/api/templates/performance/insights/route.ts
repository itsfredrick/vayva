import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "ins_1",
      type: "positive",
      message: "Your menu-based layout converts 28% better on mobile.",
      impact: "high",
      action: "Keep current layout",
    },
    {
      id: "ins_2",
      type: "warning",
      message: "Checkout friction detected: 19% drop-off on delivery step.",
      impact: "medium",
      action: "Review Delivery Settings",
      actionLink: "/admin/settings/delivery",
    },
    {
      id: "ins_3",
      type: "negative",
      message: "Theme contrast too low for older devices.",
      impact: "low",
      action: "Switch to High Contrast Theme",
      actionLink: "/admin/control-center?tab=theme",
    },
  ]);
}
