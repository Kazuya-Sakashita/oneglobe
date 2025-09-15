/* cspell:ignore placeholder allowed FormEvent HTMLElement */
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

type SubmitResult = { ok: true } | { ok: false; message: string; code?: string }

type Props = {
  // ← 必須にする
  onSubmit: (payload: { email: string; password: string }) => Promise<void | SubmitResult> | void | SubmitResult
  loading?: boolean
  error?: string | null
}

export function LoginForm({ onSubmit, loading = false, error = null }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  const showError = (message: string) => {
    setLocalError(message)
    toast.error("ログインに失敗しました", { description: message })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError(null)

    if (!email || !password) {
      showError("すべての項目を入力してください。")
      return
    }

    try {
      const result = await onSubmit({ email, password })
      if (result && typeof result === "object" && "ok" in result && result.ok === false) {
        showError(result.message || "不明なエラーが発生しました。")
        return
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : typeof err === "string" ? err : "予期しないエラーが発生しました。"
      showError(msg)
      return
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-text-primary font-medium">メールアドレス</Label>
        <Input id="email" type="email" placeholder="your@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border-oneglobe focus:ring-brand-primary focus:border-brand-primary"
          autoComplete="email" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-text-primary font-medium">パスワード</Label>
        <Input id="password" type="password" placeholder="パスワードを入力" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border-oneglobe focus:ring-brand-primary focus:border-brand-primary"
          autoComplete="current-password" required />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center space-x-2 text-text-secondary">
          <input type="checkbox" className="rounded border-oneglobe" />
          <span>ログイン状態を保持</span>
        </label>
        <a href="/forgot-password" className="text-brand-primary hover:text-brand-secondary transition-colors">
          パスワードを忘れた方
        </a>
      </div>

      {(error || localError) && (
        <p className="text-red-600 text-sm" role="alert" aria-live="polite">
          {error ?? localError}
        </p>
      )}

      <Button type="submit" disabled={loading} aria-busy={loading}
        className="w-full gradient-globe text-white font-semibold py-3 rounded-xl shadow-oneglobe hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
        {loading ? "ログイン中..." : "OneGlobeを続ける"}
      </Button>
    </form>
  )
}
