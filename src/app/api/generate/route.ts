import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { ERROR_CODES } from '@/lib/errors'

export async function POST(req: NextRequest) {
    try {
        const { provider, prompt, inputImage, ...rest } = await req.json()

        if (!prompt) {
            return NextResponse.json(
                { error: ERROR_CODES.GENERATION_FAILED.message, code: 'MISSING_PROMPT' },
                { status: 400 }
            )
        }

        console.log('Calling Fal.ai with prompt:', prompt)
        const body: any = { prompt, ...rest }
        if (inputImage) body.image_url = inputImage

        const response = await fetch('https://fal.run/fal-ai/flux/schnell', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Key ${env.falApiKey}`,
            },
            body: JSON.stringify(body),
        })

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Fal.ai Error:', errorData)
            return NextResponse.json(
                {
                    error: errorData.message || ERROR_CODES.GENERATION_FAILED.message,
                    code: 'FAL_ERROR',
                    details: errorData
                },
                { status: response.status }
            )
        }

        const data = await response.json()
        return NextResponse.json({ output: [data.images?.[0]?.url] })
    } catch (error: any) {
        console.error('API Error:', error)
        return NextResponse.json(
            {
                error: ERROR_CODES.UNKNOWN_ERROR.message,
                code: ERROR_CODES.UNKNOWN_ERROR.code,
            },
            { status: 500 }
        )
    }
}
