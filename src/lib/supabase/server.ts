// src/lib/supabase/server.ts
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

export async function supabaseServer() {
  const cookieStore = await cookies() // Next.js 15 は await 必須

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // 読み取り
        getAll() {
          return cookieStore.getAll()
        },
        // 設定（RSC からの set は失敗することがあるので try/catch）
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({
                name,
                value,
                ...(options ?? {}),
              })
            })
          } catch {
            // RSC 経由で set 不能な場合は無視
          }
        },
      },
    },
  )
}
