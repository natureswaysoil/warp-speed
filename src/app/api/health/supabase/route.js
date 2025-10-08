import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

export async function GET() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const keySet = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)

  const status = {
    hasUrl: Boolean(url),
    hasServiceRoleKey: keySet,
    canQuery: false,
    error: null
  }

  if (!status.hasUrl || !status.hasServiceRoleKey) {
    return NextResponse.json(status, { status: 200 })
  }

  try {
    const { error } = await supabaseAdmin
      .from('customers')
      .select('email')
      .limit(1)

    if (error) {
      status.error = error.message
    } else {
      status.canQuery = true
    }
  } catch (e) {
    status.error = e?.message || 'Unknown error'
  }

  return NextResponse.json(status, { status: 200 })
}
