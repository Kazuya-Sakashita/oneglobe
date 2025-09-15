// src/app/(protected)/layout.tsx
import { ReactNode } from "react"
import { redirect } from "next/navigation"
import { supabaseServer } from "@/lib/supabase/server"
import { ClientAuthGate } from "@/components/auth/client-auth-gate"

export default async function ProtectedLayout({ children }: { children: ReactNode }) {
  const supabase = await supabaseServer()
  const { data } = await supabase.auth.getUser()
  if (!data.user) {
    redirect("/login")
  }

  // SSRで通してから、クライアント側でもログアウト検知して即時リダイレクト
  return (
    <>
      <ClientAuthGate />
      {children}
    </>
  )
}
