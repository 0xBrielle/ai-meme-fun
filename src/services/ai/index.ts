import { AIGenerationRequest, AIGenerationResponse } from './types'
import { generateWithReplicate } from './replicate'
import { generateWithFal } from './fal'

export * from './types'

export async function generateImage(
    request: AIGenerationRequest,
    provider: 'replicate' | 'fal' = 'replicate'
): Promise<AIGenerationResponse> {
    if (provider === 'fal') {
        return generateWithFal(request)
    }

    // Default to replicate
    const result = await generateWithReplicate(request)

    // Fallback to fal if replicate fails and is enabled (logic could be more complex here)
    if (!result.success) {
        console.warn('Replicate failed, trying Fal fallback...', result.error)
        return generateWithFal(request)
    }

    return result
}
