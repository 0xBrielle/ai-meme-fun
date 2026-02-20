import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { ERROR_CODES } from '@/lib/errors'

// Allow this route up to 5 minutes (needed for VEO3 video generation)
export const maxDuration = 300

// ─── Endpoint routing ─────────────────────────────────────────────────────────

function resolveFalEndpoint(type: string, hasInputImage: boolean): string {
    switch (type) {
        case 'text-to-video':
            return 'fal-ai/veo3'
        case 'image-to-video':
            return 'fal-ai/veo3/image-to-video'   // SEPARATE endpoint — required
        case 'image-to-image':
            return 'fal-ai/nano-banana/edit'
        case 'text-to-image':
        default:
            return hasInputImage ? 'fal-ai/nano-banana/edit' : 'fal-ai/nano-banana'
    }
}

// ─── Request body builders ────────────────────────────────────────────────────

function buildRequestBody(
    type: string,
    prompt: string,
    inputImage: string | undefined,
    durationSeconds: number | undefined,
    aspectRatio: string | undefined,
): Record<string, any> {
    const ratio = aspectRatio ?? '9:16'

    // VEO3 Text-to-Video
    if (type === 'text-to-video') {
        return {
            prompt,
            aspect_ratio: ratio,
            duration: `${durationSeconds ?? 8}s`,   // VEO3 wants "8s" not 8
            resolution: '720p',
            generate_audio: true,
        }
    }

    // VEO3 Image-to-Video
    if (type === 'image-to-video') {
        if (!inputImage) {
            throw new Error('image-to-video requires an input image')
        }
        return {
            prompt,
            image_url: inputImage,          // single URL string (not array)
            aspect_ratio: ratio,
            duration: `${durationSeconds ?? 8}s`,   // VEO3 wants "8s" not 8
            resolution: '720p',
            generate_audio: true,
        }
    }

    // NanoBanana Image-to-Image
    if (type === 'image-to-image' || inputImage) {
        return {
            prompt,
            image_urls: [inputImage],       // array — required by nano-banana/edit
            aspect_ratio: ratio,
            num_images: 1,
            output_format: 'jpeg',
            safety_tolerance: '4',
        }
    }

    // NanoBanana Text-to-Image
    return {
        prompt: `${prompt}, ultra realistic, high detail, photorealistic`,
        aspect_ratio: ratio,
        num_images: 1,
        output_format: 'jpeg',
        safety_tolerance: '4',
    }
}

// ─── Output parsing ───────────────────────────────────────────────────────────

function parseOutputUrl(data: any, isVideo: boolean): string | null {
    if (isVideo) return data?.video?.url ?? null
    return data?.images?.[0]?.url ?? null
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const {
            prompt,
            inputImage,
            type = 'text-to-image',
            durationSeconds,
            aspectRatio,
        } = await req.json()

        if (!prompt) {
            return NextResponse.json(
                { error: 'Prompt is required', code: 'MISSING_PROMPT' },
                { status: 400 }
            )
        }

        const isVideoType = type.includes('video')
        const hasInputImage = !!inputImage
        const falEndpoint = resolveFalEndpoint(type, hasInputImage)

        let requestBody: Record<string, any>
        try {
            requestBody = buildRequestBody(type, prompt, inputImage, durationSeconds, aspectRatio)
        } catch (err: any) {
            return NextResponse.json({ error: err.message, code: 'BUILD_ERROR' }, { status: 400 })
        }

        console.log(`[FAL] → ${falEndpoint} | type: ${type} | hasImage: ${hasInputImage}`)

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
            console.error('[FAL] Error response:', errorData)
            return NextResponse.json(
                {
                    error: errorData.detail || errorData.message || 'Generation failed',
                    code: 'FAL_ERROR',
                    details: errorData,
                },
                { status: response.status }
            )
        }

        const data = await response.json()
        const outputUrl = parseOutputUrl(data, isVideoType)

        if (!outputUrl) {
            console.error('[FAL] Unexpected response shape:', JSON.stringify(data).slice(0, 500))
            return NextResponse.json(
                { error: 'No output URL in FAL response', code: 'FAL_PARSE_ERROR' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            output: [outputUrl],
            endpoint: falEndpoint,
            type,
        })

    } catch (error: any) {
        console.error('[API] Unhandled error:', error)
        return NextResponse.json(
            { error: error.message || 'Unknown error', code: 'UNKNOWN_ERROR' },
            { status: 500 }
        )
    }
}
