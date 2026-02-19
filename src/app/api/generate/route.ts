import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { ERROR_CODES } from '@/lib/errors'

function resolveFalEndpoint(type: string, hasInputImage: boolean): string {
    if (type.includes('video')) return 'fal-ai/veo3'
    if (hasInputImage) return 'fal-ai/nano-banana/edit'
    return 'fal-ai/nano-banana'
}

function buildRequestBody(
    type: string,
    prompt: string,
    inputImage: string | undefined,
    durationSeconds: number | undefined,
    aspectRatio: string | undefined,
): Record<string, any> {
    const isVideoType = type?.includes('video')
    // NanoBanana uses aspect_ratio as a plain string e.g. "9:16"
    // Fall back to "auto" if not provided
    const ratio = aspectRatio ?? 'auto'

    // ── VEO3 Video ────────────────────────────────────────────────────────
    if (isVideoType) {
        return {
            prompt,
            ...(inputImage && { image_url: inputImage }),
            duration: durationSeconds ?? 5,
            aspect_ratio: ratio,
        }
    }

    // ── NanoBanana Image-to-Image (edit endpoint) ─────────────────────────
    if (inputImage) {
        return {
            prompt,
            image_urls: [inputImage],   // ARRAY — this is how nano-banana/edit works
            aspect_ratio: ratio,
            num_images: 1,
            output_format: 'jpeg',
            safety_tolerance: '4',
        }
    }

    // ── NanoBanana Text-to-Image ──────────────────────────────────────────
    return {
        prompt: `${prompt}, ultra realistic, high detail, photorealistic`,
        aspect_ratio: ratio,
        num_images: 1,
        output_format: 'jpeg',
        safety_tolerance: '4',
    }
}

function parseOutputUrl(data: any, isVideo: boolean): string | null {
    if (isVideo) {
        // VEO3 returns { video: { url: string } }
        return data?.video?.url ?? null
    }
    // NanoBanana returns { images: [{ url: string }] }
    return data?.images?.[0]?.url ?? null
}

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
                { error: ERROR_CODES.GENERATION_FAILED.message, code: 'MISSING_PROMPT' },
                { status: 400 }
            )
        }

        const hasInputImage = !!inputImage
        const isVideoType = type?.includes('video')

        const falEndpoint = resolveFalEndpoint(type, hasInputImage)

        // NanoBanana accepts base64 data URIs directly in image_urls — no upload needed
        const requestBody = buildRequestBody(
            type,
            prompt,
            inputImage,         // pass as-is: base64 data URI or URL both work
            durationSeconds,
            aspectRatio,
        )

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
            console.error('[FAL] Unexpected response shape:', data)
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
        console.error('[API] Error:', error)
        return NextResponse.json(
            { error: ERROR_CODES.UNKNOWN_ERROR.message, code: ERROR_CODES.UNKNOWN_ERROR.code },
            { status: 500 }
        )
    }
}
