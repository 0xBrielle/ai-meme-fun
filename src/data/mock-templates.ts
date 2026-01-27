import { Template } from '@/types'

export const mockTemplates: Template[] = [
    // Trending
    {
        id: '1',
        name: 'Anime Portrait',
        description: 'Transform your photo into a stunning anime-style portrait.',
        previewUrl: 'https://picsum.photos/seed/anime/400/400',
        type: 'image',
        category: 'trending',
        creditsCost: 1,
        promptTemplate: 'high quality anime portrait style',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Celebrity Swap',
        description: 'Face swap with popular celebrity templates in high-quality video.',
        previewUrl: 'https://picsum.photos/seed/celeb/400/400',
        type: 'video',
        category: 'trending',
        creditsCost: 5,
        promptTemplate: 'celebrity face swap video',
        isActive: true,
        sortOrder: 2,
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Cartoon Filter',
        description: 'Turn yourself into a fun 3D cartoon character.',
        previewUrl: 'https://picsum.photos/seed/cartoon/400/400',
        type: 'image',
        category: 'trending',
        creditsCost: 1,
        promptTemplate: '3d cartoon character style',
        isActive: true,
        sortOrder: 3,
        createdAt: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'AI Yearbook',
        description: 'Get that classic 90s yearbook look in seconds.',
        previewUrl: 'https://picsum.photos/seed/yearbook/400/400',
        type: 'image',
        category: 'trending',
        creditsCost: 2,
        promptTemplate: '90s classic yearbook photo style',
        isActive: true,
        sortOrder: 4,
        createdAt: new Date().toISOString(),
    },

    // Face Swap
    {
        id: '5',
        name: 'Movie Scene',
        description: 'Put your face into an iconic movie scene action shot.',
        previewUrl: 'https://picsum.photos/seed/movie/400/400',
        type: 'video',
        category: 'face_swap',
        creditsCost: 5,
        promptTemplate: 'iconic movie scene face swap',
        isActive: true,
        sortOrder: 5,
        createdAt: new Date().toISOString(),
    },
    {
        id: '6',
        name: 'Meme Face',
        description: 'Become the star of your favorite viral meme templates.',
        previewUrl: 'https://picsum.photos/seed/meme/400/400',
        type: 'image',
        category: 'face_swap',
        creditsCost: 2,
        promptTemplate: 'meme face swap style',
        isActive: true,
        sortOrder: 6,
        createdAt: new Date().toISOString(),
    },

    // Styles
    {
        id: '7',
        name: 'Oil Painting',
        description: 'Turn your photo into a masterpiece oil painting.',
        previewUrl: 'https://picsum.photos/seed/oil/400/400',
        type: 'image',
        category: 'style',
        creditsCost: 1,
        promptTemplate: 'classical oil painting masterpiece style',
        isActive: true,
        sortOrder: 7,
        createdAt: new Date().toISOString(),
    },
    {
        id: '8',
        name: 'Cyberpunk',
        description: 'Neon-lit, futuristic cyberpunk aesthetic for your photos.',
        previewUrl: 'https://picsum.photos/seed/cyberpunk/400/400',
        type: 'image',
        category: 'style',
        creditsCost: 2,
        promptTemplate: 'neon cyberpunk futuristic aesthetic',
        isActive: true,
        sortOrder: 8,
        createdAt: new Date().toISOString(),
    },
]

export function getTemplatesByCategory(category: string) {
    return mockTemplates.filter((t) => t.category === category)
}

export function getTemplateById(id: string) {
    return mockTemplates.find((t) => t.id === id)
}

export function searchTemplates(query: string) {
    const q = query.toLowerCase()
    return mockTemplates.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
    )
}
