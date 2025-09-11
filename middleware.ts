import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {locales, defaultLocale} from './src/i18n';

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // 静的/Api は除外
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return;
  }

  // すでに /ja /en のようにロケールがついていれば何もしない
  const hasLocale = (locales as readonly string[]).some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return;

  // 付いていなければ defaultLocale を付与してリダイレクト
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)']
};
