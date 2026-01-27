import { NextResponse } from "next/server";
import { SalesAgent } from "@/lib/ai/sales-agent";
import { WhatsappManager } from "@/services/whatsapp";
import { NotificationService } from "@/services/notifications";
// Evolution API Webhook Handler
// Handles incoming messages and routes them to the AI Sales Agent
export async function POST(req: any) {
    try {
        const body = await req.json();
        // Log basic heartbeat (remove in prod high volume)
        // Security: Verify Webhook Secret (Evolution API sends this)
        const secret = process.env.WHATSAPP_WEBHOOK_SECRET;
        const authHeader = req.headers.get("apikey") || req.headers.get("authorization");
        // Remove 'Bearer ' if present for comparison
        const token = authHeader?.replace("Bearer ", "") || "";
        if (!secret || token !== secret) {
            console.warn("[Webhook] Unauthorized attempt:", { ip: req.headers.get("x-forwarded-for") });
            return NextResponse.json({ status: "forbidden" }, { status: 403 });
        }
        if (body.event !== "messages.upsert") {
            return NextResponse.json({ status: "ignored_event" });
        }
        const data = body.data;
        const instance = body.instance; // "merchant_{storeId}"
        // 1. Basic Validation
        if (!instance || !data || !data.key) {
            return NextResponse.json({ status: "invalid_payload" });
        }
        const sender = data.key.remoteJid; // "23480...@s.whatsapp.net"
        const fromMe = data.key.fromMe;
        // 2. Ignore Self-Messages (Prevent infinite loops)
        if (fromMe) {
            return NextResponse.json({ status: "ignored_self" });
        }
        // 3. Extract Message Content
        // Evolution API normalizes text in `data.message.conversation` or `extendedTextMessage.text`
        const imageMessage = data.message?.imageMessage;
        const imageCaption = imageMessage?.caption || "";
        const imageUrlCandidate = imageMessage?.url || imageMessage?.mediaUrl || "";
        let imageUrl = typeof imageUrlCandidate === "string" && /^https?:\/\//i.test(imageUrlCandidate)
            ? imageUrlCandidate
            : "";
        if (imageMessage && !imageUrl) {
            try {
                imageUrl = await WhatsappManager.getMediaDataUrlFromMessage(instance, data?.key, imageMessage?.mimetype);
            }
            catch (_e: any) {
                imageUrl = "";
            }
        }
        const messageContent = data.message?.conversation ||
            data.message?.extendedTextMessage?.text ||
            imageCaption ||
            (imageMessage ? "[IMAGE_RECEIVED]" : "");
        if (!messageContent) {
            return NextResponse.json({ status: "no_text_content" });
        }

        const enrichedContent = imageMessage
            ? `${messageContent}\n\nIMAGE_META:\n- imageUrl: ${imageUrl || "N/A"}\n- caption: ${imageCaption || ""}\n- mimetype: ${imageMessage?.mimetype || ""}\n- messageId: ${data?.key?.id || ""}\n- remoteJid: ${data?.key?.remoteJid || ""}`
            : messageContent;
        // 4. Identify Store
        // Format: "merchant_{storeId}" -> extract storeId
        const storeId = instance.replace("merchant_", "");
        if (!storeId) {
            console.error("[Webhook] Could not extract storeId from instance:", instance);
            return NextResponse.json({ status: "error_instance_format" });
        }
        // 5. Send to AI Brain (SalesAgent)
        // We pass the storeId so it calls the right tools (Inventory, Delivery, etc)
        const aiResponse = await SalesAgent.handleMessage(storeId, [{ role: "user", content: enrichedContent }], {
            userId: sender, // Use phone as user ID for session/context
            conversationId: sender // Simple session key
        });
        // 6. Check for Handoff Trigger
        if (aiResponse.message.includes("[HANDOFF_REQUIRED]")) {
            console.warn(`[Webhook] Handoff Triggered for ${sender} @ ${storeId}`);
            // A. Notify Customer
            await WhatsappManager.sendMessage(instance, sender, "I'm connecting you to my supervisor. They will reply shortly.");
            // B. Notify Merchant Logic (Handoff Alert)
            // In real app: Update conversation state in DB to status='HANDOFF', unreadCount++, etc.
            // Notifications Logic
            await NotificationService.sendMilestone("lead_hot", {
                name: "System",
                phone: "MERCHANT_PHONE",
                storeName: "Store",
                storeId: storeId
            }); // Using lead_hot as generic alert for now, ideally new event "handoff_alert"
            return NextResponse.json({ status: "handed_off" });
        }
        // 7. Send Reply to Customer
        if (aiResponse.message) {
            await WhatsappManager.sendMessage(instance, sender, aiResponse.message);
        }
        return NextResponse.json({ status: "processed", reply: !!aiResponse.message });
    }
    catch (error: any) {
        console.error("[Webhook] Critical Error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
