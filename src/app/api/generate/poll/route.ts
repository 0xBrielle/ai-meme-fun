import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
        return NextResponse.json({ error: 'Missing prediction ID' }, { status: 400 })
    }

    try {
        const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
            headers: {
                Authorization: `Token ${env.replicateToken}`,
            },
        })

        const data = await response.json()
        return NextResponse.json({
            status: data.status,
            output: data.output,
            error: data.error,
            progress: data.logs ? 50 : 0, // Simplified progress
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
