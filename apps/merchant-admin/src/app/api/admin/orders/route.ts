import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const storeId = (session.user as any).storeId;
        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status'); // Optional status filter

        const skip = (page - 1) * limit;

        const where: any = {
            storeId,
            ...(status && status !== 'ALL' ? { status } : {}),
            // Filter out DRAFT orders if we only want real orders, 
            // usually DRAFT is used during checkout before payment.
            // But we might want to see them if debugging. 
            // Let's hide DRAFT by default unless requested.
            NOT: { status: 'DRAFT' }
        };

        if (search) {
            where.OR = [
                { refCode: { contains: search, mode: 'insensitive' } },
                { customerEmail: { contains: search, mode: 'insensitive' } },
                { orderNumber: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    OrderItem: {
                        take: 3 // Just preview items
                    },
                    Customer: {
                        select: { firstName: true, lastName: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip,
            }),
            prisma.order.count({ where })
        ]);

        return NextResponse.json({
            orders,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                page,
                limit
            }
        });

    } catch (error) {
        console.error('Orders API Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
