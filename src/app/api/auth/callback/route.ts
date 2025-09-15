/* cspell:ignore NextRequest NextResponse eque */
// cspell:disable-next-line
import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

// /api/auth/callback?code=...&next=/rooms のようにヒットさせる
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const next = req.nextUrl.searchParams.get("next") || "/rooms"
  const to = new URL(next, req.nextUrl.origin)

  if (!code) {
    return NextResponse.redirect(new URL("/login?error=missing_code", req.nextUrl))
  }

  const supabase = await supabaseServer()
  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, req.nextUrl))
  }

  // Cookie がセットされた状態でアプリへ返す
  return NextResponse.redirect(to)
}
