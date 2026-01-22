import { NextRequest, NextResponse } from "next/server";
import { requireAuth, SessionUser } from "./session";
import { can as checkPermission } from "./team/permissions";
import { checkRateLimit } from "./ratelimit";
import { verifyIdempotency, saveIdempotencyResponse } from "./idempotency";
import { logger, ErrorCategory } from "./logger";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@vayva/db";

/**
 * Unified context for Vayva API Handlers
 */
export interface HandlerContext {
    user: SessionUser;
    storeId: string;
    params: unknown;
    correlationId: string;
}

export interface HandlerOptions {
    requireStepUp?: boolean;
}

type VayvaHandler = (
    req: NextRequest,
    context: HandlerContext
) => Promise<NextResponse> | NextResponse;

/**
 * Robust Higher-Order Function for Vayva API Hardening.
 * Implements: Auth, RBAC, Tenant Isolation, Rate Limiting, Idempotency, Step-up, and Structured Logging.
 */
export function withVayvaAPI(permission: string, handler: VayvaHandler, options: HandlerOptions = {}) {
    return async (req: NextRequest, ...args: unknown[]) => {
        const correlationId = uuidv4();
        const method = req.method;
        const endpoint = req.nextUrl.pathname;
        let user: SessionUser | undefined;

        try {
            // 1. Authentication & Tenant Isolation
            user = await requireAuth();
            const storeId = user.storeId;

            // 2. RBAC
            if (!checkPermission(user.role, permission)) {
                logger.warn("Permission denied", ErrorCategory.SECURITY, {
                    userId: user.id,
                    storeId,
                    permission,
                    endpoint,
                    correlationId
                });
                return NextResponse.json(
                    { error: "Forbidden: Insufficient permissions", correlationId, code: "FORBIDDEN" },
                    { status: 403 }
                );
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
                        return NextResponse.json(
                            {
                                error: "Step-up authentication required",
                                correlationId,
                                code: "STEP_UP_REQUIRED"
                            },
                            { status: 403 }
                        );
                    }
                }
            }

            // 4. Rate Limiting (Redis-based)
            const limitType = method === "GET" || method === "HEAD" ? "api_read" : "api_write";
            const rl = await checkRateLimit(storeId, limitType);
            if (!rl.success) {
                return NextResponse.json(
                    { error: "Too Many Requests", correlationId, retryAfter: rl.reset, code: "RATE_LIMITED" },
                    {
                        status: 429,
                        headers: {
                            "X-RateLimit-Limit": rl.limit.toString(),
                            "X-RateLimit-Remaining": rl.remaining.toString(),
                            "X-RateLimit-Reset": rl.reset.toString(),
                            "Retry-After": rl.reset.toString()
                        }
                    }
                );
            }

            // 5. Idempotency (For State-Changing Methods)
            let idempotencyKey: string | null = null;
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
            const context: HandlerContext = { user, storeId, params, correlationId };

            const response = await handler(req, context);

            // 7. Save Idempotency (if applicable)
            if (idempotencyKey && response.status < 500) {
                try {
                    const clonedRes = response.clone();
                    const bodyData = await clonedRes.json();
                    await saveIdempotencyResponse(idempotencyKey, response, bodyData);
                } catch (e) {
                    logger.warn("Failed to cache idempotency response", ErrorCategory.API, { error: e, correlationId });
                }
            }

            // Add correlation ID to response headers
            response.headers.set("X-Correlation-ID", correlationId);
            return response;

        } catch (error: unknown) {
            const status = error.message === "Unauthorized" ? 401 : 500;
            const category = status === 401 ? ErrorCategory.AUTH : ErrorCategory.API;

            logger.error(error.message || "Internal Server Error", category, error, {
                userId: user?.id,
                storeId: user?.storeId,
                endpoint,
                correlationId
            });

            return NextResponse.json(
                {
                    error: status === 401 ? "Unauthorized" : "Internal Server Error",
                    correlationId,
                    code: status === 401 ? "UNAUTHORIZED" : "INTERNAL_ERROR"
                },
                { status }
            );
        }
    };
}
