import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Allow Demo fallback if no session (for easy QA verification)
        const userId = (session?.user)?.id || "usr_buyer_demo_123";
        const userEmail = session?.user?.email || "buyer@demo.com";
        const userName = session?.user?.name || "Demo Buyer";

        const { listingId, message } = await req.json();

        if (!listingId || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Fetch Listing & Seller Info
        const listing = await prisma.marketplaceListing.findUnique({
            where: { id: listingId },
            include: {
                product: true
            }
        });

        if (!listing) {
            return NextResponse.json({ error: "Listing not found" }, { status: 404 });
        }

        const storeId = listing.product.storeId;

        // 2. Find or Create Contact for Buyer in Seller's Store
        // We use channel=MARKETPLACE and externalId=userId
        let contact = await prisma.contact.findFirst({
            where: {
                storeId,
                channel: "MARKETPLACE",
                externalId: userId
            }
        });

        if (!contact) {
            contact = await prisma.contact.create({
                data: {
                    storeId,
                    channel: "MARKETPLACE",
                    externalId: userId,
                    displayName: userName,
                    // If we had email/phone columns on Contact, we'd set them here
                }
            });
        }

        // 3. Find or Create Conversation
        let conversation = await prisma.conversation.findFirst({
            where: {
                storeId,
                contactId: contact.id
            }
        });

        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    storeId,
                    contactId: contact.id,
                    status: "OPEN",
                    priority: "normal",
                    // We can add tags or context here if needed
                }
            });
        }

        // 4. Create Message
        const contextPrefix = `[Inquiry about: ${listing.product.title}]\n`;
        const fullMessage = contextPrefix + message;

        const newMessage = await prisma.message.create({
            data: {
                storeId,
                conversationId: conversation.id,
                direction: "INBOUND", // Buyer -> Seller
                type: "TEXT",
                textBody: fullMessage,
                status: "QUEUED", // Or RECEIVED
                receivedAt: new Date()
            }
        });

        // 5. Update Conversation Metadata
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                lastMessageAt: new Date(),
                unreadCount: { increment: 1 },
                lastInboundAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            conversationId: conversation.id,
            messageId: newMessage.id
        });

    } catch (error) {
        console.error("Create Conversation Error:", error);
        return NextResponse.json({ error: "Failed to start conversation" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = (session?.user)?.id || "usr_buyer_demo_123";

        // Find all contacts for this user across all stores
        // Note: This is an inefficient query if user talks to 1000 stores, but fine for MVP
        // Contact (externalId=userId) -> Conversation

        const contacts = await prisma.contact.findMany({
            where: {
                channel: "MARKETPLACE",
                externalId: userId
            },
            include: {
                conversations: {
                    include: {
                        store: {
                            select: { name: true, logoUrl: true }
                        },
                        messages: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            }
        });

        // Flatten logic: A contact belongs to a store. A conversation belongs to a contact.
        // We want a list of Conversations.
        const conversations = contacts.flatMap((c: any) => c.conversations.map((conv: any) => ({
            id: conv.id,
            storeName: conv.store.name,
            storeLogo: conv.store.logoUrl,
            lastMessage: conv.messages[0]?.textBody || "No messages yet",
            lastMessageAt: conv.lastMessageAt,
            unreadCount: 0 // Buyer side unread count logic would need 'lastReadAt', skipping for now
        }))).sort((a: any, b: any) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

        return NextResponse.json({ conversations });

    } catch (error) {
        console.error("Get Conversations Error:", error);
        return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
    }
}
