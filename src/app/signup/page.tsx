"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SignupForm } from "@/components/auth/signup-form"
import { toast } from "sonner"

export default function SignupPage() {
  const router = useRouter()
  const q = useSearchParams()
  const next = q.get("next") || "/rooms"

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async ({
    email,
    password,
    nickname,
  }: {
    email: string
    password: string
    nickname?: string
  }) => {
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, nickname }),
    })

    const json = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok) {
      const message = json?.error ?? "登録に失敗しました"
      setError(message)
      toast.error("登録エラー", { description: message })
      return
    }

    // メール確認を有効にしている前提：確認リンクから /api/auth/callback → アプリへ戻す
    toast("確認メールを送信しました", {
      description: "メール内のリンクから認証を完了してください。",
    })
    // すぐログインさせたい運用なら、ここで router.replace(next) に切り替えてください
    router.replace(`/login?email=${encodeURIComponent(email)}`)
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6 border p-6 rounded-xl bg-card text-card-foreground">
        <h1 className="text-xl font-bold">新規登録</h1>
        <SignupForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </main>
  )
}
