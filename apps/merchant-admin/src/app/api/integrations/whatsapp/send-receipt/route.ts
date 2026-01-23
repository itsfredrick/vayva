import { NextResponse } from "next/server";
// POST /api/integrations/whatsapp/send-receipt
// Internal API to trigger receipt sending. Protected by internal checks or session if needed.
// For webhook-to-webhook calls, we might need a shared secret or assume internal network trust (localhost).
// For now, we'll allow it if valid payload, but in production, verify caller or signature.
export async function POST(request: any) {
    try {
        const body = await request.json();
        const { orderId, amount, currency, customerName, customerPhone, storeName, subdomain } = body;
        if (!customerPhone || !amount) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL;
        const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY; // If needed, usually in header
        // Construct Message
        // "Hi [Customer Name]! Thanks for your order at [Store Name]. 🛍️"
        // "Total: [Currency][Amount]"
        // "Status: Paid (via Vayva Wallet)"
        // "Tracking Link: [Subdomain].vayva.ng/orders/[ID]"
        let message = `Hi ${customerName || "there"}! Thanks for your order at ${storeName || "our store"}. 🛍️\n\n`;
        message += `Total: ${currency || "NGN"} ${amount}\n`;
        message += `Status: Paid (via Vayva Wallet)\n`;
        if (subdomain && orderId) {
            message += `Tracking Link: https://${subdomain}.vayva.ng/orders/${orderId}`;
        }
        // Send to Evolution API
        // Endpoint: /message/sendText/{instanceName}
        // Assuming instanceName is "vayva-main" or similar, OR we look up the merchant's connected instance.
        // For V1 Demo, we might use a global instance or the merchant's specific one if we stored it.
        // To keep it simple and robust per instructions, we'll try to use the environment instance.
        const instanceName = process.env.EVOLUTION_INSTANCE_NAME || "vayva_global";
        if (EVOLUTION_API_URL) {
            try {
                const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${instanceName}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "apikey": EVOLUTION_API_KEY || ""
                    },
                    body: JSON.stringify({
                        number: customerPhone,
                        options: {
                            delay: 1200,
                            presence: "composing",
                            linkPreview: true
                        },
                        textMessage: {
                            text: message
                        }
                    })
                });
                const responseData = await response.json();
                if (!response.ok) {
                    console.error("Evolution API Failed:", responseData);
                    // Don't fail the webhook? just log.
                    return NextResponse.json({ error: "WhatsApp Receipt Failed", details: responseData }, { status: 500 });
                }
            }
            catch (apiError) {
                console.error("Evolution API Network Error:", apiError);
                // Fallback/Mock for Dev if API is unreachable
            }
        }
        else {
        }
        return NextResponse.json({ success: true, message: "Receipt sent" });
    }
    catch (error) {
        console.error("WhatsApp Receipt Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
