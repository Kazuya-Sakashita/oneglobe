// src/app/_components/AuthSync.tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { mutate as globalMutate } from 'swr'

const CH_NAME = 'oneglobe:auth'
const LS_KEY = 'oneglobe:auth-event'

export default function AuthSync() {
  const router = useRouter()

  useEffect(() => {
    const onLogout = () => {
      // /api/session のキャッシュを即未ログイン状態に
      globalMutate('/api/session', { id: null, nickname: null, avatarUrl: null }, false)
      router.refresh() // RSCガードを即反映
    }

    let ch: BroadcastChannel | null = null
    try {
      ch = new BroadcastChannel(CH_NAME)
      ch.onmessage = (e) => { if (e?.data?.type === 'logout') onLogout() }
    } catch {}

    const onStorage = (e: StorageEvent) => { if (e.key === LS_KEY) onLogout() }
    window.addEventListener('storage', onStorage)

    return () => {
      if (ch) ch.close()
      window.removeEventListener('storage', onStorage)
    }
  }, [router])

  return null
}
