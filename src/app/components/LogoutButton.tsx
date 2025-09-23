// src/app/_components/LogoutButton.tsx
'use client'

import { useRouter, usePathname } from 'next/navigation'

// すでに用意していればそれを使ってOK
async function logoutClient() {
  await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' })

  // 複数タブ同期（BroadcastChannel → localStorage フォールバック）
  try {
    const ch = new BroadcastChannel('oneglobe:auth')
    ch.postMessage({ type: 'logout', at: Date.now() })
    ch.close()
  } catch {
    const key = 'oneglobe:auth-event'
    localStorage.setItem(key, JSON.stringify({ type: 'logout', at: Date.now() }))
    localStorage.removeItem(key)
  }
}

const SUPPORTED_LOCALES = ['ja', 'en'] as const

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const seg = pathname.split('/').filter(Boolean)[0] ?? ''
  const hasLocale = (SUPPORTED_LOCALES as readonly string[]).includes(seg)
  const loginPath = hasLocale ? `/${seg}/login` : '/login'

  return (
    <button
      className={className ?? 'px-3 py-2 rounded-md border'}
      onClick={async () => {
        await logoutClient()
        router.replace(loginPath)
        router.refresh() // RSCガードを即反映
      }}
    >
      ログアウト
    </button>
  )
}
