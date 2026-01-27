import { NextResponse } from "next/server";
import { prisma } from "@vayva/db";
import { OpsAuthService } from "@/lib/ops-auth";

export async function GET() {
    const session = await OpsAuthService.getSession();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Generate alerts based on real data conditions
        const alerts: any[] = [];

        // Check for failed payments in last 24h
        const failedPayments = await prisma.order.count({
            where: {
                paymentStatus: "FAILED",
                createdAt: { gte: twentyFourHoursAgo }
            }
        });

        if (failedPayments > 10) {
            alerts.push({
                id: "alert-failed-payments",
                type: "critical",
                category: "payment",
                title: "High Payment Failure Rate",
                message: `${failedPayments} payment failures in the last 24 hours. Check Paystack integration.`,
                timestamp: now.toISOString(),
                acknowledged: false,
            });
        } else if (failedPayments > 5) {
            alerts.push({
                id: "alert-failed-payments",
                type: "warning",
                category: "payment",
                title: "Elevated Payment Failures",
                message: `${failedPayments} payment failures in the last 24 hours.`,
                timestamp: now.toISOString(),
                acknowledged: false,
            });
        }

        // Check for pending KYC reviews
        const pendingKYC = await prisma.store.count({
            where: {
                wallet: {
                    kycStatus: "PENDING"
                }
            }
        });

        if (pendingKYC > 20) {
            alerts.push({
                id: "alert-pending-kyc",
                type: "warning",
                category: "merchant",
                title: "KYC Queue Backlog",
                message: `${pendingKYC} merchants awaiting KYC review.`,
                timestamp: now.toISOString(),
                acknowledged: false,
            });
        }

        // Check for pending marketplace listings
        const pendingListings = await prisma.marketplaceListing.count({
            where: { status: "PENDING_REVIEW" }
        });

        if (pendingListings > 50) {
            alerts.push({
                id: "alert-pending-listings",
                type: "warning",
                category: "order",
                title: "Marketplace Moderation Backlog",
                message: `${pendingListings} listings pending review.`,
                timestamp: now.toISOString(),
                acknowledged: false,
            });
        }

        // Check for expiring trials
        const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const expiringTrials = await prisma.merchantAiSubscription.count({
            where: {
                status: "trial",
                trialExpiresAt: {
                    gte: now,
                    lte: sevenDaysFromNow,
                }
            }
        });

        if (expiringTrials > 10) {
            alerts.push({
                id: "alert-expiring-trials",
                type: "info",
                category: "merchant",
                title: "Trials Expiring Soon",
                message: `${expiringTrials} merchant trials expiring in the next 7 days.`,
                timestamp: now.toISOString(),
                acknowledged: false,
            });
        }

        // Calculate stats
        const stats = {
            critical: alerts.filter(a => a.type === "critical").length,
            warning: alerts.filter(a => a.type === "warning").length,
            info: alerts.filter(a => a.type === "info").length,
            resolved24h: 0, // Would need an alerts table to track this
        };

        // System status (mock for now - would integrate with actual health checks)
        const systemStatus = [
            { service: "API Gateway", status: "operational", latency: 45, lastCheck: now.toISOString() },
            { service: "Database", status: "operational", latency: 12, lastCheck: now.toISOString() },
            { service: "Paystack", status: "operational", latency: 230, lastCheck: now.toISOString() },
            { service: "WhatsApp", status: "operational", latency: 180, lastCheck: now.toISOString() },
        ];

        return NextResponse.json({
            alerts,
            systemStatus,
            stats,
        });
    } catch (error: any) {
        console.error("Alerts error:", error);
        return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
    }
}
