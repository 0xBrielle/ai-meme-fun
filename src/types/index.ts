export * from './generation'
export * from './template'

// Common types
export interface ApiResponse<T> {
    success: boolean
    data?: T
    error?: string
}

export type Platform = 'web' | 'ios' | 'android'
