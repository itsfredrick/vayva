import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@vayva/db';
import { TemplateService } from '@/lib/templates/templateService';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!(session?.user as any)?.id) return new NextResponse('Unauthorized', { status: 401 });

    // Infer Store ID from header/cookie (Middleware usually sets this)
    // For V1 MVP, pass in body or look at cookie
    const cookieStore = await cookies();
    const storeId = cookieStore.get('x-active-store-id')?.value;
    if (!storeId) return new NextResponse('No active store session', { status: 400 });

    const { templateId } = await req.json();

    try {
        // 1. Check Gating (Premium Templates)
        const template = await prisma.templateManifest.findUnique({ where: { id: templateId } });
        if (template && template.tags.includes('premium')) {
            const sub = await prisma.merchantSubscription.findUnique({ where: { storeId } });
            const entitlement = {
                planSlug: (sub?.planSlug || 'growth') as 'growth' | 'pro',
                status: (sub?.status || 'trial') as any
            };

            // If Growth, block premium
            // We can use a helper or manual check here since logic is simple
            if (entitlement.planSlug === 'growth') {
                return NextResponse.json({
                    code: 'PLAN_REQUIRED',
                    message: 'This template is only available on the Pro plan.',
                    requiredPlan: 'pro',
                    upgradeUrl: '/dashboard/billing?upgrade=pro'
                }, { status: 403 });
            }
        }

        await TemplateService.applyTemplate(storeId, templateId, (session!.user as any).id);
        return NextResponse.json({ success: true });
    } catch (e: any) {
        return new NextResponse(e.message, { status: 500 });
    }
}
