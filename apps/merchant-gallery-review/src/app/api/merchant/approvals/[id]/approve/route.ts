import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/auth/permissions";
import { prisma } from "@vayva/db";
import { executeApproval } from "@/lib/approvals/execute";
import { EventBus } from "@/lib/events/eventBus";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Fetch request to check merchantId
  const request = await prisma.approval.findUnique({
    where: { id },
  });
  if (!request) return new NextResponse("Not Found", { status: 404 });
  if (request.merchantId !== (session!.user as any).storeId)
    return new NextResponse("Forbidden", { status: 403 });
  if (request.status !== "PENDING")
    return new NextResponse("Request not pending", { status: 400 });

  // Check DECIDE Permission
  const canDecide = await hasPermission(
    (session!.user as any).id,
    request.merchantId,
    PERMISSIONS.APPROVALS_DECIDE,
  );
  if (!canDecide)
    return new NextResponse("Forbidden: No Decide Permission", { status: 403 });

  // Check ACTION-SPECIFIC Permission
  let actionPerm: any = null;
  switch (request.actionType) {
    case "refund.issue":
      actionPerm = PERMISSIONS.REFUNDS_APPROVE;
      break;
    case "campaign.send":
      actionPerm = PERMISSIONS.CAMPAIGNS_APPROVE;
      break;
    case "policies.publish":
      actionPerm = PERMISSIONS.POLICIES_APPROVE;
      break;
    case "delivery.dispatch":
      actionPerm = PERMISSIONS.DELIVERY_APPROVE;
      break;
  }

  if (actionPerm) {
    const canApproveAction = await hasPermission(
      (session!.user as any).id,
      request.merchantId,
      actionPerm,
    );
    if (!canApproveAction)
      return new NextResponse("Forbidden: Missing Action Permission", {
        status: 403,
      });
  }

  // Approve
  const body = await req.json().catch(() => ({}));
  const reason = body?.decisionReason;

  const updated = await prisma.approval.update({
    where: { id },
    data: {
      status: "APPROVED",
      decidedByUserId: (session!.user as any).id,
      decidedByLabel: `${(session!.user as any).firstName} ${(session!.user as any).lastName}`,
      decidedAt: new Date(),
      decisionReason: reason,
    },
  });

  // Audit
  await EventBus.publish({
    merchantId: request.merchantId,
    type: "approvals.approved",
    payload: { approvalId: id },
    ctx: {
      actorId: (session!.user as any).id,
      actorType: "user" as any,
      actorLabel: `${(session!.user as any).firstName} ${(session!.user as any).lastName}`,
      correlationId: request.correlationId || `req_${id}`,
    },
  });

  // EXECUTE (Inline for V1)
  // In production, this might queue a job. Here we call execution engine.
  try {
    await executeApproval(
      id,
      (session!.user as any).id,
      request.correlationId || `req_${id}`,
    );
  } catch (err: any) {
    console.error("Execution Failed Immediately", err);
    // Status updated to failed inside executeApproval usually, or we catch here.
    // If executeApproval throws, it might have failed.
  }

  return NextResponse.json({ ok: true, status: "approved" });
}
