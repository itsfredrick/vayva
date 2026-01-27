import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { prisma } from "@vayva/db";

function getDraftSettings(settings: any) {
  const s = settings || {};
  const draft = s.aiAgentProfileDraft || {};
  return {
    name: String(draft.name || ""),
    avatarUrl: String(draft.avatarUrl || ""),
    tone: String(draft.tone || "professional"),
    signature: String(draft.signature || ""),
  };
}

export const GET = withVayvaAPI(PERMISSIONS.SUPPORT_VIEW, async (_req, { storeId }) => {
  try {
    const [profile, store] = await Promise.all([
      prisma.merchantAiProfile.findUnique({ where: { storeId } }),
      prisma.store.findUnique({ where: { id: storeId }, select: { settings: true } }),
    ]);

    const settings: any = (store?.settings as any) || {};
    const draft = getDraftSettings(settings);

    return NextResponse.json({
      id: profile?.id || storeId,
      name: profile?.agentName || "",
      tone: profile?.tonePreset || "Friendly",
      signature: profile?.signoffTemplate || "",
      avatarUrl: "",
      config: draft,
    });
  } catch (error: any) {
    console.error("[AI_AGENT_PROFILE_GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});

export const PUT = withVayvaAPI(PERMISSIONS.SUPPORT_MANAGE, async (req, { storeId }) => {
  try {
    const body = await req.json().catch(() => ({}));
    const incoming = {
      name: String(body?.name || ""),
      avatarUrl: String(body?.avatarUrl || ""),
      tone: String(body?.tone || "professional"),
      signature: String(body?.signature || ""),
    };

    const store = await prisma.store.findUnique({ where: { id: storeId }, select: { settings: true } });
    const currentSettings: any = (store?.settings as any) || {};

    const updatedSettings = {
      ...currentSettings,
      aiAgentProfileDraft: incoming,
    };

    await prisma.store.update({
      where: { id: storeId },
      data: { settings: updatedSettings },
    });

    return NextResponse.json({ ok: true, config: incoming });
  } catch (error: any) {
    console.error("[AI_AGENT_PROFILE_PUT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
});
