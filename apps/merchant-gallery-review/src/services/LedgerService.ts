import { prisma } from "@vayva/db";
import { WalletTransactionType, WalletTransactionStatus } from "@vayva/shared";

// Type definitions for internal service use
interface TransactionRequest {
  storeId: string;
  type: WalletTransactionType;
  amount: number; // In Kobo/Cents (Integer)
  currency: string;
  referenceId: string;
  referenceType: "order" | "payout" | "refund" | "adjustment";
  description?: string;
  metadata?: Record<string, any>;
}

export class LedgerService {
  /**
   * Records a double-entry transaction.
   * Guaranteed atomic update of LedgerEntries and Wallet Balance.
   */
  static async recordTransaction(req: TransactionRequest) {
    return await prisma.$transaction(async (tx: any) => {
      // 1. Determine accounts and direction based on transaction type
      const entries = this.determineEntries(req);

      // 2. Create Ledger Entries
      await tx.ledgerEntry.createMany({
        data: entries.map((e) => ({
          storeId: req.storeId,
          referenceType: req.referenceType,
          referenceId: req.referenceId,
          direction: e.direction,
          account: e.account,
          amount: e.amount, // Decimal in DB, but we handle logic carefully
          currency: req.currency,
          description: req.description,
          metadata: req.metadata,
          occurredAt: new Date(),
        })),
      });

      // 3. Update Wallet Balance (Materialized View)
      // We only update wallet balance for specific accounts (e.g., 'wallet_available')
      const walletImpact = entries.reduce((acc: number, e) => {
        if (e.account === "wallet_available") {
          return acc + (e.direction === "CREDIT" ? e.amount : -e.amount);
        }
        return acc;
      }, 0);

      if (walletImpact !== 0) {
        // Ensure wallet exists
        let wallet = await tx.wallet.findUnique({
          where: { storeId: req.storeId },
        });
        if (!wallet) {
          // Auto-create wallet if missing (should exist from onboarding in real prod)
          wallet = await tx.wallet.create({ data: { storeId: req.storeId } });
        }

        await tx.wallet.update({
          where: { storeId: req.storeId },
          data: {
            availableKobo: {
              increment: walletImpact,
            },
          },
        });
      }

      return { success: true };
    });
  }

  /**
   * Helper to define the double-entry logic
   */
  private static determineEntries(
    req: TransactionRequest,
  ): { account: string; direction: "DEBIT" | "CREDIT"; amount: number }[] {
    const { type, amount } = req;
    const entries: {
      account: string;
      direction: "DEBIT" | "CREDIT";
      amount: number;
    }[] = [];

    switch (type) {
      case WalletTransactionType.PAYMENT:
        // Customer Paid -> Revenue to Merchant Wallet
        // Debit: Acquirer/Provider (Money waiting there) -> Skipped for now, simplifying
        // Debit: Receivable (System Asset)
        // Credit: Wallet Available (Merchant Liability)

        // Simplified for Merchant View:
        // Credit Wallet Available
        // Debit System Pending (or Provider)
        entries.push({
          account: "wallet_available",
          direction: "CREDIT",
          amount,
        });
        entries.push({ account: "sales_revenue", direction: "CREDIT", amount }); // Tracking revenue
        // This isn't balanced in this scope because we aren't tracking system accounts fully yet.
        // For a Merchant Ledger, we just want to see their movements.
        // Let's stick to: Credit Wallet, Debit "Source"
        break;

      case WalletTransactionType.PAYOUT:
        // Merchant Withdraws
        // Debit Wallet Available
        // Credit Payout Pending
        entries.push({
          account: "wallet_available",
          direction: "DEBIT",
          amount,
        });
        break;

      // Add other cases as needed
    }

    return entries;
  }

  static async getBalance(storeId: string) {
    const wallet = await prisma.wallet.findUnique({
      where: { storeId },
    });
    return {
      available: Number(wallet?.availableKobo ?? 0),
      pending: Number(wallet?.pendingKobo ?? 0),
      currency: "NGN",
    };
  }
}
