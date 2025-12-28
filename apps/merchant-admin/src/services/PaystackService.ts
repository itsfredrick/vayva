import crypto from 'crypto';
import { assertFeatureEnabled } from '@/lib/env-validation';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

function getPaystackKey(): string {
    const key = process.env.PAYSTACK_SECRET_KEY;
    if (!key) {
        throw new Error('PAYSTACK_SECRET_KEY not configured');
    }
    return key;
}

export class PaystackService {

    /**
     * Initialize a transaction
     */
    static async initializeTransaction(email: string, amount: number, reference: string, callbackUrl: string, metadata?: any) {
        // Enforce feature flag - throws if payments disabled
        assertFeatureEnabled('PAYMENTS_ENABLED');

        const secretKey = getPaystackKey();

        // Amount is in Kobo
        const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${secretKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                amount,
                reference,
                callback_url: callbackUrl,
                metadata
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Paystack initialization failed');
        }

        const data = await response.json();
        return data.data; // { authorization_url, access_code, reference }
    }

    /**
     * Verify a transaction with retry logic
     */
    static async verifyTransaction(reference: string, maxRetries = 3) {
        assertFeatureEnabled('PAYMENTS_ENABLED');

        const secretKey = getPaystackKey();

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${secretKey}`
                    }
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Paystack verification failed');
                }

                const data = await response.json();
                return data.data;
            } catch (error) {
                if (attempt === maxRetries - 1) {
                    throw error;
                }
                // Wait before retry (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            }
        }
    }
}

/**
 * Validate Paystack webhook signature
 */
export function validatePaystackWebhook(
    payload: string,
    signature: string
): boolean {
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
        throw new Error('PAYSTACK_SECRET_KEY not configured');
    }

    const hash = crypto
        .createHmac('sha512', secret)
        .update(payload)
        .digest('hex');

    return hash === signature;
}
