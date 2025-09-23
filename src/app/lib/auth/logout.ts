// src/app/_lib/auth/logout.ts
'use client'

const CH_NAME = 'oneglobe:auth'
const LS_KEY = 'oneglobe:auth-event'

export async function logoutClient() {
  await fetch('/api/auth/logout', { method: 'POST', cache: 'no-store' })

  // 全タブへ通知（BroadcastChannel → localStorage フォールバック）
  try {
    const ch = new BroadcastChannel(CH_NAME)
    ch.postMessage({ type: 'logout', at: Date.now() })
    ch.close()
  } catch {
    localStorage.setItem(LS_KEY, JSON.stringify({ type: 'logout', at: Date.now() }))
    localStorage.removeItem(LS_KEY)
  }
}
