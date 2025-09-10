import { Button } from '@/app/components/ui/Button'
import { Input } from '@/app/components/ui/Input'
import { Badge } from '@/app/components/ui/Badge'


export default function DesignTest() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Design System Test</h1>

      <div className="space-x-2">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
      </div>

      <Input placeholder="Type here..." />

      <div className="space-x-2">
        <Badge label="Accent" color="accent" />
        <Badge label="Warning" color="warning" />
        <Badge label="Default" />
      </div>
    </main>
  )
}
