import { prisma } from "@vayva/db";
export class ReturnService {
    static async createRequest(storeId, orderId, customerPhone, payload) {
        // Check if exists
        const existing = await prisma.returnRequest.findFirst({
            where: { orderId: orderId, status: { not: "CANCELLED" } },
        });
        if (existing) {
            throw new Error("Return already active for this order");
        }
        const request = await prisma.returnRequest.create({
            data: {
                merchantId: storeId,
                orderId: orderId,
                // customerPhone mapped to notes or ignored (schema doesn't have it)
                // reason mapped to reasonText (schema has reasonCode enum and optional reasonText)
                reasonCode: "OTHER", // Defaulting as mapping 'reason' string to enum is complex without more logic
                reasonText: payload.reason,
                resolutionType: "REFUND", // Defaulting
                status: "REQUESTED",
                // items and logistics removed as they do not exist in schema
                /*
                        items: {
                            create: payload.items.map((i: unknown) => ({
                                qty: i.quantity || 1,
                            }))
                        },
                        logistics: payload.preferredMethod ? {
                            create: {
                                method: payload.preferredMethod === 'pickup' ? 'CARRIER' : 'DROPOFF',
                            }
                        } : undefined
                        */
            },
        });
        return request;
    }
    static async getRequests(storeId) {
        return prisma.returnRequest.findMany({
            where: { merchantId: storeId },
            orderBy: { createdAt: "desc" },
            // include: { items: true, logistics: true } // Removed
        });
    }
    static async updateStatus(requestId, status, actorId, data) {
        // Logic for specific status transitions
        await prisma.$transaction(async (tx: unknown) => {
            await tx.returnRequest.update({
                where: { id: requestId },
                data: {
                    status: status,
                    approvedAt: status === "APPROVED" ? new Date() : undefined,
                    completedAt: status === "COMPLETED" ? new Date() : undefined,
                },
            });
        });
    }
}
