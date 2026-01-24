export interface WalletSummary {
    balance: number;
    status: string;
    pinSet: boolean;
    currency: string;
    availableBalance?: number;
}
export interface Transaction {
    id: string;
    amount: number;
    type: string;
    date: string;
    [key: string]: any;
}
export const WalletService = {
    getSummary: async () => ({ balance: 0, availableBalance: 0, status: "active", pinSet: false, currency: "NGN" }),
    getLedger: async (params: any) => [],
    verifyPin: async (pin: string) => true,
    setPin: async (pin: string) => { },
    addBank: async (data: any) => { },
    getBanks: async () => [],
    initiateWithdrawal: async (amount: number, pin: string) => ({ id: "1" }),
    confirmWithdrawal: async (id: string, otp: string) => true,
};
