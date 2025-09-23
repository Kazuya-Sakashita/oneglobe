// src/lib/supabase/rsc.ts
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

const DEV = process.env.NODE_ENV !== "production"
const DBG = process.env.SUPABASE_DEBUG === "1"

export async function supabaseRsc() {
  const cookieStore = await cookies()

  if (DBG) {
    // どんな Cookie が来ているかだけ控える（値は出さない）
    const names = cookieStore.getAll().map((c) => c.name)
    console.info("[supabaseRsc] incoming cookies:", names)
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const all = cookieStore.getAll()
          if (DBG) {
            console.info("[supabaseRsc] getAll ->", all.map((c) => c.name))
          }
          return all
        },
        // ★ RSC では cookies().set が禁止のため、ここは no-op にする
        setAll(cookiesToSet) {
          if (DEV || DBG) {
            console.warn(
              "[supabaseRsc] setAll called in RSC (ignored). " +
                "Cookie updates are handled by middleware/route handlers.",
              cookiesToSet.map((c) => ({
                name: c.name,
                // 値は出さない
                hasValue: Boolean(c.value),
                options: {
                  maxAge: c.options?.maxAge,
                  sameSite: c.options?.sameSite,
                  path: c.options?.path,
                  secure: c.options?.secure,
                },
              })),
            )
          }
          // ここでは何もしない（書き込み禁止のため）
        },
      },
    },
  )
}
