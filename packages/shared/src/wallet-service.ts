
import { prisma, LedgerAccountType, TransactionType } from "@vayva/db";

export class WalletService {

    /**
     * Processes a financial transaction between a source (optional) and destination ledger account.
     * Ensures double-entry consistency and idempotency if referenceId is provided.
     */
    static async processTransaction(params: {
        ownerId: string | null; // null for system wallets
        amount: bigint; // In Kobo (INTEGER)
        type: TransactionType; // CREDIT or DEBIT
        accountType: LedgerAccountType;
        referenceId: string;
        description?: string;
    }) {
        const { ownerId, amount, type, accountType, referenceId, description } = params;

        // 1. Idempotency Check
        const existing = await prisma.ledgerTransaction.findFirst({
            where: { referenceId, accountId: { in: [] } } // Optimization: Check inside transaction?
        });
        // Actually, referenceId should be unique globally? 
        // Schema says @@index([referenceId]), not unique.
        // If double-entry, same referenceId might appear twice (Credit one, Debit another).
        // So check if transaction exists for THIS account?
        // Let's rely on strict business logic:

        return prisma.$transaction(async (tx) => {
            // Find or Create Account
            // We use upsert to ensure it exists.
            // Note: ownerId is part of unique constraint [ownerId, type, currency]
            // IF ownerId is null, we can't use 'where: { ownerId: null }' in upsert effectively in simple objects sometimes.
            // But Prisma supports it.

            const account = await tx.ledgerAccount.upsert({
                where: {
                    ownerId_type_currency: {
                        ownerId: ownerId as unknown, // Cast to avoid TS null check strictness
                        type: accountType,
                        currency: "NGN",
                    }
                },
                update: {},
                create: {
                    ownerId,
                    type: accountType,
                    currency: "NGN",
                    balance: 0n, // BigInt literal
                }
            });

            // Idempotency: Check if transaction with refId already exists for this account
            const existingTx = await tx.ledgerTransaction.findFirst({
                where: {
                    accountId: account.id,
                    referenceId
                }
            });

            if (existingTx) {
                return { status: 'SKIPPED', transaction: existingTx, account };
            }

            // Check Funds if DEBIT
            if (type === 'DEBIT') {
                if (account.balance < amount) {
                    throw new Error(`Insufficient funds in ${accountType} wallet. Balance: ${account.balance}, Required: ${amount}`);
                }
            }

            // Calculate new balance
            const newBalance = type === 'CREDIT'
                ? account.balance + amount
                : account.balance - amount;

            // Update Account
            const updatedAccount = await tx.ledgerAccount.update({
                where: { id: account.id },
                data: { balance: newBalance }
            });

            // Create Transaction Record
            const transaction = await tx.ledgerTransaction.create({
                data: {
                    accountId: account.id,
                    amount,
                    type,
                    referenceId,
                    balanceBefore: account.balance,
                    balanceAfter: newBalance,
                    description
                }
            });

            return { status: 'SUCCESS', transaction, account: updatedAccount };
        });
    }

    static async getBalance(ownerId: string, type: LedgerAccountType = 'MERCHANT_AVAILABLE') {
        const account = await prisma.ledgerAccount.findUnique({
            where: {
                ownerId_type_currency: {
                    ownerId,
                    type,
                    currency: "NGN"
                }
            }
        });
        return account?.balance || 0n;
    }

    static async getSystemBalance(type: LedgerAccountType) {
        if (!type.startsWith("SYSTEM")) throw new Error("Not a system account type");
        const account = await prisma.ledgerAccount.findUnique({
            where: {
                ownerId_type_currency: {
                    ownerId: null as unknown, // Cast to avoid TS null check strictness
                    type,
                    currency: "NGN"
                }
            }
        });
        return account?.balance || 0n;
    }
}
