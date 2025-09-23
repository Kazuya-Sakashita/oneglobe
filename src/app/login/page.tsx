// src/app/login/page.tsx
'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { LoginForm } from '@/components/auth/login-form'

type SubmitResult = { ok: true } | { ok: false; message: string; code?: string }

export default function LoginPage() {
  const router = useRouter()
  const pathname = usePathname()
  const q = useSearchParams()

  // next=? の安全な決定（/ で始まるものだけ許可、ロケール前置きも考慮）
const SUPPORTED_LOCALES = ['ja', 'en'] as const

const finalNext = useMemo(() => {
  const nextQ = q.get('next')
  if (nextQ && nextQ.startsWith('/')) {
    return nextQ.replace(/\/{2,}/g, '/')
  }
  const seg = (pathname || '').split('/').filter(Boolean)[0] // 先頭セグメント
  const locale = seg && SUPPORTED_LOCALES.includes(seg as any) ? seg : null
  return locale ? `/${locale}/rooms` : '/rooms'
}, [q, pathname])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }): Promise<SubmitResult> => {
    setLoading(true)
    setError(null)

    try {
      // マスクしてログに残す
      const emailMasked = email.replace(/(^.).*(@.*$)/, (_m, a, b) => `${a}***${b}`)
      console.log('[LOGIN] start', { emailMasked })

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
        cache: 'no-store', // 認証系はHTTPキャッシュ回避
      })

      // JSON/テキストどちらでも耐える
      const text = await res.text()
      let json: any = null
      try {
        json = JSON.parse(text)
      } catch {
        /* noop */
      }

      if (!res.ok) {
        const message = json?.error || text || 'ログインに失敗しました'
        console.error('[LOGIN] fail', { status: res.status, body: json || text })
        setError(message)
        return { ok: false, message }
      }

      console.log('[LOGIN] ok -> navigating', {
        finalNext,
        // サーバが Set-Cookie を返したかのヒント（ブラウザではヘッダを見られないこともある）
        setCookieHeaderPresentHint: res.headers.get('set-cookie') ? 'present' : 'n/a',
      })

      // 置き換え遷移 → 直後にRSC/SWR再検証
      router.replace(finalNext)
      router.refresh()

      return { ok: true }
    } catch (e: any) {
      const message = e?.message || 'ネットワークエラー'
      console.error('[LOGIN] exception', e)
      setError(message)
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 border p-6 rounded-xl bg-card text-card-foreground">
        <h1 className="text-xl font-bold">ログイン</h1>
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        {/* 開発時の確認用（不要なら削除可） */}
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">next = {finalNext}</pre>
      </div>
    </main>
  )
}
