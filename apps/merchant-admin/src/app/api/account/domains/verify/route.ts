import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/session";
import { prisma } from "@vayva/db";
import { verifyDomainDns } from "@/lib/jobs/domain-verification";

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const storeId = session.user.storeId;
    const { domainMappingId } = await req.json();

    if (!domainMappingId) {
      return NextResponse.json(
        { error: "Domain mapping ID required" },
        { status: 400 },
      );
    }

    const mapping = await prisma.domainMapping.findUnique({
      where: { id: domainMappingId },
    });

    if (!mapping || mapping.storeId !== storeId) {
      return NextResponse.json(
        { error: "Domain not found or unauthorized" },
        { status: 404 },
      );
    }

    // Set to pending before starting job
    await prisma.domainMapping.update({
      where: { id: domainMappingId },
      data: { status: "pending" },
    });

    // Trigger verification "asynchronously"
    // In a real production env, this would be a BullMQ queue.add() call.
    // For this finalization, we trigger it immediately and detach the promise.
    verifyDomainDns(domainMappingId).catch((err) => {
      console.error(
        `[VerifyRoute] Detached job failure for ${domainMappingId}:`,
        err,
      );
    });

    return NextResponse.json({
      message: "Verification started",
      status: "pending",
    });
  } catch (error: any) {
    console.error("Domain verify trigger error:", error);
    return NextResponse.json(
      { error: "Failed to trigger verification" },
      { status: 500 },
    );
  }
}
