// src/app/(protected)/rooms/page.tsx
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import LogoutButton from '@/app/components/LogoutButton'

export const dynamic = 'force-dynamic'

export default async function RoomsPage() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="p-6 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">こちらはルームです</h1>
        <LogoutButton />
      </header>

      {/* ルーム本体 */}
      <div>・・・</div>
    </main>
  )
}
