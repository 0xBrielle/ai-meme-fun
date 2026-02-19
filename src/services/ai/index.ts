import { AIGenerationRequest, AIGenerationResponse } from './types'
import { generateWithFal } from './fal'

export * from './types'

export async function generateImage(
    request: AIGenerationRequest
): Promise<AIGenerationResponse> {
    return generateWithFal(request)
}
