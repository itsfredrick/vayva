import { NextResponse } from "next/server";
import { DesignerTemplate } from "@/types/designer";

const DEMO_DESIGNER_TEMPLATES: any[] = [
  {
    id: "tpl_urban_v2",
    submissionId: "sub_123",
    name: "Urban V2",
    description: "Updated urban theme with better mobile nav.",
    category: "retail",
    planLevel: "growth",
    isActive: false,
    isLocked: false,
    previewImages: {
      cover: "https://placehold.co/600x450/111/fff?text=Urban+V2",
      desktop: "",
      mobile: "",
    },
    features: ["Mobile First", "Fast Checkout"],
    currentVersion: "2.0.0",
    versions: [],
    tags: ["Retail", "Dark Mode"],
    author: "You",
    installCount: 0,
    rating: 0,
    status: "published",
    submittedAt: "2025-12-20T10:00:00Z",
    downloads: 45,
    revenue: 450000,
  },
  {
    id: "tpl_neon_nights",
    submissionId: "sub_124",
    name: "Neon Nights",
    description: "Cyberpunk inspired service template.",
    category: "services",
    planLevel: "pro",
    isActive: false,
    isLocked: false,
    previewImages: {
      cover: "https://placehold.co/600x450/220022/00ff00?text=Neon",
      desktop: "",
      mobile: "",
    },
    features: [],
    currentVersion: "1.0.0",
    versions: [],
    tags: ["Cyberpunk"],
    author: "You",
    installCount: 0,
    rating: 0,
    status: "ai_review",
    submittedAt: "2025-12-24T08:30:00Z",
    downloads: 0,
    revenue: 0,
    aiReviewResult: {
      score: 75,
      status: "needs_fix",
      issues: [
        "Contrast ratio low on mobile footer",
        "Missing detailed readme",
      ],
    },
  },
];

export async function GET() {
  return NextResponse.json(DEMO_DESIGNER_TEMPLATES);
}
