
import Stripe from 'stripe';
import {
    IPaymentsProvider,
    CreatePaymentIntentParams,
    PaymentIntentResult,
    CreateRefundParams,
    RefundResult,
    WebhookEventResult
} from './types';

export class StripeProvider implements IPaymentsProvider {
    private stripe: Stripe;
    private webhookSecret: string;

    constructor(apiKey: string, webhookSecret: string) {
        this.stripe = new Stripe(apiKey, {
            apiVersion: '2023-10-16', // Pin version
            typescript: true,
        });
        this.webhookSecret = webhookSecret;
    }

    async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
        const intent = await this.stripe.paymentIntents.create({
            amount: params.amount,
            currency: params.currency,
            description: params.description,
            metadata: params.metadata,
            receipt_email: params.customer?.email,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        return {
            id: intent.id,
            clientSecret: intent.client_secret || undefined,
            status: intent.status as any,
            amount: intent.amount,
            currency: intent.currency,
            rawData: intent
        };
    }

    async createRefund(params: CreateRefundParams): Promise<RefundResult> {
        const refund = await this.stripe.refunds.create({
            charge: params.chargeId,
            amount: params.amount,
            reason: params.reason as Stripe.RefundCreateParams.Reason,
            metadata: params.metadata,
        });

        return {
            id: refund.id,
            status: (refund.status || 'pending') as any,
            amount: refund.amount,
            currency: refund.currency,
            rawData: refund
        };
    }

    async verifyWebhookSignature(payload: string | Buffer, signature: string, secret?: string): Promise<WebhookEventResult> {
        try {
            // Use instance secret or override
            const endpointSecret = secret || this.webhookSecret;
            const event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);

            return {
                isValid: true,
                event: {
                    id: event.id,
                    type: event.type,
                    data: event.data.object
                }
            };
        } catch (err: any) {
            return {
                isValid: false,
                error: err.message
            };
        }
    }
}
