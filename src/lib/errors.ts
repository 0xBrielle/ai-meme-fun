/**
 * Base application error
 */
export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public userMessage: string,
        public recoverable: boolean = true
    ) {
        super(message)
        this.name = 'AppError'
    }
}

/**
 * Error codes and their user-friendly messages
 */
export const ERROR_CODES = {
    // Network errors
    NETWORK_ERROR: {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect. Please check your internet connection.',
        recoverable: true,
    },
    TIMEOUT: {
        code: 'TIMEOUT',
        message: 'Request timed out. Please try again.',
        recoverable: true,
    },

    // AI generation errors
    GENERATION_FAILED: {
        code: 'GENERATION_FAILED',
        message: 'Generation failed. Please try again with a different prompt.',
        recoverable: true,
    },
    CONTENT_FILTERED: {
        code: 'CONTENT_FILTERED',
        message: 'Your prompt was flagged by our content filter. Please try a different prompt.',
        recoverable: true,
    },
    MODEL_UNAVAILABLE: {
        code: 'MODEL_UNAVAILABLE',
        message: 'The AI model is temporarily unavailable. Please try again later.',
        recoverable: true,
    },

    // Image errors
    IMAGE_TOO_LARGE: {
        code: 'IMAGE_TOO_LARGE',
        message: 'Image is too large. Please use an image under 10MB.',
        recoverable: true,
    },
    INVALID_IMAGE_FORMAT: {
        code: 'INVALID_IMAGE_FORMAT',
        message: 'Invalid image format. Please use JPG, PNG, or WebP.',
        recoverable: true,
    },

    // Credits (Phase 2+)
    INSUFFICIENT_CREDITS: {
        code: 'INSUFFICIENT_CREDITS',
        message: 'Not enough credits. Please purchase more to continue.',
        recoverable: true,
    },

    // General
    UNKNOWN_ERROR: {
        code: 'UNKNOWN_ERROR',
        message: 'Something went wrong. Please try again.',
        recoverable: true,
    },
} as const

export type ErrorCode = keyof typeof ERROR_CODES

/**
 * Create an AppError from an error code
 */
export function createError(code: ErrorCode, originalMessage?: string): AppError {
    const errorDef = ERROR_CODES[code]
    return new AppError(
        originalMessage || errorDef.message,
        errorDef.code,
        errorDef.message,
        errorDef.recoverable
    )
}

/**
 * Parse any error into a user-friendly format
 */
export function parseError(error: unknown): { message: string; code: string; recoverable: boolean } {
    if (error instanceof AppError) {
        return {
            message: error.userMessage,
            code: error.code,
            recoverable: error.recoverable,
        }
    }

    if (error instanceof Error) {
        // Try to match known error patterns
        const message = error.message.toLowerCase()

        if (message.includes('network') || message.includes('fetch')) {
            return parseError(createError('NETWORK_ERROR'))
        }
        if (message.includes('timeout') || message.includes('abort')) {
            return parseError(createError('TIMEOUT'))
        }
        if (message.includes('nsfw') || message.includes('content') || message.includes('safety')) {
            return parseError(createError('CONTENT_FILTERED'))
        }

        return {
            message: error.message,
            code: 'UNKNOWN_ERROR',
            recoverable: true,
        }
    }

    return {
        message: ERROR_CODES.UNKNOWN_ERROR.message,
        code: 'UNKNOWN_ERROR',
        recoverable: true,
    }
}
