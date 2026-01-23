import { NextResponse } from "next/server";
import { withVayvaAPI } from "@/lib/api-handler";
import { PERMISSIONS } from "@/lib/team/permissions";
import { WhatsAppAgentService } from "@/services/whatsapp-agent.service";
import { sanitizeHTML } from "@/lib/sanitization";
import { z } from "zod";
const UpdateSchema = z.object({
    type: z.enum(["SETTINGS", "CHANNEL"]),
    data: z.record(z.any()),
});
/**
 * Recursively sanitize string values in an object
 */
function sanitizePayload(obj: any) {
    if (typeof obj === "string")
        return sanitizeHTML(obj);
    if (Array.isArray(obj))
        return obj.map(sanitizePayload);
    if (obj !== null && typeof obj === "object") {
        const sanitized = {};
        for (const key of Object.keys(obj)) {
            sanitized[key] = sanitizePayload(obj[key]);
        }
        return sanitized;
    }
    return obj;
}
export const GET = withVayvaAPI(PERMISSIONS.SETTINGS_VIEW, async (req, { storeId }) => {
    try {
        const [settings, channel, templates] = await Promise.all([
            WhatsAppAgentService.getSettings(storeId),
            WhatsAppAgentService.getChannel(storeId),
            WhatsAppAgentService.listTemplates(storeId),
        ]);
        return NextResponse.json({
            settings,
            channel,
            templates,
        });
    }
    catch (error) {
        console.error("WhatsApp Settings GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
});
export const PATCH = withVayvaAPI(PERMISSIONS.INTEGRATIONS_MANAGE, async (req, { storeId, correlationId }) => {
    try {
        const body = await req.json();
        const validation = UpdateSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ error: "Invalid input", correlationId }, { status: 400 });
        }
        const { type, data: rawData } = validation.data;
        // Sanitize input to block XSS
        const data = sanitizePayload(rawData);
        let result;
        if (type === "SETTINGS") {
            result = await WhatsAppAgentService.updateSettings(storeId, data);
        }
        else {
            result = await WhatsAppAgentService.updateChannel(storeId, data);
        }
        return NextResponse.json(result);
    }
    catch (error) {
        console.error("WhatsApp Settings PATCH Error:", error);
        return NextResponse.json({ error: "Failed to update settings", correlationId }, { status: 500 });
    }
});
