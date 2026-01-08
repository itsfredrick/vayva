import { NextResponse } from "next/server";

export async function GET() {
  // Test Session
  return NextResponse.json({
    user: {
      id: "u1",
      first_name: "Fred",
      last_name: "Adams",
      initials: "FA",
      role: "owner",
    },
    business: {
      id: "biz1",
      type: "retail", // Can be switched to 'food' or 'service'
      plan: "growth",
    },
  });
}
