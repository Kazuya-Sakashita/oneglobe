// src/hooks/use-session.ts
"use client"

import useSWR from "swr"
import { useEffect, useMemo } from "react"
import { supabaseBrowser } from "@/lib/supabase/browser"

export type UserLite = {
  id: string
  email: string | null
  nickname: string | null
  avatarUrl: string | null
}
export type SessionResponse = { user: UserLite | null }
export type SessionStatus = "loading" | "authenticated" | "unauthenticated" | "error"

const normalizeSession = (raw: any): SessionResponse => {
  if (!raw || typeof raw !== "object") return { user: null }
  if ("user" in raw) return { user: raw.user as UserLite | null }
  if ("id" in raw) {
    const { id, email = null, nickname = null, avatarUrl = null } = raw
    return id ? { user: { id, email, nickname, avatarUrl } } : { user: null }
  }
  return { user: null }
}

// 401 は未ログインとして扱い、それ以外の !ok は SWR の error に投げる
const fetcher = async (url: string): Promise<SessionResponse> => {
  const res = await fetch(url, { credentials: "include", cache: "no-store" })

  if (res.status === 401) return { user: null }

  // JSONが空でも例外にせず丸める
  let data: any = null
  try {
    data = await res.json()
  } catch {
    /* no body */
  }

  if (!res.ok) {
    const msg = data?.message ?? data?.error ?? `HTTP ${res.status}`
    throw new Error(msg)
  }

  return normalizeSession(data)
}

export function useSession() {
  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR<SessionResponse>("/api/session", fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 800, // 連打抑制
    focusThrottleInterval: 1500,
    shouldRetryOnError: false, // 認証系は無限リトライしない
  })

  // Supabase 認証イベント（login/logout/token refresh）で再検証
  useEffect(() => {
    const supabase = supabaseBrowser()
    const sub = supabase.auth.onAuthStateChange(() => {
      mutate() // 最新化
    })
    return () => {
      sub.data?.subscription?.unsubscribe?.()
    }
  }, [mutate])

  const user = data?.user ?? null
  const authorized = !!user
  const status: SessionStatus = useMemo(() => {
    if (isLoading && !data && !error) return "loading"
    if (error) return "error"
    return authorized ? "authenticated" : "unauthenticated"
  }, [authorized, isLoading, data, error])

  return {
    user,
    authorized,
    status,
    isLoading,
    error,
    refresh: () => mutate(),
  }
}
