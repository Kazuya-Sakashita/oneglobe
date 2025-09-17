// src/app/(protected)/layout.tsx
import { redirect } from "next/navigation"
import { supabaseRsc } from "@/lib/supabase/rsc"

export const dynamic = "force-dynamic"
export const revalidate = 0
export const fetchCache = "force-no-store"

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await supabaseRsc()
  const { data } = await supabase.auth.getUser()

  if (!data?.user) {
    redirect("/login?next=/rooms") // ここで NEXT_REDIRECT を投げる（OK）
  }

  return <>{children}</>
}
