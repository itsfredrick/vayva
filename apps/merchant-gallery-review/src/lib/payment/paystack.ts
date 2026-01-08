interface PaystackInitializeParams {
  email: string;
  amount: number; // in kobo
  reference: string;
  metadata?: Record<string, any>;
  callback_url?: string;
}

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: string;
    reference: string;
    amount: number;
    customer: {
      email: string;
    };
    metadata: Record<string, any>;
  };
}

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || "";
const PAYSTACK_BASE_URL = "https://api.paystack.co";

export class PaystackService {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
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

    return data as T;
  }

  static async initializeTransaction(
    params: PaystackInitializeParams,
  ): Promise<PaystackInitializeResponse> {
    return this.request<PaystackInitializeResponse>("/transaction/initialize", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  static async verifyTransaction(
    reference: string,
  ): Promise<PaystackVerifyResponse> {
    return this.request<PaystackVerifyResponse>(
      `/transaction/verify/${reference}`,
    );
  }

  static async createPaymentForPlanChange(
    email: string,
    newPlan: string,
    storeId: string,
  ): Promise<{ authorization_url: string; reference: string }> {
    // Plan prices in kobo
    const planPrices: Record<string, number> = {
      STARTER: 0,
      GROWTH: 30000 * 100, // ₦30,000
      PRO: 40000 * 100, // ₦40,000
    };

    const amount = planPrices[newPlan] || 0;

    if (amount === 0) {
      throw new Error("Cannot create payment for free plan");
    }

    const reference = `sub_${storeId}_${Date.now()}`;

    const response = await this.initializeTransaction({
      email,
      amount,
      reference,
      metadata: {
        storeId,
        newPlan,
        type: "subscription",
      },
      callback_url: `${process.env.NEXTAUTH_URL}/dashboard/settings/subscription?payment=success`,
    });

    return {
      authorization_url: response.data.authorization_url,
      reference: response.data.reference,
    };
  }

  static async verifyPlanChangePayment(reference: string): Promise<{
    success: boolean;
    storeId: string;
    newPlan: string;
  }> {
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

  static async initiateTemplatePurchase(
    email: string,
    templateId: string,
    storeId: string,
    amountNgn: number,
  ): Promise<{ authorization_url: string; reference: string }> {
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
}
