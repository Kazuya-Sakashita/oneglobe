/* cspell:ignore placeholder allowed FormEvent HTMLElement olde */
"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

/* cspell:ignore placeholder FormEvent */

type Props = {
  onSubmit?: (payload: { email: string; password: string; nickname?: string }) => Promise<void> | void
  loading?: boolean
  error?: string | null
}

export function SignupForm({ onSubmit, loading = false, error = null }: Props) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [nickname, setNickname] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password || !confirm) {
      toast.error("エラー", { description: "必須項目を入力してください。" })
      return
    }
    if (password !== confirm) {
      toast.error("パスワード不一致", { description: "確認用パスワードが一致しません。" })
      return
    }
    if (onSubmit) {
      await onSubmit({ email, password, nickname: nickname || undefined })
    } else {
      toast("デモモード", { description: "onSubmit が未設定です。" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nickname" className="text-text-primary font-medium">
          ニックネーム（任意）
        </Label>
        <Input
          id="nickname"
          type="text"
          placeholder="例）your nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="rounded-xl border-oneglobe focus:ring-brand-primary focus:border-brand-primary"
          autoComplete="nickname"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-text-primary font-medium">
          メールアドレス
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border-oneglobe focus:ring-brand-primary focus:border-brand-primary"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-text-primary font-medium">
          パスワード
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="8文字以上のパスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded-xl border-oneglobe focus:ring-brand-primary focus:border-brand-primary"
          autoComplete="new-password"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm" className="text-text-primary font-medium">
          パスワード（確認）
        </Label>
        <Input
          id="confirm"
          type="password"
          placeholder="もう一度入力"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="rounded-xl border-oneglobe focus:ring-brand-primary focus:border-brand-primary"
          autoComplete="new-password"
          required
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm" role="alert">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={loading}
        aria-busy={loading}
        className="w-full gradient-globe text-white font-semibold py-3 rounded-xl shadow-oneglobe hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? "作成中..." : "アカウントを作成する"}
      </Button>
    </form>
  )
}
