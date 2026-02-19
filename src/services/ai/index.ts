import { AIGenerationRequest, AIGenerationResponse } from './types'
import { generateWithFal } from './fal'

export * from './types'

// Image generation — routes to Nano Banana by default
export async function generateImage(
    request: AIGenerationRequest & { model?: string; type?: string }
): Promise<AIGenerationResponse> {
    return generateWithFal({
        ...request,
        model: request.model ?? 'fal-ai/nano-banana',
    })
}

// Video generation — routes to Veo3 by default
export async function generateVideo(
    request: AIGenerationRequest & { model?: string; type?: string; durationSeconds?: number }
): Promise<AIGenerationResponse> {
    return generateWithFal({
        ...request,
        model: request.model ?? 'fal-ai/veo3',
    })
}
