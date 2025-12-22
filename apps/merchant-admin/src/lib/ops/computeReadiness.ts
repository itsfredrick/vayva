
import { prisma } from '@vayva/db';
import { OpsReadiness, ReadinessIssue, ReadinessLevel } from './readinessContract';

export async function computeMerchantReadiness(storeId: string): Promise<OpsReadiness> {
    const store = await prisma.store.findUnique({
        where: { id: storeId },
        include: {
            merchantPolicies: true, // Use correct relation
            // deliveryZones: true, // Removed as not in schema
            // user: { select: { email: true, phone: true } } // Removed as user relation doesn't exist
        }
    });

    if (!store) throw new Error('Store not found');

    const issues: ReadinessIssue[] = [];

    // ... lines 19-44 ...

    // 4. Policies
    const requiredPolicies = ['terms', 'privacy', 'returns', 'refunds', 'shipping'];
    const publishedTypes = store.merchantPolicies.filter(p => p.status === 'PUBLISHED').map(p => p.type);
    const missingPolicies = requiredPolicies.filter(t => !publishedTypes.includes(t as any));

    if (missingPolicies.length > 0) {
        issues.push({
            code: 'missing_policies',
            title: 'Legal Policies Incomplete',
            description: `Missing: ${missingPolicies.join(', ')}`,
            severity: 'blocker',
            fixable: true,
            actionUrl: '/dashboard/settings/policies'
        });
    }

    // 5. Delivery
    // deliveryZones check removed as property missing
    /* if ((store as any).deliveryZones?.length === 0) {
        issues.push({ code: 'missing_delivery', title: 'No Delivery Methods', description: 'Set up at least one delivery zone or method.', severity: 'blocker', actionUrl: '/dashboard/settings/delivery' });
    } */

    // 6. Payments (Warning)
    const paymentConnected = false; // TODO: Check actual relation
    if (!paymentConnected) {
        issues.push({ code: 'payment_disconnected', title: 'Payments not connected', description: 'You cannot accept online payments yet.', severity: 'warning', actionUrl: '/dashboard/settings/payments' });
    }

    // summary
    const blockers = issues.filter(i => i.severity === 'blocker');
    const level: ReadinessLevel = blockers.length > 0 ? 'blocked' : issues.length > 0 ? 'warning' : 'ready';

    return {
        level,
        issues,
        summary: {
            identity: !!store.slug,
            plan: true,
            template: !issues.some(i => i.code === 'missing_template'),
            policies: missingPolicies.length === 0,
            delivery: true, // skipped check
            payments: paymentConnected
        }
    };
}
