import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET() {
  try {
    // @ts-ignore
    const incidents = await prisma.incident.findMany({
      where: {
        status: {
          not: "resolved",
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ incidents });
  } catch (error) {
    console.error("Fetch Incidents Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch incidents" },
      { status: 500 },
    );
  }
}
