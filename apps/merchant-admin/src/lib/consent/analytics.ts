
import { prisma , ComplianceEvent, ConsentChannel, ConsentSource } from '@vayva/db';

export enum MessageIntent {
    TRANSACTIONAL = 'TRANSACTIONAL',
    MARKETING = 'MARKETING'
}

export async function getConsentStats(merchantId: string) {
    const [
        totalCustomers,
        marketingOptedIn,
        marketingOptedOut, // inferred from having a record but optIn=false
        fullyBlocked,
        transactionalDisabled
    ] = await Promise.all([
        prisma.communicationConsent.count({ where: { merchantId } }),
        prisma.communicationConsent.count({ where: { merchantId, marketingOptIn: true } }),
        prisma.communicationConsent.count({ where: { merchantId, marketingOptIn: false } }),
        prisma.communicationConsent.count({ where: { merchantId, fullyBlocked: true } }),
        prisma.communicationConsent.count({ where: { merchantId, transactionalAllowed: false } }),
    ]);

    const optInRate = totalCustomers > 0 ? (marketingOptedIn / totalCustomers) : 0;

    // Get 30d events
    const last30d = new Date();
    last30d.setDate(last30d.getDate() - 30);

    const [optInEvents, optOutEvents, blockAllEvents] = await Promise.all([
        prisma.complianceEvent.count({
            where: { merchantId, eventType: 'OPT_IN', createdAt: { gte: last30d } }
        }),
        prisma.complianceEvent.count({
            where: { merchantId, eventType: 'OPT_OUT', createdAt: { gte: last30d } }
        }),
        prisma.complianceEvent.count({
            where: { merchantId, eventType: 'BLOCK_ALL', createdAt: { gte: last30d } }
        })
    ]);

    return {
        total_customers: totalCustomers,
        marketing_opted_in: marketingOptedIn,
        marketing_opted_out: marketingOptedOut,
        fully_blocked: fullyBlocked,
        transactional_disabled: transactionalDisabled,
        opt_in_rate: optInRate,
        last_30d: {
            opt_in_events: optInEvents,
            opt_out_events: optOutEvents,
            block_all_events: blockAllEvents
        }
    };
}

export async function getReachableAudience(merchantId: string, type: MessageIntent) {
    // For MARKETING: Eligible = optIn=true AND blocked=false
    // For TRANSACTIONAL: Eligible = transactional=true (or default) AND blocked=false

    // Note: getConsent defaults are strict (allow T, deny M). 
    // But data queries only see existing records.
    // If a customer exists in `CommunicationConsent`, we use their preferences.
    // If they do NOT exist, they are safe for Transactional, blocked for Marketing.
    // However, for audience calculation, we usually only count KNOWN customers (in Consent table)
    // OR we count all Customers in the DB and join?
    // The prompt says "total_customers should be computed from customer table OR distinct consent rows".
    // Let's assume we drive from Consent rows for "Reachable" (explicitly opted in).

    if (type === MessageIntent.MARKETING) {
        const eligible = await prisma.communicationConsent.count({
            where: {
                merchantId,
                marketingOptIn: true,
                fullyBlocked: false
            }
        });

        const fullyBlockedCount = await prisma.communicationConsent.count({
            where: { merchantId, fullyBlocked: true }
        });

        // "No marketing consent" is basically Total - Eligible - BlockedAll
        // Or specific count:
        const noConsentCount = await prisma.communicationConsent.count({
            where: {
                merchantId,
                marketingOptIn: false,
                fullyBlocked: false
            }
        });

        return {
            eligible,
            blocked: fullyBlockedCount + noConsentCount,
            blocked_breakdown: {
                blocked_all: fullyBlockedCount,
                no_marketing_consent: noConsentCount,
                transactional_disabled: 0 // Irrelevant
            }
        };
    } else {
        // Transactional
        // If they are in the table, check flags. If not in table, they are eligible (usually).
        // But let's count only those explicitly blocked or disabled.

        const fullyBlockedCount = await prisma.communicationConsent.count({
            where: { merchantId, fullyBlocked: true }
        });

        const transactionalDisabledCount = await prisma.communicationConsent.count({
            where: { merchantId, transactionalAllowed: false, fullyBlocked: false }
        });

        // Allowed = Total - (Blocked + Disabled)
        // This is tricky if we don't know total *potential* customers (e.g. from Order table).
        // For now, let's just return what we know from the Consent table as "restrictions".
        // The prompt asks for "eligible". If we don't have a total customer count source, we can't give a perfect eligible count for transactional (since default is Allow).
        // We'll treat "Total Customers" as `count(CustomerConsent)`.

        const total = await prisma.communicationConsent.count({ where: { merchantId } });
        const eligible = total - fullyBlockedCount - transactionalDisabledCount;

        return {
            eligible, // Among known consent records
            blocked: fullyBlockedCount + transactionalDisabledCount,
            blocked_breakdown: {
                blocked_all: fullyBlockedCount,
                no_marketing_consent: 0,
                transactional_disabled: transactionalDisabledCount
            }
        };
    }
}
