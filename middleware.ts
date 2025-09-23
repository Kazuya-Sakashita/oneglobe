// middleware.ts
import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { locales, defaultLocale } from './src/i18n'

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  const isApi = pathname.startsWith('/api')
  const isNextAsset = pathname.startsWith('/_next')
  const isStaticFile = /\.[^/]+$/.test(pathname) // *.css, *.js, *.png など

  // ---- 0) 次画面で参照できるよう現在のパスをヘッダに埋め込む ----
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname + search)

  // ---- 1) i18n リダイレクト（ページのみ。APIや静的は除外）----
  if (!isApi && !isNextAsset && !isStaticFile) {
    const hasLocale = (locales as readonly string[]).some(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
    )
    if (!hasLocale) {
      const url = request.nextUrl.clone()
      url.pathname = `/${defaultLocale}${pathname}`
      // クエリはそのまま
      return NextResponse.redirect(url)
    }
  }

  // レスポンス（通常継続）。以降で Cookie を書き戻すために使います
  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // ---- 2) Supabase セッション更新（全リクエストで実施）----
  // request.cookies を読み、必要なら response.cookies に書き戻す
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
            // Next.js の cookies().set は (name, value, options) 形式
            response.cookies.set(name, value, options as CookieOptions)
          })
        },
      },
    }
  )

  // 触るだけでトークンの有効期限等に応じた Cookie 更新が走る
  try {
    await supabase.auth.getUser()
  } catch {
    // 未ログインやネットワークエラー等は無視
  }

  return response
}

// _next の静的配信や画像、favicon 等は除外するが、API は除外しない（セッション更新のため）
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
