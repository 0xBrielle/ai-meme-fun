import { create } from 'zustand'
import { GenerationProgress, Generation } from '@/types'

interface GenerationState {
    // Current generation
    isGenerating: boolean
    progress: GenerationProgress
    currentResult: Generation | null
    error: string | null

    // Actions
    startGeneration: () => void
    updateProgress: (progress: Partial<GenerationProgress>) => void
    setResult: (result: Generation) => void
    setError: (error: string) => void
    reset: () => void
}

export const useGenerationStore = create<GenerationState>((set) => ({
    isGenerating: false,
    progress: {
        status: 'idle',
        progress: 0,
        message: '',
    },
    currentResult: null,
    error: null,

    startGeneration: () =>
        set({
            isGenerating: true,
            progress: { status: 'processing', progress: 0, message: 'Starting...' },
            error: null,
        }),

    updateProgress: (progress) =>
        set((state) => ({
            progress: { ...state.progress, ...progress },
        })),

    setResult: (result) =>
        set({
            isGenerating: false,
            progress: { status: 'completed', progress: 100, message: 'Done!' },
            currentResult: result,
        }),

    setError: (error) =>
        set({
            isGenerating: false,
            progress: { status: 'failed', progress: 0, message: error },
            error,
        }),

    reset: () =>
        set({
            isGenerating: false,
            progress: { status: 'idle', progress: 0, message: '' },
            currentResult: null,
            error: null,
        }),
}))
