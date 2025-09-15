// src/app/(protected)/rooms/page.tsx
export default function RoomsPage() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Rooms</h2>
      <p className="text-muted-foreground mt-2">認証済みユーザーのみが見られるページです。</p>
    </div>
  )
}
