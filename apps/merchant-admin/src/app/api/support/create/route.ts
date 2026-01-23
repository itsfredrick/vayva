import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Assumed path based on convention
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
export async function POST(request: any) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Assuming user session has storeId. If not, we might need to fetch it or expect it in body.
    // Based on previous contexts, session.user usually has storeId or similar identifier.
    // Let's assume storeId is available or we find the default store for the user.
    // To be safe, let's verify if 'storeId' is in the session or body.
    let storeId = session.user.storeId;
    try {
        const body = await request.json();
        const { subject, category, description, priority } = body;
        // If storeId is not in session, maybe it was passed in header or body?
        // Fallback: fetch the first store for this user?
        if (!storeId) {
            // Quick look up for user's store
            const userWithStore = await prisma.user.findUnique({
                where: { id: session.user.id },
                include: {
                    memberships: {
                        take: 1,
                        include: { store: true }
                    }
                }
            });
            storeId = userWithStore?.memberships[0]?.store?.id;
        }
        if (!storeId) {
            return NextResponse.json({ error: "No store found for user" }, { status: 400 });
        }
        if (!subject || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        // AI Auto-Classification using Groq
        let finalPriority = (priority || "medium").toLowerCase();
        try {
            const groq = new (await import("@/lib/ai/groq-client")).GroqClient("SUPPORT");
            const classification = await groq.chatCompletion([
                { role: "system", content: "You are a support classifier. Classify the priority of the following support ticket as: low, medium, or high. urgent issues like site down or payment failure must be high. low is for general questions or feedback. Respond with ONLY the word: low, medium, or high." },
                { role: "user", content: `Subject: ${subject}\nDescription: ${description}` }
            ], { temperature: 0.1, maxTokens: 10 });
            const aiPriority = classification?.choices[0]?.message?.content?.toLowerCase().trim();
            if (aiPriority && ["low", "medium", "high"].includes(aiPriority)) {
                finalPriority = aiPriority;
            }
        }
        catch (e) {
            console.error("AI Classification Error:", e);
            // Fallback to simple logic if Groq fails
            const lowerDesc = description.toLowerCase();
            if (lowerDesc.includes("urgent") || lowerDesc.includes("payment") || lowerDesc.includes("down") || lowerDesc.includes("404")) {
                finalPriority = "high";
            }
        }
        const ticket = await prisma.supportTicket.create({
            data: {
                storeId,
                subject,
                category: category || "OTHER",
                description,
                status: "OPEN",
                priority: finalPriority,
                metadata: {
                    source: "MERCHANT_DASHBOARD"
                }
            }
        });
        // Send Email Notification
        if (session.user.email && process.env.RESEND_API_KEY) {
            try {
                const resend = new Resend(process.env.RESEND_API_KEY);
                await resend.emails.send({
                    from: process.env.RESEND_FROM_EMAIL || "support@vayva.ng",
                    to: session.user.email,
                    subject: `Ticket Received: ${subject} (#${ticket.id.slice(0, 8)})`,
                    html: `<p>Hi there,</p>
                           <p>We received your support request. Our team is looking into it.</p>
                           <p><strong>Ticket ID:</strong> ${ticket.id}</p>
                           <p><strong>Priority:</strong> ${finalPriority.toUpperCase()}</p>
                           <p>Best,<br/>Vayva Support Team</p>`
                });
            }
            catch (emailError) {
                console.error("Failed to send support email:", emailError);
            }
        }
        return NextResponse.json({ success: true, ticket });
    }
    catch (error) {
        console.error("Support Ticket Create Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
