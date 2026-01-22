import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OpsAuthService } from "@/lib/ops-auth";
import { KycStatus } from "@vayva/db";
import { z } from "zod";
import {
    ApiResponse,
    ApiErrorCode,
    MerchantListResponseData,
    MerchantListItem,
    KycListResponseData,
    KycListItem,
    OpsUserListItem,
    UserCreateResult,
    OpsLoginResponseData
} from "@vayva/shared";

interface KycAuditItem {
    firstName?: string;
    lastName?: string;
    method?: string;
    provider?: string;
    [key: string]: unknown;
}

/**
 * handleGetMerchants
 */
export async function handleGetMerchants(
    request: NextRequest
): Promise<NextResponse<ApiResponse<MerchantListResponseData>>> {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.UNAUTHORIZED, message: "Unauthorized" }
            },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || "";

    try {
        const merchants = await prisma.store.findMany({
            where: {
                OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { slug: { contains: query, mode: "insensitive" } },
                ],
            },
            include: {
                kycRecord: true,
                aiSubscription: true,
            },
            orderBy: { createdAt: "desc" },
            take: 50,
        });

        const formatted: MerchantListItem[] = merchants.map((m) => {
            const aiSub = m.aiSubscription;
            const kyc = m.kycRecord;

            return {
                id: m.id,
                name: m.name,
                slug: m.slug,
                ownerEmail: "Unknown",
                plan: aiSub?.planKey || "FREE",
                kycStatus: kyc?.status || "PENDING",
                createdAt: m.createdAt.toISOString(),
                lastActive: m.updatedAt.toISOString(),
            };
        });

        return NextResponse.json({
            success: true,
            data: { merchants: formatted }
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.INTERNAL_SERVER_ERROR, message: "Internal server error" }
            },
            { status: 500 }
        );
    }
}

/**
 * handleGetKyc
 */
export async function handleGetKyc(
    request: NextRequest
): Promise<NextResponse<ApiResponse<KycListResponseData>>> {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.UNAUTHORIZED, message: "Unauthorized" }
            },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDING";

    try {
        const records = await prisma.kycRecord.findMany({
            where: { status: status as KycStatus },
            include: {
                store: {
                    include: {
                        aiSubscription: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
            take: 100,
        });

        const formatted: KycListItem[] = records.map((r) => {
            const auditData = (r.audit as unknown as KycAuditItem[]) || [];
            const latestAttempt =
                Array.isArray(auditData) && auditData.length > 0 ? auditData[auditData.length - 1] : {};

            const store = r.store;

            return {
                id: r.id,
                storeId: r.storeId,
                storeName: store?.name || "Unknown Store",
                ownerName: latestAttempt?.firstName
                    ? `${latestAttempt.firstName} ${latestAttempt.lastName}`
                    : "Merchant",
                method: latestAttempt?.method || "Unknown",
                provider: latestAttempt?.provider || "Internal",
                status: r.status,
                attemptTime: r.createdAt.toISOString(),
                plan: store?.aiSubscription?.planKey || "FREE",
            };
        });

        return NextResponse.json({
            success: true,
            data: { records: formatted }
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.INTERNAL_SERVER_ERROR, message: "Internal server error" }
            },
            { status: 500 }
        );
    }
}

/**
 * handleGetOpsUsers
 */
export async function handleGetOpsUsers(
    req: NextRequest
): Promise<NextResponse<ApiResponse<OpsUserListItem[]>>> {
    const session = await OpsAuthService.getSession();
    if (!session || !["OPS_OWNER", "OPS_ADMIN"].includes(session.user.role)) {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        await OpsAuthService.logEvent(
            session?.user?.id || null,
            "OPS_UNAUTHORIZED_ACCESS",
            {
                ip,
                path: req.nextUrl.pathname,
                method: "GET",
                reason: "Role mismatch",
            },
        );
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.FORBIDDEN, message: "Unauthorized" }
            },
            { status: 403 }
        );
    }

    const users = await prisma.opsUser.findMany({
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const formatted: OpsUserListItem[] = users.map(u => ({
        ...u,
        lastLoginAt: u.lastLoginAt?.toISOString() || null,
        createdAt: u.createdAt.toISOString(),
    }));

    return NextResponse.json({
        success: true,
        data: formatted
    });
}

const createSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1),
    role: z.enum(["OPS_ADMIN", "OPS_AGENT", "OPS_READONLY"]),
});

/**
 * handleCreateOpsUser
 */
export async function handleCreateOpsUser(
    req: NextRequest
): Promise<NextResponse<ApiResponse<UserCreateResult>>> {
    const session = await OpsAuthService.getSession();
    if (!session || session.user.role !== "OPS_OWNER") {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
        await OpsAuthService.logEvent(
            session?.user?.id || null,
            "OPS_UNAUTHORIZED_ACCESS",
            {
                ip,
                path: req.nextUrl.pathname,
                method: "POST",
                reason: "Not Owner",
            },
        );
        return NextResponse.json(
            {
                success: false,
                error: {
                    code: ApiErrorCode.FORBIDDEN,
                    message: "Unauthorized. Only Owner can create users."
                }
            },
            { status: 403 }
        );
    }

    try {
        const body = await req.json();
        const data = createSchema.parse(body);

        const { user, tempPassword } = await OpsAuthService.createUser(
            session.user.role,
            data,
        );

        await OpsAuthService.logEvent(session.user.id, "OPS_USER_CREATED", {
            targetUser: user.email,
            role: user.role,
        });

        return NextResponse.json({
            success: true,
            data: { user, tempPassword }
        });
    } catch (e: unknown) {
        console.error(e);
        const error = e instanceof Error ? e.message : "Internal Server Error";
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.VALIDATION_ERROR, message: error }
            },
            { status: 400 }
        );
    }
}

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

/**
 * handleOpsLogin
 */
export async function handleOpsLogin(
    req: NextRequest
): Promise<NextResponse<ApiResponse<OpsLoginResponseData>>> {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

    // 1. Rate Limiting Check
    if (await OpsAuthService.isRateLimited(ip)) {
        await OpsAuthService.logEvent(null, "OPS_LOGIN_BLOCKED", {
            ip,
            reason: "Rate limit exceeded",
        });
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.RATE_LIMIT_EXCEEDED, message: "Too many attempts. Please try again in 15 minutes." }
            },
            { status: 429 },
        );
    }

    try {
        // Just-in-time bootstrap check
        await OpsAuthService.bootstrapOwner();

        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        try {
            const user = await OpsAuthService.login(email, password);

            if (!user) {
                // Audit Failed Login (Invalid Credentials)
                await OpsAuthService.logEvent(null, "OPS_LOGIN_FAILED", {
                    ip,
                    email,
                    reason: "Invalid credentials",
                });
                return NextResponse.json(
                    {
                        success: false,
                        error: { code: ApiErrorCode.UNAUTHORIZED, message: "Invalid credentials" }
                    },
                    { status: 401 },
                );
            }

            return NextResponse.json({
                success: true,
                data: { success: true, role: user.role }
            });
        } catch (authError: unknown) {
            // Handle known auth errors (e.g. Disabled Account)
            const error = authError as Error;
            if (error.message === "Account disabled") {
                await OpsAuthService.logEvent(null, "OPS_LOGIN_FAILED", {
                    ip,
                    email,
                    reason: "Account disabled",
                });
                return NextResponse.json(
                    {
                        success: false,
                        error: { code: ApiErrorCode.FORBIDDEN, message: "Account disabled" }
                    },
                    { status: 403 },
                );
            }
            throw error;
        }
    } catch (err: unknown) {
        console.error(err);
        return NextResponse.json(
            {
                success: false,
                error: { code: ApiErrorCode.VALIDATION_ERROR, message: "Invalid request" }
            },
            { status: 400 }
        );
    }
}
