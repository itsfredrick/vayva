import {
  PaymentService,
  WalletSummary as APIWalletSummary,
  LedgerEntry as APILedgerEntry,
  BankAccount,
} from "./payments";

export interface Transaction {
  id: string;
  type: "inflow" | "payout" | "fee" | "refund" | "adjustment";
  amount: number;
  currency: string;
  status: "success" | "pending" | "failed";
  description: string;
  date: string;
  reference: string;
  customer?: {
    name: string;
    email?: string;
  };
  orderId?: string;
}

export interface WalletSummary {
  currency: string;
  availableBalance: number;
  pendingPayouts: number;
  virtualAccount?: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    status: string;
  };
  status: "active" | "locked";
  kycStatus: string;
  pinSet: boolean;
}

export { type BankAccount };

export const WalletService = {
  // 1. Summary
  getSummary: async (): Promise<WalletSummary> => {
    const s = await PaymentService.getWalletSummary();
    return {
      currency: "NGN",
      availableBalance: Number(s.balances.availableKobo) / 100,
      pendingPayouts: Number(s.balances.pendingKobo) / 100,
      virtualAccount: s.virtualAccount.accountNumber
        ? {
            bankName: s.virtualAccount.bankName || "",
            accountNumber: s.virtualAccount.accountNumber || "",
            accountName: s.virtualAccount.accountName || "",
            status: s.virtualAccount.status,
          }
        : undefined,
      status: s.isLocked ? "locked" : "active",
      kycStatus: s.kycStatus,
      pinSet: s.pinSet,
    };
  },

  // 2. Ledger
  getLedger: async (filters: any): Promise<Transaction[]> => {
    const entries = await PaymentService.getLedger();
    return entries.map((e) => ({
      id: e.id,
      type: e.type.toLowerCase() as any,
      amount: Number(e.amountKobo) / 100,
      currency: e.currency,
      status: e.status.toLowerCase() as any,
      description: e.title,
      date: e.createdAt,
      reference: e.reference,
    }));
  },

  // 3. Banks
  getBanks: async (): Promise<BankAccount[]> => {
    return PaymentService.listBanks();
  },

  addBank: async (bank: Omit<BankAccount, "id">) => {
    return PaymentService.addBank(bank);
  },

  deleteBank: async (id: string) => {
    return PaymentService.deleteBank(id);
  },

  // 4. PIN & Security
  verifyPin: async (pin: string): Promise<boolean> => {
    try {
      await PaymentService.verifyPin(pin);
      return true;
    } catch (e) {
      return false;
    }
  },

  setPin: async (pin: string): Promise<boolean> => {
    await PaymentService.setPin(pin);
    return true;
  },

  // 5. Withdrawal
  initiateWithdrawal: async (
    amount: number,
    bankId: string,
    pin: string,
  ): Promise<string> => {
    const res = await PaymentService.initiateWithdrawal({
      amountKobo: (amount * 100).toString(),
      bankAccountId: bankId,
      pin,
    });
    return res.withdrawalId;
  },

  confirmWithdrawal: async (
    withdrawalId: string,
    otp: string,
  ): Promise<boolean> => {
    await PaymentService.confirmWithdrawal(withdrawalId, otp);
    return true;
  },

  createVirtualAccount: async () => {
    return PaymentService.createVirtualAccount();
  },
};
