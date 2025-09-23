// src/lib/supabase/route.ts
import { NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

type CookieRecord = { name: string; value: string; options?: CookieOptions }

export function supabaseRoute(req: NextRequest) {
  const host = req.headers.get("host") ?? ""
  const isLocalhost = host.startsWith("localhost") || host.startsWith("127.0.0.1")
  const isHttps = req.nextUrl.protocol === "https:"
  const secure = !isLocalhost && isHttps

  const jar: CookieRecord[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        secure,             // ★ ローカルは false、本番(https)は true
        sameSite: "lax",
        path: "/",
      },
      cookies: {
        getAll: () => {
          const all = req.cookies.getAll()
          console.log("[supabaseRoute] getAll ->", all.map(c => c.name))
          return all
        },
        setAll: (cookiesToSet) => {
          console.log("[supabaseRoute] setAll <-", cookiesToSet.map(c => c.name))
          cookiesToSet.forEach(({ name, value, options }) => {
            jar.push({ name, value, options: options as CookieOptions })
          })
        },
      },
    },
  )

  // 最終レスポンスに Cookie を確実に適用
  const applyCookies = (res: Response & { cookies?: any }) => {
    const anyRes = res as any
    if (anyRes?.cookies?.set) {
      jar.forEach(({ name, value, options }) => {
        anyRes.cookies.set({ name, value, ...(options || {}) })
      })
    } else {
      // 念のためヘッダ直付け（複数 Set-Cookie 対応）
      jar.forEach(({ name, value, options }) => {
        const parts = [
          `${name}=${value}`,
          `Path=${options?.path ?? "/"}`,
          `SameSite=${(options?.sameSite ?? "lax").toString().replace(/^[a-z]/, s => s.toUpperCase())}`,
          (options?.maxAge != null) ? `Max-Age=${options.maxAge}` : "",
          options?.expires ? `Expires=${new Date(options.expires).toUTCString()}` : "",
          (options?.secure ?? secure) ? "Secure" : "",
          (options?.httpOnly ?? true) ? "HttpOnly" : "",
        ].filter(Boolean)
        ;(res.headers as any).append("Set-Cookie", parts.join("; "))
      })
    }

    // デバッグヘッダ
    res.headers.set("X-Debug-Set-Cookie-Count", String(jar.length))
    res.headers.set("X-Debug-Cookie-Secure", String(secure))
  }

  return { supabase, applyCookies }
}
