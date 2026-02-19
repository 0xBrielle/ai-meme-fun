export interface AIGenerationRequest {
    prompt: string
    inputImage?: string
    model?: string             // FAL model endpoint
    type?: string              // generation type string
    durationSeconds?: number   // for video
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
