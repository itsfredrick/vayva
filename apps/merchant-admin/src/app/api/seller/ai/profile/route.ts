import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth/session';
import { prisma } from '@vayva/db';
import { z } from 'zod';

export async function GET(request: NextRequest) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;

        if (!storeId) return NextResponse.json({ error: 'No store found' }, { status: 400 });

        const profile = await prisma.merchantAiProfile.findUnique({
            where: { storeId }
        });

        return NextResponse.json({ success: true, data: profile });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch AI profile' }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await requireAuth();
        const storeId = session.user.storeId;
        const body = await request.json();

        if (!storeId) return NextResponse.json({ error: 'No store found' }, { status: 400 });

        // Input Validation (Zod)
        const profileSchema = z.object({
            agentName: z.string().max(50).optional(),
            tonePreset: z.enum(['Friendly', 'Professional', 'Luxury', 'Playful', 'Minimal']).optional(),
            greetingTemplate: z.string().max(500).optional(),
            signoffTemplate: z.string().max(200).optional(),
            persuasionLevel: z.number().min(0).max(3).optional(),
            brevityMode: z.enum(['Short', 'Medium']).optional(),
            oneQuestionRule: z.boolean().optional(),
        });

        const validationResult = profileSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json({
                error: 'Invalid input',
                details: validationResult.error.flatten()
            }, { status: 400 });
        }

        const data = validationResult.data;

        const profile = await prisma.merchantAiProfile.upsert({
            where: { storeId },
            update: {
                ...data,
                updatedAt: new Date()
            },
            create: {
                ...data, // valid fields only
                storeId,
            }
        });

        return NextResponse.json({ success: true, data: profile });
    } catch (error) {
        console.error('Update profile error:', error);
        return NextResponse.json({ error: 'Failed to update AI profile' }, { status: 500 });
    }
}
