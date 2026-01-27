import { api } from '@/lib/api-client'
import { AIGenerationRequest, AIGenerationResponse } from './types'
import { delay } from '@/lib/utils'

async function pollPrediction(predictionId: string): Promise<any> {
    const maxAttempts = 120 // 2 minutes
    for (let i = 0; i < maxAttempts; i++) {
        const data: any = await api.get(`/api/generate/poll?id=${predictionId}`)
        if (data.status === 'succeeded') return data
        if (data.status === 'failed') throw new Error(data.error || 'Generation failed')
        await delay(1000)
    }
    throw new Error('Generation timed out')
}

export async function generateWithReplicate(
    request: AIGenerationRequest
): Promise<AIGenerationResponse> {
    const startTime = Date.now()

    try {
        const { predictionId }: any = await api.post('/api/generate', {
            provider: 'replicate',
            ...request,
        })

        const prediction = await pollPrediction(predictionId)

        return {
            success: true,
            outputUrls: prediction.output,
            processingTimeMs: Date.now() - startTime,
        }
    } catch (error: any) {
        return {
            success: false,
            error: error.message,
        }
    }
}
