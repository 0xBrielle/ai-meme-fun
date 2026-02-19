export type GenerationType =
    | 'text-to-image'
    | 'image-to-image'
    | 'text-to-video'
    | 'image-to-video'
    | 'video-to-video'

export type AspectRatio = '4:3' | '1:1' | '3:4' | '9:16' | '5:4'

export type Resolution = '1k' | '2k' | '4k'

export interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content?: string
    image?: string
    outputUrl?: string
    outputType?: 'image' | 'video'
    generationType?: GenerationType
    aspectRatio?: AspectRatio
    resolution?: Resolution
    status?: 'loading' | 'success' | 'error'
    processingTimeMs?: number
    createdAt: string
}

export interface Conversation {
    id: string
    title: string
    messages: ChatMessage[]
    createdAt: string
    updatedAt: string
}
