import { NextRequest, NextResponse } from 'next/server';
import { checkAdminAccess } from '@/lib/admin/auth';
import { prisma } from '@vayva/db';

export async function GET(req: NextRequest) {
    try {
        await checkAdminAccess('admin.partners.view');

        const partners = await prisma.partner.findMany({
            include: {
                _count: {
                    select: { referralAttributions: true, partnerPayoutLedgers: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ partners });
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await checkAdminAccess('admin.partners.manage');
        const body = await req.json();

        const partner = await prisma.partner.create({
            data: {
                name: body.name,
                type: body.type,
                status: 'active'
            }
        });

        return NextResponse.json({ partner });
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
