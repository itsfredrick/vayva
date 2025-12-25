import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { title, content, category } = body;

    if (!title || !content) return new NextResponse('Missing fields', { status: 400 });

    const reply = await prisma.quick_reply.create({
        data: {
            merchantId: (session!.user as any).storeId,
            title,
            content,
            category
        }
    });

    return NextResponse.json(reply);
}

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const count = await prisma.quick_reply.count({ where: { merchantId: (session!.user as any).storeId } });

    if (count === 0) {
        // Seed Defaults
        const defaults = [
            { title: "Address Confirmation", content: "Hi! Please confirm your delivery address and nearest landmark.", category: "shipping" },
            { title: "Order Confirmed", content: "Thanks! Your order is confirmed. We will dispatch shortly.", category: "orders" },
            { title: "Payment Proof", content: "Please share a screenshot or transaction reference number.", category: "payment" },
            { title: "Pickup Option", content: "We offer self-dispatch and pickup options depending on your location.", category: "shipping" },
            { title: "Delivery Fee", content: "Delivery fee depends on your area—please confirm your exact location.", category: "shipping" },
            { title: "Out for Delivery", content: "Your order is out for delivery. The rider will call you shortly.", category: "shipping" },
            { title: "Unreachable", content: "We couldn't reach you on phone. Please confirm if you are available for delivery today.", category: "shipping" },
            { title: "Returns Policy", content: "Returns are accepted within 3 days for eligible items. See our policy link.", category: "returns" },
            { title: "Refund Process", content: "Refunds are processed after approval (24-48h).", category: "refunds" },
            { title: "Payment Method", content: "Would you like Pay on Delivery (if available in your area) or bank transfer?", category: "payment" }
        ];

        await prisma.quick_reply.createMany({
            data: defaults.map(d => ({
                merchantId: (session!.user as any).storeId,
                title: d.title,
                content: d.content,
                category: d.category
            }))
        });
    }

    const items = await prisma.quick_reply.findMany({
        where: { merchantId: (session!.user as any).storeId, isActive: true },
        orderBy: { title: 'asc' }
    });

    return NextResponse.json({ items });
}
