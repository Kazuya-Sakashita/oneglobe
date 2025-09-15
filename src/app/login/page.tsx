// src/app/login/page.tsx
"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginForm } from "@/components/auth/login-form"

type SubmitResult = { ok: true } | { ok: false; message: string; code?: string }

export default function LoginPage() {
  const router = useRouter()
  const q = useSearchParams()
  const next = q.get("next") || "/rooms"

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      })

      const text = await res.text()
      let json: any = {}
      try {
        json = JSON.parse(text)
      } catch {}

      if (!res.ok) {
        const message = json?.error || text || "ログインに失敗しました"
        setError(message)
        console.error("LOGIN FAIL:", { status: res.status, body: json || text })
        return { ok: false, message }
      }

      console.log("LOGIN OK:", json)
      router.replace(next)
      return { ok: true }
    } catch (e: any) {
      const message = e?.message || "ネットワークエラー"
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
      </div>
    </main>
  )
}
