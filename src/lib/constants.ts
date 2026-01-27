// Credit costs for different generation types
export const CREDIT_COSTS = {
    IMAGE_GENERATION: 1,
    FACE_SWAP_IMAGE: 2,
    FACE_SWAP_VIDEO: 5,
    IMAGE_TO_VIDEO: 5,
} as const

// API configuration
export const API_CONFIG = {
    REPLICATE_BASE_URL: 'https://api.replicate.com/v1',
    FAL_BASE_URL: 'https://fal.run',
    GENERATION_TIMEOUT_MS: 120000, // 2 minutes
    POLLING_INTERVAL_MS: 1000, // 1 second
} as const

// Image configuration
export const IMAGE_CONFIG = {
    MAX_FILE_SIZE_MB: 10,
    MAX_DIMENSION: 2048,
    COMPRESSION_QUALITY: 0.9,
    SUPPORTED_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
} as const

// UI configuration
export const UI_CONFIG = {
    PROMPT_MAX_LENGTH: 500,
    TOAST_DURATION_MS: 3000,
    ANIMATION_DURATION_MS: 300,
} as const

// Navigation items
export const NAV_ITEMS = [
    { id: 'create', label: 'Create', href: '/create', icon: 'Wand2' },
    { id: 'templates', label: 'Templates', href: '/templates', icon: 'LayoutGrid' },
    { id: 'gallery', label: 'Gallery', href: '/gallery', icon: 'Image' },
] as const

// Template categories
export const TEMPLATE_CATEGORIES = [
    { id: 'trending', label: '🔥 Trending', value: 'trending' },
    { id: 'face_swap', label: 'Face Swap', value: 'face_swap' },
    { id: 'style', label: 'Styles', value: 'style' },
    { id: 'effect', label: 'Effects', value: 'effect' },
] as const
