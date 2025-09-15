/* cspell:ignore useEffect */
"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session"

/**
 * クライアント側でログイン状態を監視し、未ログインなら /login へ退避。
 * SSR 側の (protected)/layout で通した後の二重安全装置として使う。
 */
export function ClientAuthGate() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?next=${encodeURIComponent(path)}`)
    }
  }, [isLoading, user, path, router])

  return null
}
