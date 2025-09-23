// src/lib/supabase/server.ts
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

// Next.js の Cookie serialize に合わせて sameSite は boolean も許容
type CookieOptions = {
  domain?: string
  path?: string
  expires?: Date
  httpOnly?: boolean
  secure?: boolean
  sameSite?: boolean | 'lax' | 'strict' | 'none'
  maxAge?: number
} | undefined

/**
 * Next.js 15 対応：
 * - RSC: cookies() は読み取り専用（set 不可）→ try/catch + オプショナル呼び出しで握る
 * - Route: cookies().set が利用可能
 * - @supabase/ssr は { getAll, setAll } を受け付ける
 */
export async function createSupabaseServerClient() {
  const cookieStore = (await cookies()) as any // RSC では set がないため any キャストで握る

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return cookieStore.getAll?.() ?? []
          } catch {
            return []
          }
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // ✅ オブジェクト渡しではなく、name/value/options の 3 引数で呼ぶ
              cookieStore.set?.(name, value, options ?? {})
            })
          } catch {
            // RSC 経由で set 不能なケースは無視（/auth/callback でサーバ Cookie 同期）
          }
        },
      },
    }
  )
}
