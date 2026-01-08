import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export interface TenantContext {
  userId: string;
  merchantId: string;
  storeId?: string;
  roles: string[];
}

export async function getTenantContext(
  req: NextRequest,
): Promise<TenantContext> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (token && token.sub) {
    return {
      userId: token.sub,
      merchantId: (token as any).storeId || token.sub, // Mapping storeId as merchantId for now, or userId if independent
      storeId: (token as any).storeId,
      roles: [(token as any).role || "viewer"],
    };
  }

  if (process.env.NODE_ENV !== "production") {
    const testMid = req.headers.get("x-test-merchant-id");
    if (testMid) {
      return {
        userId: req.headers.get("x-test-user-id") || "test_user",
        merchantId: testMid,
        storeId: req.headers.get("x-test-store-id") || undefined,
        roles: ["owner"],
      };
    }
  }

  throw new Error("Unauthorized: No active session found");
}

export function requireMerchant(ctx: TenantContext) {
  if (!ctx.merchantId) throw new Error("Merchant Context Required");
  return ctx.merchantId;
}

export function requireStore(ctx: TenantContext) {
  if (!ctx.storeId) throw new Error("Store Context Required");
  return ctx.storeId;
}
