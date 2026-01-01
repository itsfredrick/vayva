export interface CreatePaymentIntentParams {
  amount: number; // in minor units (e.g. kobo/cents)
  currency: string;
  description?: string;
  metadata?: Record<string, any>;
  customer?: {
    id?: string;
    email?: string;
    phone?: string;
  };
  confirmationMethod?: "automatic" | "manual";
}

export interface PaymentIntentResult {
  id: string; // provider specific id
  clientSecret?: string;
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "processing"
    | "succeeded"
    | "canceled";
  amount: number;
  currency: string;
  rawData: any;
}

export interface CreateRefundParams {
  chargeId: string; // provider charge id
  amount?: number; // partial refund if provided
  reason?: string;
  metadata?: Record<string, any>;
}

export interface RefundResult {
  id: string;
  status: "pending" | "succeeded" | "failed" | "canceled";
  amount: number;
  currency: string;
  rawData: any;
}

export interface WebhookEventResult {
  isValid: boolean;
  event?: {
    id: string;
    type: string;
    data: any;
  };
  error?: string;
}

export interface IPaymentsProvider {
  createPaymentIntent(
    params: CreatePaymentIntentParams,
  ): Promise<PaymentIntentResult>;
  createRefund(params: CreateRefundParams): Promise<RefundResult>;
  verifyWebhookSignature(
    payload: string | Buffer,
    signature: string,
    secret: string,
  ): Promise<WebhookEventResult>;
  // Optional methods
  getBalance?(): Promise<{
    available: number;
    pending: number;
    currency: string;
  }>;
}
