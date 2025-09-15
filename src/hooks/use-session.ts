// src/hooks/use-session.ts
"use client"

import useSWR from "swr"
import { useEffect } from "react"
import { supabaseBrowser } from "@/lib/supabase/browser"

type UserLite = {
  id: string
  email: string | null
  nickname: string | null
  avatarUrl: string | null
}
type SessionResponse = { user: UserLite | null }

const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((r) => r.json() as Promise<SessionResponse>)

export function useSession() {
  const { data, error, isLoading, mutate } = useSWR<SessionResponse>("/api/session", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
  })

  // Supabase 認証イベント（ログイン/ログアウト/更新）で再検証
  useEffect(() => {
    const supabase = supabaseBrowser()
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      mutate()
    })
    return () => {
      sub.subscription.unsubscribe()
    }
  }, [mutate])

  return {
    user: data?.user ?? null,
    isLoading,
    error,
    refresh: () => mutate(),
  }
}
