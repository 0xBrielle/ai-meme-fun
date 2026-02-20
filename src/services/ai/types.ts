export interface AIGenerationRequest {
    prompt: string
    inputImage?: string            // → start_image_url (image-to-video) or image_url (video-to-video)
    videoUrl?: string              // video-to-video: reference video URL
    model?: string
    type?: string
    durationSeconds?: number       // UI value: 5 or 10 (number) — converted to string for Kling API
    generateAudio?: boolean        // default true
    keepOriginalSound?: boolean    // video-to-video, default true
    characterOrientation?: 'image' | 'video'  // video-to-video
    cfgScale?: number              // default 0.5
    negativePrompt?: string        // optional
    aspectRatio?: string
    resolution?: string            // images only: '1k'|'2k'|'4k'
    width?: number
    height?: number
    numOutputs?: number
}

export interface AIGenerationResponse {
    success: boolean
    outputUrls?: string[]
    error?: string
    processingTimeMs?: number
}
