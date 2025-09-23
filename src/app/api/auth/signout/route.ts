/* cspell:ignore NextRequest NextResponse eque */
// cspell:disable-next-line
import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase/server"

export async function POST() {
  const supabase = await supabaseServer()
  const { error } = await supabase.auth.signOut()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json({ ok: true }, { status: 200 })
}
