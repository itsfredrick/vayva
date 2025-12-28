import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

// Helper to bypass strict types if models are missing in generated client
const db = prisma as any;

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const storeId = (session.user as any).storeId;

        // Use safe access to db
        const order = await db.order.findUnique({
            where: { id, storeId },
            include: {
                items: true,
                Customer: true,
                Shipment: true,
                timeline: { orderBy: { createdAt: 'desc' } }
            }
        });

        if (!order) return NextResponse.json({ error: 'Order Not Found' }, { status: 404 });

        // Map to Service Interface (Order interface in services/orders.ts)
        const mapped = {
            id: order.id,
            refCode: order.refCode || order.orderNumber,
            status: order.status,
            paymentStatus: order.paymentStatus,
            fulfillmentStatus: order.fulfillmentStatus,
            createdAt: order.createdAt,

            customer: order.Customer ? {
                id: order.Customer.id,
                name: order.Customer.name || 'Guest',
                email: order.Customer.email || '',
                phone: order.Customer.phone || ''
            } : { id: 'guest', name: 'Guest', email: '', phone: '' },

            items: Array.isArray(order.items) ? order.items.map((i: any) => ({
                id: i.id,
                title: i.productName || 'Product',
                quantity: i.quantity,
                price: Number(i.price),
                image: i.imageUrl
            })) : [],

            subtotal: Number(order.subtotal || 0),
            shippingTotal: Number(order.shippingTotal || 0),
            total: Number(order.total || 0),
            channel: order.channel || 'online',
            paymentMethod: order.paymentMethod,
            transactionReference: order.transactionReference,

            timeline: Array.isArray(order.timeline) ? order.timeline.map((t: any) => ({
                id: t.id,
                type: 'event',
                text: t.title,
                createdAt: t.createdAt
            })) : [],

            // Critical for Delivery Status UI
            deliveryTask: order.Shipment ? {
                id: order.Shipment.id,
                status: order.Shipment.status,
                trackingUrl: order.Shipment.trackingUrl,
                riderName: order.Shipment.provider // Using provider as rider name proxy
            } : undefined,

            shippingAddress: {
                street: order.Shipment?.addressLine1 || order.shippingAddressLine1 || '',
                city: order.Shipment?.addressCity || order.shippingCity || '',
                state: order.shippingState || '',
                country: 'Nigeria'
            }
        };

        return NextResponse.json(mapped);
    } catch (e: any) {
        console.error('Order Detail API Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
