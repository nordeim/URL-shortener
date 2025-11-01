import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

// Client-side Supabase client (with anon key)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Server-side Supabase client (with service role key for admin operations)
export const supabaseServer = supabaseUrl && supabaseServiceKey
  ? createClient<Database>(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null

// Client for authenticated operations (if needed in future)
export const supabaseAuth = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Utility function to get the appropriate client
export function getSupabaseClient(serviceRole = false) {
  if (serviceRole) {
    if (!supabaseServer) {
      throw new Error('Service role client not available. Check SUPABASE_SERVICE_ROLE_KEY.')
    }
    return supabaseServer
  }
  return supabase
}

// Database types for TypeScript safety
export type { Database } from '@/types/database'
export type Link = Database['public']['Tables']['links']['Row']
export type LinkInsert = Database['public']['Tables']['links']['Insert']
export type LinkUpdate = Database['public']['Tables']['links']['Update']