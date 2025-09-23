/* cspell:ignore NextRequest NextResponse eque */
// cspell:disable-next-line
import { NextRequest, NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  const { email, password, nickname } = (await req.json().catch(() => ({}))) as {
    email?: string
    password?: string
    nickname?: string
  }

  if (!email || !password) {
    return NextResponse.json({ error: "email と password は必須です" }, { status: 400 })
  }

  const supabase = await supabaseServer()
  const origin = req.nextUrl.origin

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nickname },
      // メール内リンクの遷移先（code を受け取ってサーバでセッション交換）
      emailRedirectTo: `${origin}/api/auth/callback`,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // ここでは確認メール送信のステータスを返す（メール確認を有効にしている前提）
  return NextResponse.json(
    { ok: true, emailSent: !!data?.user?.identities?.length || true },
    { status: 200 },
  )
}
