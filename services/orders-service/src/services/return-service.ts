import {
  prisma,
  Prisma,
  ReturnStatus,
  ReturnReason,
  ReturnResolution,
  ReturnMethod,
} from "@vayva/db";

export interface CreateReturnRequestData {
  merchantId: string;
  orderId: string;
  customerId?: string;
  customerPhone?: string;
  reasonCode: ReturnReason;
  reasonText?: string;
  resolutionType: ReturnResolution;
  items: Array<{ orderItemId?: string; qty: number }>;
  logistics: {
    method: ReturnMethod;
    pickupAddress?: Prisma.InputJsonValue;
    dropoffInstructions?: string;
  };
}

export class ReturnService {
  async createReturnRequest(data: CreateReturnRequestData) {
    return await prisma.$transaction(async tx => {
      const request = await tx.returnRequest.create({
        data: {
          merchantId: data.merchantId,
          orderId: data.orderId,
          customerId: data.customerId,
          reasonCode: data.reasonCode,
          reasonText: data.reasonText,
          resolutionType: data.resolutionType,
          status: ReturnStatus.REQUESTED,
        },
      });

      if (Array.isArray(data.items)) {
        for (const item of data.items) {
          await tx.returnItem.create({
            data: {
              returnRequestId: request.id,
              orderItemId: item.orderItemId,
              qty: item.qty,
            },
          });
        }
      }

      await tx.returnLogistics.create({
        data: {
          returnRequestId: request.id,
          method: data.logistics.method,
          pickupAddress: data.logistics.pickupAddress,
          dropoffInstructions: data.logistics.dropoffInstructions,
        },
      });

      return request;
    });
  }

  async updateStatus(returnId: string, status: ReturnStatus) {
    return await prisma.returnRequest.update({
      where: { id: returnId },
      data: {
        status,
        ...(status === ReturnStatus.APPROVED ? { approvedAt: new Date() } : {}),
        ...(status === ReturnStatus.COMPLETED
          ? { completedAt: new Date() }
          : {}),
      },
    });
  }

  async getReturnRequests(merchantId: string) {
    return await prisma.returnRequest.findMany({
      where: { merchantId },
      orderBy: { createdAt: "desc" },
    });
  }
}

export const returnService = new ReturnService();
