import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";

export async function GET(req: Request) {
  try {
    // Filter support (status, dates, etc.)
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const kycRecords = await prisma.kycRecord.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        store: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { submittedAt: "desc" },
      take: 100, // Limit for performance
    });

    const formattedRecords = kycRecords.map((record) => ({
      id: record.id,
      storeId: record.storeId,
      businessName: record.store.name,
      verificationType: "NIN", // Should be dynamic based on record fields
      status: record.status,
      dateSubmitted: record.submittedAt,
      reviewer: record.reviewedBy || "System",
      encryptedData: !!record.fullNinEncrypted, // Boolean flag
    }));

    return NextResponse.json({ records: formattedRecords });
  } catch (error) {
    console.error("Audit KYC Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch KYC records" },
      { status: 500 },
    );
  }
}
