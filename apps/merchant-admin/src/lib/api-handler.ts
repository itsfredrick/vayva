import { NextRequest, NextResponse } from "next/server";

export interface APIContext {
    user: any;
    storeId: string;
    params: any;
    correlationId: string;
}
import { requireAuth } from "./session";
import { can as checkPermission } from "./team/permissions";
import { checkRateLimit } from "./ratelimit";
import { verifyIdempotency, saveIdempotencyResponse } from "./idempotency";
import { logger, ErrorCategory } from "./logger";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@vayva/db";
/**
 * Robust Higher-Order Function for Vayva API Hardening.
 * Implements: Auth, RBAC, Tenant Isolation, Rate Limiting, Idempotency, Step-up, and Structured Logging.
 */
export function withVayvaAPI(permission: any, handler: (req: NextRequest, context: APIContext) => Promise<NextResponse>, options: any= {}) {
    return async (req: NextRequest, ...args: any[]) => {
        const correlationId = uuidv4();
        const method = req.method;
        const endpoint = req.nextUrl.pathname;
        let user;
        try {
            // 1. Authentication & Tenant Isolation
            user = await requireAuth();
            const storeId = user.storeId;

            const store = await prisma.store.findUnique({
                where: { id: storeId },
                select: { isActive: true, settings: true }
            });
            if (!store?.isActive) {
                logger.warn("Store suspended", ErrorCategory.SECURITY, {
                    userId: user.id,
                    storeId,
                    endpoint,
                    correlationId
                });
                return NextResponse.json({
                    error: "Store is suspended",
                    correlationId,
                    code: "STORE_SUSPENDED"
                }, { status: 403 });
            }

            const restrictions = (store.settings as any)?.restrictions || {};
            const isWrite = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
            if (isWrite && restrictions?.writeDisabled === true) {
                logger.warn("Store restricted (writeDisabled)", ErrorCategory.SECURITY, {
                    userId: user.id,
                    storeId,
                    endpoint,
                    correlationId
                });
                return NextResponse.json({
                    error: "Store is restricted",
                    correlationId,
                    code: "STORE_RESTRICTED"
                }, { status: 403 });
            }

            if (isWrite) {
                const isOrders = endpoint.startsWith("/api/orders") || endpoint.startsWith("/api/kitchen/orders");
                const isProducts = endpoint.startsWith("/api/products") || endpoint.startsWith("/api/collections");
                const isMarketing = endpoint.startsWith("/api/marketing");
                const isSettings = endpoint.startsWith("/api/settings") || endpoint.startsWith("/api/merchant/policies") || endpoint.startsWith("/api/storefront") || endpoint.startsWith("/api/domains") || endpoint.startsWith("/api/merchant/store/publish");
                const isSales = endpoint.startsWith("/api/leads") || endpoint.startsWith("/api/quotes") || endpoint.startsWith("/api/portfolio");
                const isPayments = endpoint.startsWith("/api/billing") || endpoint.startsWith("/api/invoices") || endpoint.startsWith("/api/payments");
                const isUploads = endpoint.startsWith("/api/storage");
                const isAi = endpoint.startsWith("/api/ai");

                if (restrictions?.ordersDisabled === true && isOrders) {
                    return NextResponse.json({
                        error: "Orders are restricted for this store",
                        correlationId,
                        code: "STORE_RESTRICTED_ORDERS"
                    }, { status: 403 });
                }

                if (restrictions?.productsDisabled === true && isProducts) {
                    return NextResponse.json({
                        error: "Products are restricted for this store",
                        correlationId,
                        code: "STORE_RESTRICTED_PRODUCTS"
                    }, { status: 403 });
                }

                if (restrictions?.marketingDisabled === true && isMarketing) {
                    return NextResponse.json({
                        error: "Marketing is restricted for this store",
                        correlationId,
                        code: "STORE_RESTRICTED_MARKETING"
                    }, { status: 403 });
                }

                if (restrictions?.settingsEditsDisabled === true && isSettings) {
                    return NextResponse.json({
                        error: "Settings edits are restricted for this store",
                        correlationId,
                        code: "STORE_RESTRICTED_SETTINGS"
                    }, { status: 403 });
                }

                if (restrictions?.salesDisabled === true && isSales) {
                    return NextResponse.json({
                        error: "Sales operations are restricted for this store",
                        correlationId,
                        code: "STORE_RESTRICTED_SALES"
                    }, { status: 403 });
                }

                if (restrictions?.paymentsDisabled === true && isPayments) {
                    return NextResponse.json({
                        error: "Payment operations are restricted for this store",
                        correlationId,
                        code: "STORE_RESTRICTED_PAYMENTS"
                    }, { status: 403 });
                }

                if (restrictions?.uploadsDisabled === true && isUploads) {
                    return NextResponse.json({
                        error: "File uploads are restricted for this store",
                        correlationId,
                        code: "STORE_RESTRICTED_UPLOADS"
                    }, { status: 403 });
                }

                if (restrictions?.aiDisabled === true && isAi) {
                    return NextResponse.json({
                        error: "AI features are restricted for this store",
                        correlationId,
                        code: "STORE_RESTRICTED_AI"
                    }, { status: 403 });
                }
            }
            // 2. RBAC
            if (!checkPermission(user.role, permission)) {
                logger.warn("Permission denied", ErrorCategory.SECURITY, {
                    userId: user.id,
                    storeId,
                    permission,
                    endpoint,
                    correlationId
                });
                return NextResponse.json({ error: "Forbidden: Insufficient permissions", correlationId, code: "FORBIDDEN" }, { status: 403 });
            }
            // 3. Step-up Auth (MFA/Sudo Mode)
            if (options.requireStepUp) {
                // Check database for active sudo session
                const sessionToken = req.cookies.get("vayva_session")?.value;
                if (sessionToken) {
                    const sessionData = await prisma.merchantSession.findUnique({
                        where: { token: sessionToken },
                        select: { sudoExpiresAt: true }
                    });
                    if (!sessionData?.sudoExpiresAt || sessionData.sudoExpiresAt < new Date()) {
                        logger.info("Step-up required for high-risk action", {
                            userId: user.id,
                            endpoint,
                            correlationId
                        });
                        return NextResponse.json({
                            error: "Step-up authentication required",
                            correlationId,
                            code: "STEP_UP_REQUIRED"
                        }, { status: 403 });
                    }
                }
            }
            // 4. Rate Limiting (Redis-based)
            const limitType = method === "GET" || method === "HEAD" ? "api_read" : "api_write";
            const rl = await checkRateLimit(storeId, limitType);
            if (!rl.success) {
                return NextResponse.json({ error: "Too Many Requests", correlationId, retryAfter: rl.reset, code: "RATE_LIMITED" }, {
                    status: 429,
                    headers: {
                        "X-RateLimit-Limit": rl.limit.toString(),
                        "X-RateLimit-Remaining": rl.remaining.toString(),
                        "X-RateLimit-Reset": rl.reset.toString(),
                        "Retry-After": rl.reset.toString()
                    }
                });
            }
            // 5. Idempotency (For State-Changing Methods)
            let idempotencyKey = null;
            if (["POST", "PUT", "PATCH"].includes(method)) {
                const { cached, key } = await verifyIdempotency(req);
                if (cached) {
                    logger.info("Idempotency hit", { key, endpoint, correlationId });
                    return cached;
                }
                idempotencyKey = key;
            }
            // 6. Execute Handler
            const rawParams = args[0]?.params || {};
            const params = rawParams instanceof Promise ? await rawParams : rawParams;
            const context = { user, storeId, params, correlationId };
            const response = await handler(req, context);
            // 7. Save Idempotency (if applicable)
            if (idempotencyKey && response.status < 500) {
                try {
                    const clonedRes = response.clone();
                    const bodyData = await clonedRes.json();
                    await saveIdempotencyResponse(idempotencyKey, response, bodyData);
                }
                catch (e: any) {
                    logger.warn("Failed to cache idempotency response", ErrorCategory.API, { error: e, correlationId });
                }
            }
            // Add correlation ID to response headers
            response.headers.set("X-Correlation-ID", correlationId);
            return response;
        }
        catch (error: any) {
            const status = error.message === "Unauthorized" ? 401 : 500;
            const category = status === 401 ? ErrorCategory.AUTH : ErrorCategory.API;
            logger.error(error.message || "Internal Server Error", category, error, {
                userId: user?.id,
                storeId: user?.storeId,
                endpoint,
                correlationId
            });
            return NextResponse.json({
                error: status === 401 ? "Unauthorized" : "Internal Server Error",
                correlationId,
                code: status === 401 ? "UNAUTHORIZED" : "INTERNAL_ERROR"
            }, { status });
        }
    };
}
