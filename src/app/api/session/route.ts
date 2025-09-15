// src/app/api/session/route.ts
import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await supabaseServer()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  const user = data.user
  const nickname =
    (user.user_metadata as any)?.nickname ?? user.email?.split("@")[0] ?? null
  const avatarUrl = (user.user_metadata as any)?.avatar_url ?? null

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      nickname,
      avatarUrl,
    },
  })
}
