import { cookies } from 'next/headers';

/**
 * Retrieves the current merchant ID from the authenticated session.
 * For now, this is a stub that returns a fixed test ID or reads from a cookie.
 */
export async function getMerchantId(): Promise<string> {
    const cookieStore = cookies();
    const specificMerchantId = cookieStore.get('x-merchant-id')?.value;

    // Return specific ID if found, otherwise default stub
    return specificMerchantId || 'stub_merchant_id';
}
