import { api } from '@/lib/api-client'
import { AIGenerationRequest, AIGenerationResponse } from './types'

export async function generateWithFal(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const startTime = Date.now()

    // VEO3 can take up to 4 minutes — use 310s timeout (just over server maxDuration=300)
    // retries: 0 prevents duplicate video jobs from firing on timeout
    const isVideo = request.type?.includes('video')
    const requestConfig = isVideo
        ? { timeout: 310_000, retries: 0 }
        : { timeout: 60_000, retries: 1 }

    try {
        const data: any = await api.post('/generate', {
            provider: 'fal',
            model: request.model,
            type: request.type,
            durationSeconds: request.durationSeconds,
            ...request,
        }, requestConfig)

        return {
            success: true,
            outputUrls: data.output,
            processingTimeMs: Date.now() - startTime,
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        }
    }
}
