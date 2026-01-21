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
    getLedger: async (filters) => {
        const entries = await PaymentService.getLedger();
        return entries.map((e) => ({
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
    addBank: async (bank) => {
        return PaymentService.addBank(bank);
    },
    deleteBank: async (id) => {
        return PaymentService.deleteBank(id);
    },
    // 4. PIN & Security
    verifyPin: async (pin) => {
        try {
            await PaymentService.verifyPin(pin);
            return true;
        }
        catch (e) {
            return false;
        }
    },
    setPin: async (pin) => {
        await PaymentService.setPin(pin);
        return true;
    },
    // 5. Withdrawal
    initiateWithdrawal: async (amount, bankId, pin) => {
        const res = await PaymentService.initiateWithdrawal({
            amountKobo: (amount * 100).toString(),
            bankAccountId: bankId,
            pin,
        });
        return res.withdrawalId;
    },
    confirmWithdrawal: async (withdrawalId, otp) => {
        await PaymentService.confirmWithdrawal(withdrawalId, otp);
        return true;
    },
    createVirtualAccount: async () => {
        return PaymentService.createVirtualAccount();
    },
};
