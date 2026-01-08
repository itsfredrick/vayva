import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logAuditEvent, AuditEventType } from "@/lib/audit";

/**
 * Real Audit Export Implementation
 * Creates a DataExportRequest record for background processing.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.storeId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { type, filters, format } = body;
    const storeId = session.user.storeId;
    const userId = session.user.id;

    if (!type) {
      return NextResponse.json({ error: "Export type is required" }, { status: 400 });
    }

    // Map business type to technical scopes if needed
    // In our schema scopes is a Json array
    const scopes = [type.toUpperCase()];

    const exportRequest = await prisma.dataExportRequest.create({
      data: {
        storeId,
        requestedBy: userId,
        scopes: scopes as any,
        status: "PENDING",
        format: format || "CSV",
      },
    });

    // Audit Log
    await logAuditEvent(storeId, userId, AuditEventType.EXPORT_CREATED, {
      requestId: exportRequest.id,
      type,
      filters,
    });

    return NextResponse.json({
      success: true,
      jobId: exportRequest.id,
      message: `Export for ${type} has been queued. You will be notified when it is ready for download.`,
    });
  } catch (error: any) {
    console.error("Audit Export Error:", error);
    return NextResponse.json(
      { error: "Failed to initiate export" },
      { status: 500 },
    );
  }
}
