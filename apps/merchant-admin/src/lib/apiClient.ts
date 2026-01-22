/**
 * API Client Utility
 *
 * Centralized API client with error handling, retry logic, and request/response interceptors.
 *
 * Features:
 * - Automatic retry on failure
 * - Error handling and logging
 * - Request/response interceptors
 * - TypeScript support
 * - Loading state management
 *
 * Usage:
 * ```typescript
 * import { apiClient } from '@/lib/apiClient';
 *
 * const data = await apiClient.get('/api/orders');
 * const newOrder = await apiClient.post('/api/orders', { ... });
 * ```
 */

import { ApiResponse } from "@vayva/shared";
import { v4 as uuidv4 } from "uuid";

interface RequestConfig extends RequestInit {
  retry?: number;
  retryDelay?: number;
  timeout?: number;
  _retryCount?: number;
}

interface ApiError extends Error {
  status?: number;
  code?: string;
  details?: unknown;
  correlationId?: string;
}

type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>;
type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

class ApiClient {
  private baseURL: string;
  private defaultRetries: number = 3;
  private defaultRetryDelay: number = 1000;
  private defaultTimeout: number = 30000;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor(baseURL: string = "") {
    this.baseURL = baseURL;

    // Default Request Interceptor: Trace ID & Context
    this.addRequestInterceptor((config) => {
      const headers = new Headers(config.headers);
      if (!headers.has("x-correlation-id")) {
        headers.set("x-correlation-id", uuidv4());
      }
      if (!headers.has("Content-Type") && config.method !== "GET") {
        headers.set("Content-Type", "application/json");
      }
      return { ...config, headers };
    });
  }

  /**
   * Make a GET request
   */
  async get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  /**
   * Make a POST request
   */
  async post<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a PUT request
   */
  async put<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a PATCH request
   */
  async patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: RequestConfig,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Make a DELETE request
   */
  async delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }

  /**
   * Core request method with retry logic
   */
  private async request<T>(
    url: string,
    config: RequestConfig = {},
  ): Promise<ApiResponse<T>> {
    const {
      retry = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      timeout = this.defaultTimeout,
      ...fetchConfig
    } = config;
    let finalFetchConfig = fetchConfig;

    // Apply Request Interceptors
    for (const interceptor of this.requestInterceptors) {
      finalFetchConfig = await interceptor(finalFetchConfig);
    }

    const fullURL = this.baseURL + url;
    let lastError: ApiResponse<T> | null = null;

    // Retry loop
    for (let attempt = 0; attempt <= retry; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        let response = await fetch(fullURL, {
          ...finalFetchConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Apply Response Interceptors
        for (const interceptor of this.responseInterceptors) {
          response = await interceptor(response);
        }

        // Handle non-OK responses explicitly as ApiResponse objects
        if (!response.ok) {
          const errorResponse = await this.handleErrorResponse<T>(response);

          // Retry on server errors (5xx)
          if (response.status >= 500 && attempt < retry) {
            await this.delay(retryDelay * Math.pow(2, attempt));
            lastError = errorResponse;
            continue;
          }

          return errorResponse;
        }

        return await this.parseResponse<T>(response);
      } catch (err: unknown) {
        const error = err as Error;
        const apiError: ApiResponse<T> = {
          success: false,
          error: {
            code: error.name === "AbortError" ? "TIMEOUT" : "NETWORK_ERROR",
            message: error.message || "Request failed"
          }
        };

        if (attempt < retry) {
          await this.delay(retryDelay * Math.pow(2, attempt));
          lastError = apiError;
          continue;
        }
        return apiError;
      }
    }

    return lastError || {
      success: false,
      error: { code: "UNKNOWN", message: "Request failed after retries" }
    };
  }

  /**
   * Parse response
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");

    try {
      if (contentType?.includes("application/json")) {
        const data = await response.json();
        return data as ApiResponse<T>;
      }

      const text = await response.text();
      return { success: true, data: text as unknown as T };
    } catch {
      return {
        success: false,
        error: { code: "PARSE_ERROR", message: "Failed to parse response" }
      };
    }
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const errorData = await response.json();
      return errorData as ApiResponse<T>;
    } catch {
      return {
        success: false,
        error: {
          code: "HTTP_" + response.status,
          message: response.statusText || "Request failed"
        }
      };
    }
  }

  /**
   * Delay helper for retry backoff
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.push(interceptor);
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };

// Export types
export type { RequestConfig, ApiError };
