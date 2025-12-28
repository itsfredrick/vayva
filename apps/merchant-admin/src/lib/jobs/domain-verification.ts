
import dns from 'node:dns/promises';
import { prisma } from '@vayva/db';
import { logAudit, AuditAction } from '../audit';

export async function verifyDomainDns(domainMappingId: string) {
    const mapping = await prisma.domainMapping.findUnique({
        where: { id: domainMappingId },
        include: { store: true }
    });

    if (!mapping) {
        console.error(`[DomainJob] Mapping ${domainMappingId} not found.`);
        return;
    }

    const domain = mapping.domain;
    const token = mapping.verificationToken;
    let status: 'verified' | 'failed' | 'pending' = 'pending';
    let error: string | null = null;

    console.log(`[DomainJob] Starting verification for ${domain} (Expected TXT: vayva-verification=${token})`);

    try {
        // We check for a TXT record: vayva-verification=[token]
        const txtRecords = await dns.resolveTxt(domain);
        const flattened = txtRecords.flat();

        const isVerified = flattened.some(record => record.includes(`vayva-verification=${token}`));

        if (isVerified) {
            status = 'verified';
            console.log(`[DomainJob] ${domain} successfully verified via TXT record.`);
        } else {
            status = 'failed';
            error = 'Verification TXT record not found.';
            console.warn(`[DomainJob] ${domain} verification failed: TXT record missing or incorrect.`);
        }
    } catch (err: any) {
        status = 'failed';
        error = err.code === 'ENOTFOUND' ? 'Domain not found' : err.message;
        console.error(`[DomainJob] DNS error for ${domain}:`, err.message);
    }

    // Update status and metadata
    await prisma.domainMapping.update({
        where: { id: domainMappingId },
        data: {
            status,
            provider: {
                ...(mapping.provider as any || {}),
                lastCheckedAt: new Date().toISOString(),
                lastError: error
            }
        }
    });

    // Audit log via standardized helper
    await logAudit({
        storeId: mapping.storeId,
        actor: { type: 'SYSTEM', id: 'worker-dns', label: 'Domain Verification Service' },
        action: 'DOMAIN_VERIFICATION_CHECK',
        entity: { type: 'DOMAIN_MAPPING', id: mapping.id },
        after: { domain, status, error }
    });
}
