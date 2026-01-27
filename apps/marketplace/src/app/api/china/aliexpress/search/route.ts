import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, ApiErrorCode } from "@vayva/shared";
import { createAliExpressProvider } from "@/services/china/aliexpress/provider";
import type { AliExpressSearchResponse } from "@/services/china/aliexpress/types";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<AliExpressSearchResponse>>> {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(searchParams.get("page") || 1) || 1);
  const limit = Math.min(40, Math.max(5, Number(searchParams.get("limit") || 20) || 20));

  if (!query) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.VALIDATION_ERROR,
          message: "Query is required",
        },
      },
      { status: 400 },
    );
  }

  try {
    const provider = createAliExpressProvider();

    if (!provider.isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_CONFIGURED",
            message: "AliExpress provider is not configured",
          },
          meta: {
            configured: false,
          },
        },
        { status: 200 },
      );
    }

    const data = await provider.search({ query, page, limit });

    return NextResponse.json({
      success: true,
      data,
      meta: {
        configured: true,
      },
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: ApiErrorCode.INTERNAL_SERVER_ERROR,
          message: "AliExpress search failed",
        },
      },
      { status: 500 },
    );
  }
}
