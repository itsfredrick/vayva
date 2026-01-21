import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
export async function GET(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || "usr_buyer_demo_123";
        const { id } = await params;
        // Verify ownership: conversion -> contact -> externalId == userId
        const conversation = await prisma.conversation.findUnique({
            where: { id },
            include: {
                contact: true,
                store: {
                    select: { name: true, logoUrl: true }
                },
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });
        if (!conversation) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }
        if (conversation.contact.externalId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        return NextResponse.json({ conversation });
    }
    catch (error) {
        console.error("Get Message Error:", error);
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }
}
export async function POST(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || "usr_buyer_demo_123";
        const { id } = await params;
        const { text } = await req.json();
        if (!text)
            return NextResponse.json({ error: "Message empty" }, { status: 400 });
        const conversation = await prisma.conversation.findUnique({
            where: { id },
            include: { contact: true }
        });
        if (!conversation || conversation.contact.externalId !== userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        const newMessage = await prisma.message.create({
            data: {
                storeId: conversation.storeId,
                conversationId: conversation.id,
                direction: "INBOUND", // Buyer -> Seller
                type: "TEXT",
                textBody: text,
                status: "QUEUED",
                receivedAt: new Date()
            }
        });
        await prisma.conversation.update({
            where: { id: conversation.id },
            data: {
                lastMessageAt: new Date(),
                unreadCount: { increment: 1 },
                lastInboundAt: new Date()
            }
        });
        return NextResponse.json({ success: true, message: newMessage });
    }
    catch (error) {
        console.error("Send Message Error:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
