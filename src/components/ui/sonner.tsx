// src/components/ui/sonner.tsx
"use client"
import { Toaster as SonnerToaster } from "sonner"
export function Toaster() {
  return <SonnerToaster richColors position="top-center" toastOptions={{ duration: 3000 }} />
}
