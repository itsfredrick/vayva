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
import * as Sentry from "@sentry/nextjs";
import { v4 as uuidv4 } from "uuid";
class ApiClient {
    constructor(baseURL = "") {
        this.defaultRetries = 3;
        this.defaultRetryDelay = 1000;
        this.defaultTimeout = 30000;
        this.requestInterceptors = [];
        this.responseInterceptors = [];
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
    async get(url, config) {
        return this.request(url, { ...config, method: "GET" });
    }
    /**
     * Make a POST request
     */
    async post(url, data, config) {
        return this.request(url, {
            ...config,
            method: "POST",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    /**
     * Make a PUT request
     */
    async put(url, data, config) {
        return this.request(url, {
            ...config,
            method: "PUT",
            body: data ? JSON.stringify(data) : undefined,
        });
    }
    /**
     * Make a DELETE request
     */
    async delete(url, config) {
        return this.request(url, { ...config, method: "DELETE" });
    }
    /**
     * Core request method with retry logic
     */
    async request(url, config = {}) {
        let { retry = this.defaultRetries, retryDelay = this.defaultRetryDelay, timeout = this.defaultTimeout, ...fetchConfig } = config;
        // Apply Request Interceptors
        for (const interceptor of this.requestInterceptors) {
            fetchConfig = await interceptor(fetchConfig);
        }
        const fullURL = this.baseURL + url;
        let lastError = null;
        // Retry loop
        for (let attempt = 0; attempt <= retry; attempt++) {
            try {
                // Create abort controller for timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                // Make request
                let response = await fetch(fullURL, {
                    ...fetchConfig,
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                // Apply Response Interceptors
                for (const interceptor of this.responseInterceptors) {
                    response = await interceptor(response);
                }
                // Handle non-OK responses
                if (!response.ok) {
                    const error = await this.handleErrorResponse(response);
                    // Don't retry client errors (4xx) unless strict idempotency is handled elsewhere (usually safe not to retry 4xx)
                    // 429 Too Many Requests could be an exception, but usually better handled by caller or specific logic
                    if (response.status >= 400 && response.status < 500) {
                        throw error;
                    }
                    // Retry server errors (5xx)
                    lastError = error;
                    if (attempt < retry) {
                        await this.delay(retryDelay * Math.pow(2, attempt)); // Exponential backoff
                        continue;
                    }
                    throw error;
                }
                // Parse response
                const data = await this.parseResponse(response);
                return data;
            }
            catch (error) {
                // Handle abort/timeout
                if (error.name === "AbortError") {
                    const timeoutError = new Error("Request timeout");
                    timeoutError.status = 408;
                    timeoutError.code = "TIMEOUT";
                    lastError = timeoutError;
                }
                else {
                    lastError = error;
                }
                // Retry on network errors
                if (attempt < retry) {
                    await this.delay(retryDelay * Math.pow(2, attempt));
                    continue;
                }
            }
        }
        // All retries failed
        throw lastError || new Error("Request failed");
    }
    /**
     * Parse response based on content type
     */
    async parseResponse(response) {
        const contentType = response.headers.get("content-type");
        if (contentType?.includes("application/json")) {
            return response.json();
        }
        if (contentType?.includes("text/")) {
            return response.text();
        }
        return response.blob();
    }
    /**
     * Handle error responses
     */
    async handleErrorResponse(response) {
        let errorData = {};
        try {
            errorData = await response.json();
        }
        catch {
            // Response is not JSON
            errorData = { error: response.statusText };
        }
        const error = new Error(errorData.error || "Request failed");
        error.status = response.status;
        error.code = errorData.code;
        error.details = errorData.details;
        error.correlationId = response.headers.get("x-correlation-id") || undefined;
        // Log error to console in development
        if (process.env.NODE_ENV === "development") {
            console.error("API Error:", {
                url: response.url,
                status: response.status,
                error: errorData,
                correlationId: error.correlationId
            });
        }
        // Capture to Sentry
        Sentry.captureException(error, {
            extra: {
                url: response.url,
                status: response.status,
                method: "API_CALL", // Contextualize
                correlationId: error.correlationId,
                details: errorData
            }
        });
        return error;
    }
    /**
     * Delay helper for retry backoff
     */
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    /**
     * Add request interceptor
     */
    addRequestInterceptor(interceptor) {
        this.requestInterceptors.push(interceptor);
    }
    /**
     * Add response interceptor
     */
    addResponseInterceptor(interceptor) {
        this.responseInterceptors.push(interceptor);
    }
}
// Export singleton instance
export const apiClient = new ApiClient();
// Export class for custom instances
export { ApiClient };
