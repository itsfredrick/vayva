import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SupportService } from '@/lib/support';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 });

    try {
        const ticket = await SupportService.getTicketDetails(params.id, (session!.user as any).storeId);
        return NextResponse.json(ticket);
    } catch (e) {
        return new NextResponse('Not Found', { status: 404 });
    }
}
