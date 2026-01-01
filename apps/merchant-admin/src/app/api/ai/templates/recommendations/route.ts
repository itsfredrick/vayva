import { NextResponse } from "next/server";
import { Recommendation } from "@/types/designer";

export async function GET() {
  return NextResponse.json([
    {
      templateId: "tpl_monochrome",
      reason: "Popular choice for Fashion Retail",
      expectedImpact: "+12% conversion",
      score: 95,
    },
    {
      templateId: "tpl_simple_retail_v2", // Hypothetical ID
      reason: "Fastest mobile load time",
      expectedImpact: "-20% bounce rate",
      score: 88,
    },
  ] as Recommendation[]);
}
