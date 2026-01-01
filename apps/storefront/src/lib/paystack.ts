const PAYSTACK_BASE_URL = "https://api.paystack.co";

export interface InitializePaymentPayload {
  email: string;
  amount: number; // in kobo
  reference?: string;
  callback_url?: string;
  metadata?: any;
  currency?: string;
  channels?: string[];
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export const PaystackService = {
  initializeTransaction: async (
    payload: InitializePaymentPayload,
  ): Promise<PaystackInitializeResponse> => {
    const secretKey =
      process.env.PAYSTACK_SECRET_KEY || process.env.PAYSTACK_LIVE_SECRET_KEY; // Fallback to live if testing is not available? Logic check.
    // Actually, usually test key is default for dev.
    // Let's use strict env check.

    const key =
      process.env.NODE_ENV === "production"
        ? process.env.PAYSTACK_LIVE_SECRET_KEY
        : process.env.PAYSTACK_SECRET_KEY;

    if (!key) {
      console.warn("[Paystack] No Secret Key found. Payments will fail.");
      throw new Error("PAYSTACK_SECRET_KEY not configured");
    }

    try {
      const response = await fetch(
        `${PAYSTACK_BASE_URL}/transaction/initialize`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Paystack initialization failed");
      }

      return await response.json();
    } catch (error: any) {
      console.error("[Paystack] Init Error:", error.message);
      throw error;
    }
  },
};
