// src/app/api/session/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabaseRoute } from "@/lib/supabase/route"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export async function GET(req: NextRequest) {
  const { supabase, applyCookies } = supabaseRoute(req)

  const { data, error } = await supabase.auth.getUser()
  const user = error ? null : data?.user ?? null

  const payload =
    user
      ? {
          user: {
            id: user.id,
            nickname:
              (user.user_metadata as any)?.nickname ??
              user.email?.split("@")[0] ??
              null,
            avatarUrl: (user.user_metadata as any)?.avatar_url ?? null,
          },
        }
      : { user: null }

  const res = NextResponse.json(payload, { status: 200 })
  applyCookies(res) // ← Supabase が要求する Cookie 更新を確実に適用
  res.headers.set("Cache-Control", "no-store")
  res.headers.set("Vary", "Cookie")
  return res
}
