import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@vayva/db";
import { authOptions } from "@/lib/auth"; // Assuming authOptions is imported from here

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> },
) {
  const { type } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const policy = await prisma.merchantPolicy.update({
      where: {
        storeId_type: {
          storeId: (session!.user as any).storeId,
          type: type.toUpperCase().replace("-", "_") as any,
        },
      },
      data: {
        status: "PUBLISHED",
        publishedVersion: { increment: 1 },
        publishedAt: new Date(),
        lastUpdatedLabel: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      },
    });

    return NextResponse.json({ policy });
  } catch (error) {
    console.error("Error publishing policy:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
