import { createClient } from '@supabase/supabase-js'

// Server-side Subbase client using the Service Role key. Do NOT expose this key to the client.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false }
  }
)
