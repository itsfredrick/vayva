import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";
import { Groq } from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY_RESCUE
});

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;

    const ticket = await prisma.supportTicket.findUnique({
        where: { id },
        include: {
            store: {
                select: { id: true, name: true, slug: true, logoUrl: true }
            },
            ticketMessages: {
                orderBy: { createdAt: "asc" }
            }
        }
    });

    if (!ticket) return new NextResponse("Not Found", { status: 404 });

    // Generate AI Summary if missing
    let summary = ticket.summary;
    if (!summary && ticket.description) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a support supervisor. Summarize the following merchant support ticket in exactly ONE concise sentence." },
                    { role: "user", content: `Subject: ${ticket.subject}\n\nDescription: ${ticket.description}` }
                ],
                model: "llama3-70b-8192",
                temperature: 0.1,
                max_tokens: 100
            });

            summary = completion.choices[0]?.message?.content || null;
            if (summary) {
                await prisma.supportTicket.update({
                    where: { id },
                    data: { summary }
                });
            }
        } catch (e) {
            console.error("Groq Summary Error:", e);
        }
    }

    return NextResponse.json({
        data: {
            ...ticket,
            aiSummary: summary || "Summary pending..."
        }
    });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { user } = await OpsAuthService.requireSession();
    if (!["OPS_OWNER", "OPS_ADMIN", "OPS_SUPPORT"].includes(user.role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const { id } = await params;

    const body = await request.json();
    const { status, priority, assignedToUserId } = body;

    const oldTicket = await prisma.supportTicket.findUnique({ where: { id } });

    const updated = await prisma.supportTicket.update({
        where: { id },
        data: {
            status,
            priority,
            assignedToUserId,
            updatedAt: new Date()
        }
    });

    // Send Feedback Email if ticket just closed
    if (status === 'closed' && oldTicket?.status !== 'closed') {
        try {
            const store = await prisma.store.findUnique({
                where: { id: updated.storeId },
                include: {
                    memberships: {
                        where: { role: "OWNER" },
                        include: { User: true }
                    }
                }
            });

            const ownerEmail = (store?.memberships[0] as any)?.User?.email;
            const merchantName = (store?.memberships[0] as any)?.User?.firstName || "there";
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

            if (ownerEmail) {
                const { Resend } = await import("resend");
                const resend = new Resend(process.env.RESEND_API_KEY);

                await resend.emails.send({
                    from: "Vayva Support <support@vayva.ng>",
                    to: ownerEmail,
                    subject: `How was your support experience? (Ticket #${updated.id.slice(0, 8)})`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                            <h2 style="color: #111;">Hi ${merchantName},</h2>
                            <p style="color: #444; line-height: 1.6;">
                                We’ve just closed your ticket regarding <strong>${updated.subject}</strong>. 
                                We hope everything is back on track for your store!
                            </p>
                            <p style="color: #444; font-weight: bold; margin-top: 24px;">How did we do?</p>
                            <div style="margin: 20px 0; display: flex; gap: 10px;">
                                <a href="${appUrl}/api/support/feedback?ticketId=${updated.id}&rating=GREAT" style="text-decoration: none; padding: 12px 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; color: #166534; font-size: 14px;">😊 Great</a>
                                <a href="${appUrl}/api/support/feedback?ticketId=${updated.id}&rating=OKAY" style="text-decoration: none; padding: 12px 20px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; color: #92400e; font-size: 14px;">😐 Okay</a>
                                <a href="${appUrl}/api/support/feedback?ticketId=${updated.id}&rating=BAD" style="text-decoration: none; padding: 12px 20px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; color: #991b1b; font-size: 14px;">😞 Could be better</a>
                            </div>
                            <p style="font-size: 12px; color: #888; margin-top: 30px;">
                                <em>(Clicking an emoji will instantly record your feedback)</em><br/>
                                If you have more thoughts to share, just reply to this email.
                            </p>
                            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
                            <p style="font-weight: bold; color: #6366f1;">Thanks for building with Vayva!</p>
                        </div>
                    `
                });
            }
        } catch (emailError) {
            console.error("Failed to send feedback email:", emailError);
        }
    }

    // Log the interaction
    await OpsAuthService.logEvent(user.id, "SUPPORT_TICKET_UPDATE", {
        ticketId: id,
        newStatus: status,
        newPriority: priority
    });

    return NextResponse.json({ success: true, data: updated });
}
