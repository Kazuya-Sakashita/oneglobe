
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

export const metadata = {
  title: 'OneGlobe',
  description: 'One world, one conversation.'
};

// Root はドキュメントシェルのみ（<html>/<body>は Root だけで描画）
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" dir="ltr" suppressHydrationWarning>
      <body style={{ fontFamily: 'var(--font-sans)' }}>
        {children}
         <Toaster />
      </body>
    </html>
  );
}
