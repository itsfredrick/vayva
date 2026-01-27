import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const POST = withVayvaAPI(PERMISSIONS.SUPPORT_VIEW, async (req) => {
  try {
    const body = await req.json().catch(() => ({}));
    const text = String(body?.text || "");

    return NextResponse.json({
      ok: true,
      reply: text ? `Test reply: ${text}` : "Test reply",
    });
  } catch (error: any) {
    console.error("[AI_AGENT_TEST_MESSAGE]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
