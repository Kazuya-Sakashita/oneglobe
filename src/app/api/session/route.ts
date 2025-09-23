// src/app/api/session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseRoute } from '@/lib/supabase/route'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {           // ← ここを追加
  const { supabase, applyCookies } = supabaseRoute(req) // ← req を渡す

  const { data, error } = await supabase.auth.getUser()
  const user = error ? null : data?.user ?? null

  if (!user) {
    const res = NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401, headers: { 'Cache-Control': 'no-store', Vary: 'Cookie' } },
    )
    applyCookies(res)
    return res
  }

  const nickname =
    (user.user_metadata as any)?.nickname ??
    user.email?.split('@')[0] ??
    null
  const avatarUrl = (user.user_metadata as any)?.avatar_url ?? null

  const res = NextResponse.json(
    { id: user.id, nickname, avatarUrl },
    { headers: { 'Cache-Control': 'no-store', Vary: 'Cookie' } },
  )
  applyCookies(res)
  return res
}
