import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { ERROR_CODES } from '@/lib/errors'

// ─── Dimension Lookup Table ────────────────────────────────────────────────
// All values are multiples of 64 (FAL requirement)
// Resolution base: 1K=1024px, 2K=2048px, 4K=3840px along the longer edge

type AspectRatio = '4:3' | '1:1' | '3:4' | '9:16' | '5:4'
type Resolution = '1k' | '2k' | '4k'

const DIMENSIONS: Record<AspectRatio, Record<Resolution, { width: number; height: number }>> = {
    '4:3': {
        '1k': { width: 1024, height: 768 },
        '2k': { width: 2048, height: 1536 },
        '4k': { width: 3840, height: 2880 },
    },
    '1:1': {
        '1k': { width: 1024, height: 1024 },
        '2k': { width: 2048, height: 2048 },
        '4k': { width: 3840, height: 3840 },
    },
    '3:4': {
        '1k': { width: 768, height: 1024 },
        '2k': { width: 1536, height: 2048 },
        '4k': { width: 2880, height: 3840 },
    },
    '9:16': {
        '1k': { width: 576, height: 1024 },
        '2k': { width: 1152, height: 2048 },
        '4k': { width: 2160, height: 3840 },
    },
    '5:4': {
        '1k': { width: 1280, height: 1024 },
        '2k': { width: 2560, height: 2048 },
        '4k': { width: 3200, height: 2560 },
    },
}

function getDimensions(
    aspectRatio: AspectRatio | string | undefined,
    resolution: Resolution | string | undefined
): { width: number; height: number } {
    const ratio = (aspectRatio ?? '9:16') as AspectRatio
    const res = (resolution ?? '2k') as Resolution
    return DIMENSIONS[ratio]?.[res] ?? DIMENSIONS['9:16']['2k']
}

function resolveFalEndpoint(type: string, model: string | undefined, hasInputImage: boolean) {
    if (model) return model
    if (type.includes('video')) return 'fal-ai/veo3'
    return hasInputImage ? 'fal-ai/flux-subject' : 'fal-ai/nano-banana'
}

function parseOutputUrl(data: any, isVideo: boolean) {
    if (isVideo) return data.video?.url || data.url
    return data.images?.[0]?.url || data.output?.[0]
}

function buildRequestBody(
    type: string,
    prompt: string,
    inputImage: string | undefined,
    durationSeconds: number | undefined,
    aspectRatio: string | undefined,
    resolution: string | undefined,
): Record<string, any> {
    const isVideoType = type?.includes('video')
    const { width, height } = getDimensions(aspectRatio, resolution)

    if (isVideoType) {
        // Veo3 uses aspect_ratio as a string ratio, not pixel dimensions
        return {
            prompt,
            ...(inputImage && { image_url: inputImage }),
            duration: durationSeconds ?? 5,
            aspect_ratio: aspectRatio ?? '9:16',
        }
    }

    if (type === 'image-to-image' || (inputImage && type !== 'text-to-image')) {
        return {
            prompt,
            image_url: inputImage!,
            strength: 0.55,           // 0.5–0.6 range: follows reference closely, prompt adds style
            num_inference_steps: 40,
            guidance_scale: 7.5,
            image_size: { width, height },
            output_format: 'jpeg',
            output_quality: 95,
            enable_safety_checker: false,
        }
    }

    // Text-to-image
    return {
        prompt: `${prompt}, ultra realistic, high detail, photorealistic, sharp focus, professional photography`,
        num_inference_steps: 50,
        guidance_scale: 7.5,
        image_size: { width, height },
        output_format: 'jpeg',
        output_quality: 95,
        enable_safety_checker: false,
        num_images: 1,
    }
}

export async function POST(req: NextRequest) {
    try {
        const {
            provider,
            prompt,
            inputImage,
            model,
            type = 'text-to-image',
            durationSeconds,
            aspectRatio,    // ← new
            resolution,     // ← new
        } = await req.json()

        if (!prompt) {
            return NextResponse.json(
                { error: ERROR_CODES.GENERATION_FAILED.message, code: 'MISSING_PROMPT' },
                { status: 400 }
            )
        }

        const hasInputImage = !!inputImage
        const isVideoType = type?.includes('video')

        const falEndpoint = resolveFalEndpoint(type, model, hasInputImage)

        // Pass aspectRatio + resolution into body builder
        const requestBody = buildRequestBody(
            type,
            prompt,
            inputImage,
            durationSeconds,
            aspectRatio,    // ← new
            resolution,     // ← new
        )

        console.log(`[FAL] Endpoint: ${falEndpoint} | ${aspectRatio ?? '9:16'} @ ${resolution ?? '2k'}`, {
            dimensions: getDimensions(aspectRatio, resolution),
        })

        const response = await fetch(`https://fal.run/${falEndpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Key ${env.falApiKey}`,
            },
            body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('[FAL] Error:', errorData)
            return NextResponse.json(
                {
                    error: errorData.detail || errorData.message || ERROR_CODES.GENERATION_FAILED.message,
                    code: 'FAL_ERROR',
                    details: errorData,
                },
                { status: response.status }
            )
        }

        const data = await response.json()
        const outputUrl = parseOutputUrl(data, isVideoType)

        if (!outputUrl) {
            console.error('[FAL] Unexpected response:', data)
            return NextResponse.json(
                { error: 'No output URL in FAL response', code: 'FAL_PARSE_ERROR' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            output: [outputUrl],
            model: falEndpoint,
            type,
            aspectRatio,
            resolution,
        })

    } catch (error: any) {
        console.error('[API] Error:', error)
        return NextResponse.json(
            { error: ERROR_CODES.UNKNOWN_ERROR.message, code: ERROR_CODES.UNKNOWN_ERROR.code },
            { status: 500 }
        )
    }
}
