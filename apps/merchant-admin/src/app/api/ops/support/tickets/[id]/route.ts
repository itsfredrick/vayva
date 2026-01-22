import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import {
  ApiResponse,
  ApiErrorCode,
  RouteContext,
  TicketResponseData
} from "@vayva/shared";

export async function GET(
  _req: NextRequest,
  context: RouteContext<{ id: string }>
): Promise<NextResponse<ApiResponse<TicketResponseData>>> {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          error: { code: ApiErrorCode.UNAUTHORIZED, message: "Unauthorized" }
        },
        { status: 401 }
      );
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id },
      include: {
        store: {
          select: { name: true, category: true },
        },
        handoffEvents: true,
        // messages: true // Uncomment when TicketMessage model is fully unified
      },
    });

    if (!ticket) {
      return NextResponse.json(
        {
          success: false,
          error: { code: ApiErrorCode.NOT_FOUND, message: "Not Found" }
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ticket as unknown as TicketResponseData
    });
  } catch (error: unknown) {
    console.error("[TICKET_GET]", error);
    return NextResponse.json(
      {
        success: false,
        error: { code: ApiErrorCode.INTERNAL_SERVER_ERROR, message: "Internal Error" }
      },
      { status: 500 }
    );
  }
}
