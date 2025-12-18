import { prisma } from '@vayva/db';
// Using any for some types if they are strings in schema now

export class ReturnService {

    async createReturnRequest(data: {
        merchantId: string;
        orderId: string;
        customerId?: string;
        customerPhone?: string;
        reasonCode: any;
        reasonText?: string;
        resolutionType: any;
        items: any;
        logistics: {
            method: any;
            pickupAddress?: any;
            dropoffInstructions?: string;
        }
    }) {
        return (prisma as any).returnRequestV2.create({
            data: {
                merchantId: data.merchantId,
                storeId: data.merchantId, // Using merchantId as storeId for V1
                orderId: data.orderId,
                customerPhone: data.customerPhone || '',
                reason: data.reasonCode + (data.reasonText ? `: ${data.reasonText}` : ''),
                notes: data.reasonText,
                items: data.items,
                pickupMethod: data.logistics.method,
                pickupAddress: data.logistics.pickupAddress,
                status: 'requested'
            }
        });
    }

    async updateStatus(returnId: string, status: any) {
        return (prisma as any).returnRequestV2.update({
            where: { id: returnId },
            data: {
                status,
                decidedAt: status === 'approved' ? new Date() : undefined
            }
        });
    }

    async getReturnRequests(merchantId: string) {
        return (prisma as any).returnRequestV2.findMany({
            where: { merchantId },
            orderBy: { createdAt: 'desc' }
        });
    }
}

export const returnService = new ReturnService();
