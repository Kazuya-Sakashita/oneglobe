import { BrandMark } from "@/components/brand/BrandMark"
import { PrimaryCtas } from "@/components/landing/PrimaryCtas"

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background grid place-items-center px-6">
      <section className="text-center space-y-6 p-8">
        <BrandMark />
        <header className="space-y-2">
          <h1 className="text-4xl font-bold text-text-primary">OneGlobe</h1>
          <p className="text-xl text-text-secondary">One world, one conversation.</p>
        </header>
        <div className="space-y-4">
          <PrimaryCtas />
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Real-time chat with automatic translation to connect the world
          </p>
        </div>
      </section>
    </main>
  )
}
