export interface AIGenerationRequest {
    prompt: string
    inputImage?: string
    model?: string
    type?: string
    durationSeconds?: number
    aspectRatio?: string    // e.g. '16:9', '1:1', '9:16'
    resolution?: string     // '1k' | '2k' | '4k'
    width?: number
    height?: number
    numOutputs?: number
}

export interface AIGenerationResponse {
    success: boolean
    outputUrls?: string[]
    error?: string
    processingTimeMs?: number
}
