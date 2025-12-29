import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path as needed for your auth config

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get Store ID (assuming single store per merchant for MVP or derived from session)
        // Get Store ID via Memberships
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { memberships: true }
        });

        // Assuming closest store membership
        const storeId = user?.memberships[0]?.storeId;
        if (!storeId) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const body = await req.json();
        const { name, discount, startTime, endTime, targetType, targetId } = body;

        if (!name || !discount || !startTime || !endTime) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const flashSale = await prisma.flashSale.create({
            data: {
                storeId,
                name,
                discount: Number(discount),
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                targetType,
                targetId,
                isActive: true
            }
        });

        return NextResponse.json(flashSale);

    } catch (error) {
        console.error('Failed to create flash sale:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { memberships: true }
        });
        const storeId = user?.memberships[0]?.storeId;
        if (!storeId) return NextResponse.json({ error: 'Store not found' }, { status: 404 });

        const sales = await prisma.flashSale.findMany({
            where: { storeId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(sales);
    } catch (error) {
        console.error('Failed to fetch flash sales:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
