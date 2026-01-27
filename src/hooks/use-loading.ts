'use client'

import { useState, useCallback } from 'react'
import { parseError } from '@/lib/errors'
import { showError } from '@/lib/toast'

interface LoadingState {
    isLoading: boolean
    error: string | null
    code: string | null
}

export function useLoading() {
    const [state, setState] = useState<LoadingState>({
        isLoading: false,
        error: null,
        code: null,
    })

    const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T | null> => {
        setState({ isLoading: true, error: null, code: null })
        try {
            const result = await fn()
            setState({ isLoading: false, error: null, code: null })
            return result
        } catch (error) {
            const parsed = parseError(error)
            setState({ isLoading: false, error: parsed.message, code: parsed.code })
            showError(parsed.message)
            return null
        }
    }, [])

    const reset = useCallback(() => {
        setState({ isLoading: false, error: null, code: null })
    }, [])

    return {
        ...state,
        withLoading,
        reset,
    }
}
