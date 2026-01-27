// Type-safe environment variable access
export const env = {
    // AI APIs
    replicateToken: process.env.REPLICATE_API_TOKEN || process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN || '',
    falApiKey: process.env.FAL_API_KEY || process.env.NEXT_PUBLIC_FAL_API_KEY || '',

    // Supabase
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

    // App
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    appName: process.env.NEXT_PUBLIC_APP_NAME || 'AI Image App',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',

    // Feature flags
    enableVideo: process.env.NEXT_PUBLIC_ENABLE_VIDEO === 'true',
    enableFaceSwap: process.env.NEXT_PUBLIC_ENABLE_FACE_SWAP !== 'false',
    debugMode: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',

    // Limits
    apiTimeoutMs: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT_MS || '120000'),
    maxImageSizeMb: parseInt(process.env.NEXT_PUBLIC_MAX_IMAGE_SIZE_MB || '10'),
    maxPromptLength: parseInt(process.env.NEXT_PUBLIC_MAX_PROMPT_LENGTH || '500'),
} as const
