import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { withVayvaAPI, HandlerContext } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";

export const GET = withVayvaAPI(
    PERMISSIONS.SUPPORT_VIEW,
    async (req: NextRequest, { storeId }: HandlerContext) => {
        try {
            const store = await prisma.store.findUnique({
                where: { id: storeId },
                select: { settings: true }
            });

            const settings = (store?.settings as unknown) || {};
            const aiAgent = settings.aiAgent || {
                enabled: false,
                tone: "PROFESSIONAL",
                knowledgeBase: "",
                automationScope: "NONE",
            };

            return NextResponse.json(aiAgent);
        } catch (error) {
            console.error("[AI_AGENT_SETTINGS_GET]", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
);

export const PATCH = withVayvaAPI(
    PERMISSIONS.SUPPORT_MANAGE,
    async (req: NextRequest, { storeId }: HandlerContext) => {
        try {
            const body = await req.json();
            const { enabled, tone, knowledgeBase, automationScope } = body;

            const store = await prisma.store.findUnique({
                where: { id: storeId },
                select: { settings: true }
            });

            const currentSettings = (store?.settings as unknown) || {};
            const updatedAiAgent = {
                ...currentSettings.aiAgent,
                enabled: enabled ?? currentSettings.aiAgent?.enabled,
                tone: tone ?? currentSettings.aiAgent?.tone,
                knowledgeBase: knowledgeBase ?? currentSettings.aiAgent?.knowledgeBase,
                automationScope: automationScope ?? currentSettings.aiAgent?.automationScope,
                lastUpdated: new Date().toISOString()
            };

            const updatedStore = await prisma.store.update({
                where: { id: storeId },
                data: {
                    settings: {
                        ...currentSettings,
                        aiAgent: updatedAiAgent
                    }
                }
            });

            // Trigger sync with WhatsApp Service
            try {
                const whatsappServiceUrl = process.env.WHATSAPP_SERVICE_URL || "http://localhost:3005";
                await fetch(`${whatsappServiceUrl}/internal/agent/sync`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "x-internal-secret": process.env.INTERNAL_API_SECRET || "dev-secret" },
                    body: JSON.stringify({ storeId })
                });
            } catch (syncError) {
                console.warn("[AI_AGENT_SYNC_TRIGGER_FAILED]", syncError);
            }

            return NextResponse.json(updatedAiAgent);
        } catch (error) {
            console.error("[AI_AGENT_SETTINGS_PATCH]", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }
);
