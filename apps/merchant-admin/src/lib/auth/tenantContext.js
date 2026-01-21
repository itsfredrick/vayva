import { getToken } from "next-auth/jwt";
export async function getTenantContext(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (token && token.sub) {
        return {
            userId: token.sub,
            merchantId: token.storeId || token.sub, // Mapping storeId as merchantId for now, or userId if independent
            storeId: token.storeId,
            roles: [token.role || "viewer"],
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
export function requireMerchant(ctx) {
    if (!ctx.merchantId)
        throw new Error("Merchant Context Required");
    return ctx.merchantId;
}
export function requireStore(ctx) {
    if (!ctx.storeId)
        throw new Error("Store Context Required");
    return ctx.storeId;
}
