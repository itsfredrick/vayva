import { cookies } from "next/headers";

/**
 * Retrieves the current merchant ID from the authenticated session.
 * For now, this is a pending that returns a fixed test ID or reads from a cookie.
 */
export async function getMerchantId(): Promise<string | null> {
  const cookieStore = await cookies();
  const specificMerchantId = cookieStore.get("x-merchant-id")?.value;

  // Return specific ID if found
  return specificMerchantId || null;
}

/**
 * Retrieves the current merchant ID from the authenticated session.
 * For now, this is a pending that returns a fixed test ID or reads from a cookie.
 */
export async function getTenantId() {
  const cookieStore = await cookies();
  const tenantId = cookieStore.get("tenantId")?.value;
  return tenantId;
}
