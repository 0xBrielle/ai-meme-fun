import { env } from './env'

/**
 * API Error class for consistent error handling
 */
export class APIError extends Error {
    constructor(
        message: string,
        public status: number,
        public code?: string,
        public details?: unknown
    ) {
        super(message)
        this.name = 'APIError'
    }

    static fromResponse(response: Response, data?: unknown): APIError {
        const message =
            typeof data === 'object' && data && 'error' in data
                ? String((data as { error: string }).error)
                : response.statusText || 'Request failed'

        return new APIError(
            message,
            response.status,
            typeof data === 'object' && data && 'code' in data
                ? String((data as { code: string }).code)
                : undefined,
            data
        )
    }
}

/**
 * Request configuration options
 */
export interface RequestConfig {
    timeout?: number
    retries?: number
    retryDelay?: number
    headers?: Record<string, string>
}

/**
 * Default configuration
 */
const DEFAULT_CONFIG: Required<RequestConfig> = {
    timeout: env.apiTimeoutMs,
    retries: 3,
    retryDelay: 1000,
    headers: {},
}

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Create an AbortController with timeout
 */
function createTimeoutController(timeout: number): AbortController {
    const controller = new AbortController()
    setTimeout(() => controller.abort(), timeout)
    return controller
}

/**
 * Make an API request with automatic retries and timeout
 */
export async function apiRequest<T>(
    url: string,
    options: RequestInit = {},
    config: RequestConfig = {}
): Promise<T> {
    const { timeout, retries, retryDelay, headers } = {
        ...DEFAULT_CONFIG,
        ...config,
    }

    let lastError: Error | null = null

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const controller = createTimeoutController(timeout)

            // Handle relative URLs by prepending the API base URL
            let fullUrl = url
            if (url.startsWith('/')) {
                // If it's a relative path, use the configured API URL
                // If the configured API URL is relative, use the current origin in browser
                const baseUrl = env.apiUrl.startsWith('http')
                    ? env.apiUrl
                    : (typeof window !== 'undefined' ? window.location.origin : env.appUrl) + env.apiUrl

                fullUrl = baseUrl.endsWith('/') && url.startsWith('/')
                    ? baseUrl + url.slice(1)
                    : baseUrl + url
            }

            const response = await fetch(fullUrl, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                    ...options.headers,
                },
            })

            // Parse response
            const data = await response.json().catch(() => null)

            // Check for errors
            if (!response.ok) {
                throw APIError.fromResponse(response, data)
            }

            return data as T
        } catch (error) {
            lastError = error as Error

            // Don't retry on certain errors
            if (
                error instanceof APIError &&
                error.status >= 400 &&
                error.status < 500 &&
                error.status !== 429 // Rate limit - do retry
            ) {
                throw error
            }

            // Don't retry on abort (timeout)
            if ((error as Error).name === 'AbortError') {
                throw new APIError('Request timeout', 408, 'TIMEOUT')
            }

            // Wait before retry
            if (attempt < retries) {
                await sleep(retryDelay * (attempt + 1)) // Exponential backoff
            }
        }
    }

    throw lastError || new APIError('Request failed after retries', 500)
}

/**
 * Convenience methods for common HTTP methods
 */
export const api = {
    get: <T>(url: string, config?: RequestConfig) => apiRequest<T>(url, { method: 'GET' }, config),

    post: <T>(url: string, body?: unknown, config?: RequestConfig) =>
        apiRequest<T>(url, { method: 'POST', body: JSON.stringify(body) }, config),

    put: <T>(url: string, body?: unknown, config?: RequestConfig) =>
        apiRequest<T>(url, { method: 'PUT', body: JSON.stringify(body) }, config),

    patch: <T>(url: string, body?: unknown, config?: RequestConfig) =>
        apiRequest<T>(url, { method: 'PATCH', body: JSON.stringify(body) }, config),

    delete: <T>(url: string, config?: RequestConfig) => apiRequest<T>(url, { method: 'DELETE' }, config),
}
