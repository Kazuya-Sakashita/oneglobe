// middleware.ts
import { NextResponse, type NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { locales, defaultLocale } from "./src/i18n"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isApi = pathname.startsWith("/api")
  const isNextAsset = pathname.startsWith("/_next")
  const isStaticFile = /\.[^/]+$/.test(pathname) // *.css, *.js, *.png など

  // ---- 1) i18nリダイレクト（ページのみ。APIや静的は除外） ----
  let response: NextResponse | undefined
  if (!isApi && !isNextAsset && !isStaticFile) {
    const hasLocale = (locales as readonly string[]).some(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
    )
    if (!hasLocale) {
      const url = request.nextUrl.clone()
      url.pathname = `/${defaultLocale}${pathname}`
      response = NextResponse.redirect(url)
    }
  }

  // レスポンスが未生成なら通常継続のレスポンスを作る
  if (!response) {
    response = NextResponse.next({
      request: { headers: request.headers },
    })
  }

  // ---- 2) Supabase セッション更新（全リクエストで実施）----
  //   - request.cookies を読み、必要なら response.cookies に書き戻す
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response!.cookies.set({ name, value, ...(options as CookieOptions) })
          })
        },
      },
    },
  )

  // 触るだけでリフレッシュ判定が走り、必要なら Cookie が更新される
  await supabase.auth.getUser().catch(() => {
    // 取得失敗は無視（未ログインなど）
  })

  return response
}

// _next の静的配信や画像、favicon 等は除外するが、API は除外しない（セッション更新のため）
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
