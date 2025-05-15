import { createClient } from '@supabase/supabase-js'

/**
 * A Supabase client with the SERVICE_ROLE key.
 * Only use this in trusted, server‐only contexts!
 */
export const supabaseServiceRole = <T = unknown>() => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  }
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient<T>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      // you can opt out of localStorage/session persistence
      auth: { persistSession: false },
    }
  )
}
