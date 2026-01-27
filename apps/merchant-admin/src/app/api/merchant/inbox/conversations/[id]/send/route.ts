import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@vayva/db";

export const POST = withVayvaAPI(
  PERMISSIONS.SUPPORT_MANAGE,
  async (req, { storeId, params }) => {
    try {
      const conversationId = params?.id;
      if (!conversationId) {
        return NextResponse.json({ error: "Missing conversation id" }, { status: 400 });
      }

      const body = await req.json().catch(() => ({}));
      const text = String(body?.text || "").trim();
      if (!text) {
        return NextResponse.json({ error: "Message text is required" }, { status: 400 });
      }

      const conversation = await prisma.conversation.findFirst({
        where: { id: conversationId, storeId },
        select: { id: true },
      });
      if (!conversation) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }

      const now = new Date();

      const message = await prisma.message.create({
        data: {
          storeId,
          conversationId,
          direction: "OUTBOUND" as any,
          type: "TEXT" as any,
          status: "QUEUED" as any,
          textBody: text,
          sentAt: now,
        },
      });

      await prisma.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageAt: now,
          lastOutboundAt: now,
          lastRepliedAt: now,
        },
      });

      return NextResponse.json({ ok: true, message });
    } catch (error: any) {
      console.error("[INBOX_SEND]", error);
      return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
    }
  },
);
