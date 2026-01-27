export interface Generation {
    id: string
    type: 'image' | 'video'
    prompt: string
    inputImageUrl: string | null
    outputUrl: string
    templateId: string | null
    creditsUsed: number
    processingTimeMs: number | null
    createdAt: string
    expiresAt: string
}

export interface GenerationRequest {
    prompt: string
    inputImage?: string // Base64 or URL
    templateId?: string
    type?: 'image' | 'video'
}

export interface GenerationResult {
    success: boolean
    generation?: Generation
    error?: string
}

export interface GenerationProgress {
    status: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'
    progress: number // 0-100
    message: string
}
