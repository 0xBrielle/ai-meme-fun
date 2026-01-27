import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Client-side Supabase client (uses anon key)
export const supabase = createClient(
    env.supabaseUrl,
    env.supabaseAnonKey,
    {
        auth: {
            persistSession: true,
            autoRefreshToken: true,
        },
    }
)

// Server-side Supabase client (uses service role key)
// Only use in API routes, never expose to client!
export const supabaseAdmin = createClient(
    env.supabaseUrl,
    env.supabaseServiceKey,
    {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    }
)

// Type helper for database (will be generated in Phase 2)
export type Database = {
    // Placeholder - generate with: npx supabase gen types typescript
}
