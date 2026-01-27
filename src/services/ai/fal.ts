import { api } from '@/lib/api-client'
import { AIGenerationRequest, AIGenerationResponse } from './types'

export async function generateWithFal(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const startTime = Date.now()

    try {
        const data: any = await api.post('/generate', {
            provider: 'fal',
            ...request,
        })

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
