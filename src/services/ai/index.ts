import { AIGenerationRequest, AIGenerationResponse } from './types'
import { generateWithFal } from './fal'

export * from './types'

// Image generation — routes to Nano Banana by default (handled in route.ts)
export async function generateImage(
    request: AIGenerationRequest & { model?: string; type?: string }
): Promise<AIGenerationResponse> {
    return generateWithFal(request)
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
