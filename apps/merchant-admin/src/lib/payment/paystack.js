const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE_URL = "https://api.paystack.co";
export class PaystackService {
    static async request(endpoint, options = {}) {
        const response = await fetch(`${PAYSTACK_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                "Content-Type": "application/json",
                ...options.headers,
            },
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Paystack request failed");
        }
        return data;
    }
    static async initializeTransaction(params) {
        return this.request("/transaction/initialize", {
            method: "POST",
            body: JSON.stringify(params),
        });
    }
    static async verifyTransaction(reference) {
        return this.request(`/transaction/verify/${reference}`);
    }
    static async createPaymentForPlanChange(email, newPlan, storeId) {
        // Plan prices in kobo
        const planPrices = {
            FREE: 0,
            STARTER: 30000 * 100, // ₦30,000
            PRO: 40000 * 100, // ₦40,000
        };
        const baseAmount = planPrices[newPlan] || 0;
        if (baseAmount === 0) {
            throw new Error("Cannot create payment for free plan");
        }
        const vatAmount = Math.round(baseAmount * 0.075);
        const amount = baseAmount + vatAmount;
        const reference = `sub_${storeId}_${Date.now()}`;
        const response = await this.initializeTransaction({
            email,
            amount,
            reference,
            metadata: {
                storeId,
                newPlan,
                type: "subscription",
                baseAmountKobo: baseAmount,
                vatAmountKobo: vatAmount,
                vatRate: 7.5,
            },
            callback_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL}/dashboard/settings/subscription?payment=success`,
        });
        return {
            authorization_url: response.data.authorization_url,
            reference: response.data.reference,
        };
    }
    static async verifyPlanChangePayment(reference) {
        const response = await this.verifyTransaction(reference);
        if (response.data.status !== "success") {
            throw new Error("Payment not successful");
        }
        const { storeId, newPlan } = response.data.metadata;
        if (!storeId || !newPlan) {
            throw new Error("Invalid payment metadata");
        }
        return {
            success: true,
            storeId,
            newPlan,
        };
    }
    static async initiateTemplatePurchase(email, templateId, storeId, amountNgn) {
        const reference = `tpl_${templateId.slice(0, 8)}_${storeId}_${Date.now()}`;
        const response = await this.initializeTransaction({
            email,
            amount: amountNgn * 100, // to kobo
            reference,
            metadata: {
                storeId,
                templateId,
                type: "template_purchase",
            },
            callback_url: `${process.env.NEXTAUTH_URL}/dashboard/store/themes?payment=success&tid=${templateId}`,
        });
        return {
            authorization_url: response.data.authorization_url,
            reference: response.data.reference,
        };
    }
    static async getBanks() {
        const response = await this.request("/bank", {
            method: "GET",
        });
        return response.data;
    }
    static async resolveAccount(accountNumber, bankCode) {
        const response = await this.request(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`, {
            method: "GET",
        });
        return response.data;
    }
}
