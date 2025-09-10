import './globals.css'
import '@/app/styles/tokens.css'

export const metadata = {
  title: 'OneGlobe',
  description: 'One world, one conversation.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body style={{ fontFamily: 'var(--font-sans)' }}>{children}</body>
    </html>
  )
}
