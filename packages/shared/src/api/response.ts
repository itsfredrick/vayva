import { ApiErrorCode, ApiResponse } from "./types";

export function apiError(
  code: ApiErrorCode | string,
  message: string,
  details?: unknown,
): ApiResponse<never> {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
  };
}
