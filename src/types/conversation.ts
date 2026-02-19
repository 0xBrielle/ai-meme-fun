export type GenerationType = 'text-to-image' | 'image-to-image' | 'text-to-video' | 'image-to-video' | 'video-to-video'

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content?: string
    image?: string          // base64 attachment user sent
    outputUrl?: string      // generated image/video URL
    outputType?: 'image' | 'video'
    generationType?: GenerationType
    status?: 'loading' | 'success' | 'error'
    processingTimeMs?: number
    createdAt: string
}

export interface Conversation {
    id: string
    title: string           // auto-generated from first prompt
    messages: ChatMessage[]
    createdAt: string
    updatedAt: string
}
