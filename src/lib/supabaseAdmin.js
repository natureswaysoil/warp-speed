import { createClient } from '@supabase/supabase-js'

// Server-side Supabase client using the Service Role key. Do NOT expose this key to the client.
// Accept either SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL for flexibility.
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

export const supabaseAdmin = createClient(url, serviceKey, {
  auth: { persistSession: false }
})
