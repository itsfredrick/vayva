import { NextResponse } from "next/server";
import { ApiResponse } from "../api/types";

/**
 * Next.js App Router Route Context
 */
export interface RouteContext<P = Record<string, string>> {
    params: Promise<P>;
}

/**
 * Standard Helper to create NextResponses with strict typing
 */
export type ApiHandlerResponse<T> = Promise<NextResponse<ApiResponse<T>>>;
