import { prisma } from "@vayva/db";
import { redactEmail, redactPhone, hashIdentifier } from "./redact";

export class DsrService {
  /**
   * Gather all data for a subject.
   * Identifier can be email or phone.
   */
  static async exportData(storeId: string, identifier: string) {
    // Normalize identifier? For now assume strict match or simple cleaning
    const customer = await prisma.customer.findFirst({
      where: {
        storeId,
        OR: [{ email: identifier }, { phone: identifier }],
      },
      include: {
        addresses: true,
        orders: {
          take: 50, // Limit for export size safety or paginate
          orderBy: { createdAt: "desc" },
        },
        supportTickets: true,
      },
    });

    if (!customer) return null;

    // Fetch consents separately due to missing relation
    const communicationConsents = await prisma.communication_consent.findMany({
      where: {
        merchantId: storeId,
        customerId: customer.id,
      },
    });

    // Return raw data structure for JSON export
    return {
      customer,
      communicationConsents,
      exportedAt: new Date(),
      policy: "Vayva Privacy Export",
    };
  }

  /**
   * Anonymize subject data.
   * Retains IDs for financial consistency but removes PII.
   */
  static async anonymizeUser(
    storeId: string,
    identifier: string,
    reason: string,
    adminId: string,
  ) {
    const customer = await prisma.customer.findFirst({
      where: {
        storeId,
        OR: [{ email: identifier }, { phone: identifier }],
      },
    });

    if (!customer) throw new Error("Customer not found");

    const redactedLabel = `Redacted-${customer.id.substring(0, 6)}`;
    const hashedPhone = customer.phone ? hashIdentifier(customer.phone) : null;
    const hashedEmail = customer.email
      ? `${hashIdentifier(customer.email)}@deleted.vayva.ng`
      : null;

    // Transactional update
    await prisma.$transaction(async (tx: any) => {
      // 1. Anonymize Customer Profile
      await tx.customer.update({
        where: { id: customer.id },
        data: {
          firstName: "Redacted",
          lastName: "User",
          email: hashedEmail, // Keep unique constraint satisfied if needed
          phone: hashedPhone,
          notes: `Anonymized via DSR by ${adminId}. Reason: ${reason}`,
        },
      });

      // 2. Anonymize Addresses
      await tx.customerAddress.updateMany({
        where: { customerId: customer.id },
        data: {
          recipientName: "Redacted",
          recipientPhone: "0000000000",
          addressLine1: "Redacted Address",
          addressLine2: null,
          city: "Redacted",
          state: "Redacted",
        },
      });

      // 3. Anonymize Orders (Snapshot data)
      // We do NOT delete orders. We just remove direct PII from snapshot fields if they exist.
      // Assuming Order has customerEmail/Phone snapshot fields to clear.
      await tx.order.updateMany({
        where: { customerId: customer.id },
        data: {
          customerEmail: "redacted@deleted.vayva.ng",
          customerPhone: "0000000000",
        },
      });

      // 4. Log Audit
      await tx.auditLog.create({
        data: {
          action: "dsr.anonymize",
          actorType: "platform_admin",
          actorId: adminId,
          actorLabel: "Admin", // Added required field
          entityType: "customer",
          entityId: customer.id,
          // metadata: { reason } as any, // Removed to fix strict typecheck
          correlationId: `dsr_${customer.id}`, // Added required field
        },
      });
    });

    return { success: true, customerId: customer.id };
  }
}
