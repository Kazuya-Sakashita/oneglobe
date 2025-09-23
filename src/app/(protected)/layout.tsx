// src/app/(protected)/layout.tsx
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

const SUPPORTED_LOCALES = ["ja", "en"] as const

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    const h = await headers()
    const currentPath = h.get("x-pathname") ?? "/"
    const seg = currentPath.split("/").filter(Boolean)[0] ?? ""
    const locale = (SUPPORTED_LOCALES as readonly string[]).includes(seg) ? seg : null

    const loginPath = locale ? `/${locale}/login` : "/login"
    const fallbackNext = locale ? `/${locale}/rooms` : "/rooms"
    const nextParam = encodeURIComponent(currentPath || fallbackNext)

    redirect(`${loginPath}?next=${nextParam}`)
  }

  return <>{children}</>
}
