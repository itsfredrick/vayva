import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@vayva/db';
import { z } from 'zod';
import { hash } from 'bcryptjs';

const registerSchema = z.object({
    storeId: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string(),
    lastName: z.string(),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { storeId, email, password, firstName, lastName } = registerSchema.parse(body);

        // Check availability
        const existing = await prisma.customer.findUnique({
            where: { storeId_email: { storeId, email } }
        });

        if (existing) {
            return NextResponse.json({ error: 'Customer already exists' }, { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        // Create Customer Record
        const customer = await prisma.customer.create({
            data: {
                storeId,
                email,
                firstName,
                lastName,
                marketingOptIn: true,
                passwordHash: hashedPassword
            }
        });

        return NextResponse.json({
            success: true,
            customer: {
                id: customer.id,
                email: customer.email,
                name: `${customer.firstName} ${customer.lastName}`
            }
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
        }
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
