import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const store = await prisma.store.findUnique({
            where: { slug },
            select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
                settings: true,
                category: true,
                plan: true,
                isLive: true,
                waAgentSettings: {
                    select: {
                        enabled: true,
                        businessHours: true
                    }
                },
                deliverySettings: {
                    select: {
                        isEnabled: true,
                        provider: true,
                        pickupAddressLine1: true,
                        pickupCity: true,
                        pickupState: true,
                        pickupPhone: true
                    }
                }
            },
        });

        if (!store) {
            return NextResponse.json(
                { error: 'Store not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(store);
    } catch (error) {
        console.error('Error fetching store:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
