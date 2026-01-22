import axios from "axios";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export const PaystackService = {
    async initializeTransaction(
        email: string,
        amount: number, // in kobo
        reference: string,
        callbackUrl: string,
        metadata: unknown = {}
    ) {
        if (!PAYSTACK_SECRET_KEY) {
            throw new Error("PAYSTACK_SECRET_KEY is not configured");
        }

        const response = await axios.post(
            "https://api.paystack.co/transaction/initialize",
            {
                email,
                amount,
                reference,
                callback_url: callbackUrl,
                metadata,
                channels: ["card", "bank", "ussd", "qr", "mobile_money", "bank_transfer"],
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.data; // { authorization_url, access_code, reference }
    },

    async verifyTransaction(reference: string) {
        if (!PAYSTACK_SECRET_KEY) {
            throw new Error("PAYSTACK_SECRET_KEY is not configured");
        }

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        return response.data.data;
    },

    async resolveBankAccount(accountNumber: string, bankCode: string) {
        if (!PAYSTACK_SECRET_KEY) {
            throw new Error("PAYSTACK_SECRET_KEY is not configured");
        }

        const response = await axios.get(
            `https://api.paystack.co/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        return response.data.data; // { account_number, account_name, bank_id }
    },
};
