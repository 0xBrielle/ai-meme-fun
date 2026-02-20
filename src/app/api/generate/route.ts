import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

export const maxDuration = 300

// ─── Endpoint routing ─────────────────────────────────────────────────────────

function resolveFalEndpoint(type: string): string {
    switch (type) {
        case 'text-to-video': return 'fal-ai/kling-video/v2.6/pro/text-to-video'
        case 'image-to-video': return 'fal-ai/kling-video/v2.6/pro/image-to-video'
        case 'video-to-video': return 'fal-ai/kling-video/v2.6/standard/motion-control'
        case 'image-to-image': return 'fal-ai/nano-banana/edit'
        default: return 'fal-ai/nano-banana'
    }
}

// ─── FAL Storage Upload ───────────────────────────────────────────────────────
// Kling motion-control requires real HTTP URLs — base64 data URLs are rejected.
// This helper uploads a data URL to FAL's file storage and returns a hosted URL.

async function uploadToFalStorage(dataUrl: string, apiKey: string): Promise<string> {
    // If it's already a real URL, pass it through unchanged
    if (!dataUrl.startsWith('data:')) return dataUrl

    // Parse the data URL: data:<mimeType>;base64,<data>
    const commaIdx = dataUrl.indexOf(',')
    if (commaIdx === -1) throw new Error('Malformed data URL')

    const meta = dataUrl.slice(5, commaIdx)          // e.g. "image/jpeg;base64"
    const mimeType = meta.split(';')[0] || 'application/octet-stream'
    const base64Data = dataUrl.slice(commaIdx + 1)
    const buffer = Buffer.from(base64Data, 'base64')

    // Derive a file extension from the mime type
    const ext = mimeType.split('/')[1]?.split('+')[0] ?? 'bin'   // jpeg, mp4, png, webm …

    const formData = new FormData()
    const blob = new Blob([buffer], { type: mimeType })
    formData.append('file', blob, `upload.${ext}`)

    const res = await fetch('https://fal.run/files/upload', {
        method: 'POST',
        headers: { Authorization: `Key ${apiKey}` },
        body: formData,
    })

    if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText)
        throw new Error(`FAL storage upload failed (${res.status}): ${errText}`)
    }

    const json = await res.json()
    const hostedUrl: string | undefined = json.url ?? json.file_url ?? json.uri
    if (!hostedUrl) throw new Error(`FAL storage upload returned no URL: ${JSON.stringify(json)}`)

    console.log(`[FAL Upload] ${mimeType} → ${hostedUrl}`)
    return hostedUrl
}

// ─── Request body builders ────────────────────────────────────────────────────

function buildRequestBody(
    type: string,
    prompt: string,
    inputImage: string | undefined,
    videoUrl: string | undefined,
    durationSeconds: number | undefined,
    aspectRatio: string | undefined,
    generateAudio: boolean | undefined,
    keepOriginalSound: boolean | undefined,
    characterOrientation: string | undefined,
    cfgScale: number | undefined,
    negativePrompt: string | undefined,
): Record<string, any> {

    // ── Kling: duration must be string enum "5" or "10" ──────────────────────
    const klingDuration = [5, 10].includes(durationSeconds ?? 5)
        ? String(durationSeconds ?? 5)
        : '5'

    // ── Kling: aspect ratio — only these three values accepted ───────────────
    const klingRatio = ['16:9', '9:16', '1:1'].includes(aspectRatio ?? '9:16')
        ? (aspectRatio ?? '9:16')
        : '9:16'

    // ── Text-to-Video ─────────────────────────────────────────────────────────
    if (type === 'text-to-video') {
        return {
            prompt,
            duration: klingDuration,
            aspect_ratio: klingRatio,
            cfg_scale: cfgScale ?? 0.5,
            generate_audio: generateAudio !== false,
            ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
        }
    }

    // ── Image-to-Video ────────────────────────────────────────────────────────
    if (type === 'image-to-video') {
        if (!inputImage) throw new Error('image-to-video requires a reference image')
        return {
            prompt,
            start_image_url: inputImage,
            duration: klingDuration,
            aspect_ratio: klingRatio,
            cfg_scale: cfgScale ?? 0.5,
            generate_audio: generateAudio !== false,
            ...(negativePrompt ? { negative_prompt: negativePrompt } : {}),
        }
    }

    // ── Video-to-Video (Motion Control) ───────────────────────────────────────
    // NOTE: inputImage and videoUrl must already be real HTTP URLs at this point
    // (uploaded via uploadToFalStorage before this function is called).
    if (type === 'video-to-video') {
        if (!inputImage) throw new Error('video-to-video requires a reference image')
        if (!videoUrl) throw new Error('video-to-video requires a reference video URL')
        return {
            prompt: prompt || '',
            image_url: inputImage,
            video_url: videoUrl,
            keep_original_sound: keepOriginalSound !== false,  // default true
            character_orientation: characterOrientation ?? 'image',
        }
    }

    // ── NanoBanana Image-to-Image ─────────────────────────────────────────────
    if (type === 'image-to-image' || inputImage) {
        return {
            prompt,
            image_urls: [inputImage],
            aspect_ratio: aspectRatio ?? '9:16',
            num_images: 1,
            output_format: 'jpeg',
            safety_tolerance: '4',
        }
    }

    // ── NanoBanana Text-to-Image ──────────────────────────────────────────────
    return {
        prompt: `${prompt}, ultra realistic, high detail, photorealistic`,
        aspect_ratio: aspectRatio ?? '9:16',
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

// ─── Error extraction ─────────────────────────────────────────────────────────

function extractErrorMessage(errorData: any): string {
    if (Array.isArray(errorData.detail)) {
        return errorData.detail
            .map((e: any) => e.msg || e.message || JSON.stringify(e))
            .filter(Boolean)
            .join('; ') || 'Generation failed'
    }
    if (typeof errorData.detail === 'string' && errorData.detail) return errorData.detail
    if (typeof errorData.message === 'string' && errorData.message) return errorData.message
    return 'Generation failed'
}

// ─── POST handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
    try {
        const {
            prompt,
            inputImage,
            videoUrl,
            type = 'text-to-image',
            durationSeconds,
            aspectRatio,
            generateAudio,
            keepOriginalSound,
            characterOrientation,
            cfgScale,
            negativePrompt,
        } = await req.json()

        if (!prompt && type !== 'video-to-video') {
            return NextResponse.json(
                { error: 'Prompt is required', code: 'MISSING_PROMPT' },
                { status: 400 }
            )
        }

        const isVideoType = type.includes('video')
        const falEndpoint = resolveFalEndpoint(type)

        // ── Upload data URLs to FAL storage for video-to-video ────────────────
        // Kling motion-control strictly requires real HTTP URLs, not base64 data URLs.
        let resolvedInputImage = inputImage
        let resolvedVideoUrl = videoUrl

        if (type === 'video-to-video') {
            try {
                console.log('[FAL] Uploading video-to-video assets to FAL storage…')
                    ;[resolvedInputImage, resolvedVideoUrl] = await Promise.all([
                        inputImage ? uploadToFalStorage(inputImage, env.falApiKey) : Promise.resolve(undefined),
                        videoUrl ? uploadToFalStorage(videoUrl, env.falApiKey) : Promise.resolve(undefined),
                    ])
            } catch (uploadErr: any) {
                console.error('[FAL Upload] Failed:', uploadErr)
                return NextResponse.json(
                    { error: `Asset upload failed: ${uploadErr.message}`, code: 'UPLOAD_ERROR' },
                    { status: 500 }
                )
            }
        }

        let requestBody: Record<string, any>
        try {
            requestBody = buildRequestBody(
                type, prompt, resolvedInputImage, resolvedVideoUrl,
                durationSeconds, aspectRatio, generateAudio,
                keepOriginalSound, characterOrientation,
                cfgScale, negativePrompt,
            )
        } catch (err: any) {
            return NextResponse.json({ error: err.message, code: 'BUILD_ERROR' }, { status: 400 })
        }

        console.log(`[Kling/FAL] → ${falEndpoint} | type: ${type}`)

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
                { error: extractErrorMessage(errorData), code: 'FAL_ERROR', details: errorData },
                { status: response.status }
            )
        }

        const data = await response.json()
        const outputUrl = parseOutputUrl(data, isVideoType)

        if (!outputUrl) {
            console.error('[FAL] Unexpected shape:', JSON.stringify(data).slice(0, 500))
            return NextResponse.json(
                { error: 'No output URL in response', code: 'FAL_PARSE_ERROR' },
                { status: 500 }
            )
        }

        return NextResponse.json({ output: [outputUrl], endpoint: falEndpoint, type })

    } catch (error: any) {
        console.error('[API] Unhandled error:', error)
        return NextResponse.json(
            { error: error.message || 'Unknown error', code: 'UNKNOWN_ERROR' },
            { status: 500 }
        )
    }
}
