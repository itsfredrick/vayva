import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "minimal",
      name: "Minimal",
      colors: ["#000000", "#FFFFFF", "#F3F4F6"],
      font: "Inter",
    },
    {
      id: "bold",
      name: "Bold",
      colors: ["#111827", "#F9FAFB", "#3B82F6"],
      font: "Oswald",
    },
    {
      id: "premium",
      name: "Premium",
      colors: ["#1C1917", "#FAFAF9", "#D97706"],
      font: "Playfair Display",
    },
  ]);
}
