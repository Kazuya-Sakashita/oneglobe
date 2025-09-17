// src/app/api/auth/login/route.ts
/* cspell:ignore NextRequest NextResponse */
import { NextRequest, NextResponse } from "next/server"
import { supabaseRoute } from "@/lib/supabase/route"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

const maskEmail = (e?: string | null) =>
  e ? e.replace(/(^.).*(@.*$)/, (_m, a, b) => `${a}***${b}`) : null

export async function POST(req: NextRequest) {
  const startedAt = Date.now()

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid json body" }, { status: 400 })
  }

  const { email, password } = body as { email?: string; password?: string }
  if (!email || !password) {
    return NextResponse.json({ error: "email と password は必須です" }, { status: 400 })
  }

  try {
    const { supabase, applyCookies } = supabaseRoute(req)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    const took = Date.now() - startedAt

    if (error || !data?.user) {
      const code = (error as any)?.code ?? (error as any)?.name ?? "LOGIN_FAILED"
      const message = error?.message ?? "ログインに失敗しました"
      const status = message.toLowerCase().includes("email not confirmed") ? 403 : 401

      const res = NextResponse.json(
        {
          error: message,
          code,
          dev: process.env.NODE_ENV !== "production"
            ? { tookMs: took, emailMasked: maskEmail(email) }
            : undefined,
        },
        { status },
      )
      applyCookies(res) // ★ 失敗時も適用
      res.headers.set("Cache-Control", "no-store")
      res.headers.set("Vary", "Cookie")
      return res
    }

    const u = data.user
    const nickname = (u.user_metadata as any)?.nickname ?? u.email?.split("@")[0] ?? null
    const avatarUrl = (u.user_metadata as any)?.avatar_url ?? null

    console.info("[/api/auth/login] OK", {
      email: maskEmail(u.email),
      userId: u.id,
      tookMs: Date.now() - startedAt,
    })

    const res = NextResponse.json(
      { user: { id: u.id, email: u.email, nickname, avatarUrl } },
      { status: 200 },
    )
    applyCookies(res) // ★ 成功時も適用
    res.headers.set("Cache-Control", "no-store")
    res.headers.set("Vary", "Cookie")
    return res
  } catch (e: any) {
    console.error("[/api/auth/login] EXCEPTION", { email: maskEmail(email), message: e?.message })
    return NextResponse.json(
      { error: e?.message ?? "unexpected error", code: "EXCEPTION" },
      { status: 500 },
    )
  }
}
