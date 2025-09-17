"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"

type SubmitResult = { ok: true } | { ok: false; message: string; code?: string }

export default function LoginPage() {
  const router = useRouter()
  const pathname = usePathname()
  const q = useSearchParams()

  // next=? が無効なら /rooms。ロケール前置きの考慮（/ja/login → /ja/rooms）
  const finalNext = useMemo(() => {
    const nextQ = q.get("next")
    if (nextQ && nextQ.startsWith("/")) return nextQ
    // pathname が /ja/login のようなとき、先頭セグメントをロケールとして流用
    const m = /^\/([a-zA-Z-]+)(\/|$)/.exec(pathname || "")
    const locale = m?.[1]
    return locale && locale.length <= 5 ? `/${locale}/rooms` : "/rooms"
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
      console.log("[LOGIN] start", { emailMasked: email.replace(/(^.).*(@.*$)/, (_m, a, b) => `${a}***${b}`) })

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        body: JSON.stringify({ email: email.trim(), password }),
        // 重要: 認証系は no-store を明示的に（App Router は基本OKだが保険）
      })

      const text = await res.text()
      let json: any = null
      try {
        json = JSON.parse(text)
      } catch {
        /* noop */
      }

      if (!res.ok) {
        const message = json?.error || text || "ログインに失敗しました"
        console.error("[LOGIN] fail", { status: res.status, body: json || text })
        setError(message)
        return { ok: false, message }
      }

      console.log("[LOGIN] ok -> navigating", { finalNext, setCookie: res.headers.get("set-cookie") ? "present" : "unknown" })

      // まず置き換えでページ遷移
      router.replace(finalNext)
      // 直後に再検証（RSC/SWR の最新化）
      router.refresh()

      // 念のため、少し待っても /login にいる場合はフルリロードで押し切る
      setTimeout(() => {
        if (window.location.pathname.includes("/login")) {
          console.warn("[LOGIN] still on /login, forcing hard navigation", { finalNext })
          window.location.assign(finalNext)
        }
      }, 600)

      return { ok: true }
    } catch (e: any) {
      const message = e?.message || "ネットワークエラー"
      console.error("[LOGIN] exception", e)
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
        {/* デバッグ表示（必要なら残す） */}
        <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
          next = {finalNext}
        </pre>
      </div>
    </main>
  )
}
