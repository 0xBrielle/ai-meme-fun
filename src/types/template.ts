export type TemplateCategory = 'trending' | 'face_swap' | 'style' | 'effect'
export type TemplateType = 'image' | 'video'

export interface Template {
    id: string
    name: string
    description: string
    previewUrl: string
    type: TemplateType
    category: TemplateCategory
    creditsCost: number
    promptTemplate: string // The AI prompt to use
    isActive: boolean
    sortOrder: number
    createdAt: string
}

export interface TemplateFilter {
    category?: TemplateCategory
    type?: TemplateType
    search?: string
}
