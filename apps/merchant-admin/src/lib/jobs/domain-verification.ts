import dns from "node:dns/promises";
import { prisma } from "@vayva/db";
import { logAuditEvent as logAudit } from "@/lib/audit";

export async function verifyDomainDns(domainMappingId: string) {
  const mapping = await prisma.domainMapping.findUnique({
    where: { id: domainMappingId },
    include: { store: true },
  });

  if (!mapping) {
    console.error(`[DomainJob] Mapping ${domainMappingId} not found.`);
    return;
  }

  const domain = mapping.domain;
  const token = mapping.verificationToken;
  let status: "verified" | "failed" | "pending" = "pending";
  let error: string | null = null;

  console.log(
    `[DomainJob] Starting verification for ${domain} (${domainMappingId})`,
  );

  try {
    // We check for a TXT record: vayva-verification=[token]
    const txtRecords = await dns.resolveTxt(domain);
    const flattened = txtRecords.flat();

    const isVerified = flattened.some((record) =>
      record.includes(`vayva-verification=${token}`),
    );

    if (isVerified) {
      status = "verified";

    } else {
      status = "failed";
      error = "Verification TXT record not found.";
      console.warn(
        `[DomainJob] ${domain} verification failed: TXT record missing or incorrect.`,
      );
    }
  } catch (err: unknown) {
    status = "failed";
    error = err.code === "ENOTFOUND" ? "Domain not found" : err.message;
    console.error(`[DomainJob] DNS error for ${domain}:`, err.message);
  }

  // Update status and metadata
  await prisma.domainMapping.update({
    where: { id: domainMappingId },
    data: {
      status,
      provider: {
        ...((mapping.provider as unknown) || {}),
        lastCheckedAt: new Date().toISOString(),
        lastError: error,
      },
    },
  });

  // Audit log via standardized helper
  await logAudit(
    mapping.storeId,
    "worker-dns",
    "DOMAIN_VERIFICATION_CHECK",
    {
      targetType: "DOMAIN_MAPPING",
      targetId: mapping.id,
      after: { domain, status, error },
      meta: { actor: { type: "SYSTEM", label: "Domain Verification Service" } }
    }
  );
}
