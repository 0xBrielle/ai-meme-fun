export interface AIGenerationRequest {
    prompt: string
    inputImage?: string
    model?: string
    type?: string
    durationSeconds?: number
    generateAudio?: boolean        // VEO3 only — default true
    aspectRatio?: string
    resolution?: string            // '1k'|'2k'|'4k' for images, '720p'|'1080p' for video
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
