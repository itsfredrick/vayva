
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { can } from './permissions';
import { NextResponse } from 'next/server';

export async function checkPermission(action: string) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error('Unauthorized');
    }

    const userRole = (session.user as any).role;
    if (!can(userRole, action)) {
        throw new Error('Forbidden: Insufficient permissions');
    }

    return session;
}

export function withRBAC(action: string, handler: Function) {
    return async (...args: any[]) => {
        try {
            const session = await checkPermission(action);
            return await handler(session, ...args);
        } catch (error: any) {
            if (error.message.includes('Unauthorized')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
            }
            if (error.message.includes('Forbidden')) {
                return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
            }
            throw error;
        }
    };
}
