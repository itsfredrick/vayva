
import { NextResponse } from 'next/server';
import { PayoutAccount } from '@vayva/shared';

let ACCOUNTS: PayoutAccount[] = [
    {
        id: 'pa_1',
        merchantId: 'mer_1',
        bankName: 'Guaranty Trust Bank',
        bankCode: '058',
        accountNumber: '******1234',
        accountName: 'FRED ADAMS STORE',
        isDefault: true
    }
];

import { checkPermission } from '@/lib/team/rbac';
import { PERMISSIONS } from '@/lib/team/permissions';

export async function GET() {
    // ... Existing logic ...
}

export async function POST(request: Request) {
    try {
        await checkPermission(PERMISSIONS.PAYOUTS_MANAGE);
        const body = await request.json();
        // Simulate resolving and saving
        const newAccount: PayoutAccount = {
            id: `pa_${Date.now()}`,
            merchantId: 'mer_1',
            bankName: body.bankName,
            bankCode: body.bankCode,
            accountNumber: `******${body.accountNumber.slice(-4)}`,
            accountName: body.accountName,
            isDefault: ACCOUNTS.length === 0 // First one is default
        };
        ACCOUNTS.push(newAccount);
        return NextResponse.json(newAccount);
    } catch (error: any) {
        console.error('Payout account creation error:', error);
        return NextResponse.json({ error: error.message || 'Failed to create payout account' }, {
            status: error.message?.includes('Forbidden') ? 403 : (error.message?.includes('Unauthorized') ? 401 : 500)
        });
    }
}
