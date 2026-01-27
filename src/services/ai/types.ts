export interface AIGenerationRequest {
    prompt: string
    inputImage?: string // Base64 string
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

export interface AIProvider {
    name: string
    generate: (request: AIGenerationRequest) => Promise<AIGenerationResponse>
}
