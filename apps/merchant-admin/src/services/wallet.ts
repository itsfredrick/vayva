import { PaymentService, } from "./payments";
export const WalletService = {
    // 1. Summary
    getSummary: async () => {
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
    getLedger: async (filters: any) => {
        const entries = await PaymentService.getLedger();
        return entries.map((e: any) => ({
            id: e.id,
            type: e.type.toLowerCase(),
            amount: Number(e.amountKobo) / 100,
            currency: e.currency,
            status: e.status.toLowerCase(),
            description: e.title,
            date: e.createdAt,
            reference: e.reference,
        }));
    },
    // 3. Banks
    getBanks: async () => {
        return PaymentService.listBanks();
    },
    addBank: async (bank: any) => {
        return PaymentService.addBank(bank);
    },
    deleteBank: async (id: any) => {
        return PaymentService.deleteBank(id);
    },
    // 4. PIN & Security
    verifyPin: async (pin: any) => {
        try {
            await PaymentService.verifyPin(pin);
            return true;
        }
        catch (e) {
            return false;
        }
    },
    setPin: async (pin: any) => {
        await PaymentService.setPin(pin);
        return true;
    },
    // 5. Withdrawal
    initiateWithdrawal: async (amount: any, bankId: any, pin: any) => {
        const res = await PaymentService.initiateWithdrawal({
            amountKobo: (amount * 100).toString(),
            bankAccountId: bankId,
            pin,
        });
        return res.withdrawalId;
    },
    confirmWithdrawal: async (withdrawalId: any, otp: any) => {
        await PaymentService.confirmWithdrawal(withdrawalId, otp);
        return true;
    },
    createVirtualAccount: async () => {
        return PaymentService.createVirtualAccount();
    },
};
