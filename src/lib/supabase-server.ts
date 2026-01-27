import { createClient } from '@supabase/supabase-js'
import { env } from './env'

// Use in Server Components and API routes
export function createServerSupabaseClient() {
    return createClient(env.supabaseUrl, env.supabaseServiceKey)
}
