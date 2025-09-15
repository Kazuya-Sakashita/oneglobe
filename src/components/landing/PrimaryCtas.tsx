import Link from "next/link"
import { Button } from "@/components/ui/button"

type Props = {
  signupHref?: string
  loginHref?: string
}
export function PrimaryCtas({ signupHref = "/signup", loginHref = "/login" }: Props) {
  return (
    <nav aria-label="primary actions" className="flex flex-col sm:flex-row gap-3 justify-center">
      <Button asChild size="lg"
        className="gradient-globe text-white font-semibold rounded-xl shadow-oneglobe hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5">
        <Link href={signupHref}>Get Started</Link>
      </Button>
      <Button asChild size="lg" variant="outline"
        className="bg-white text-brand-primary font-semibold rounded-xl border-2 border-brand-primary hover:bg-brand-primary hover:text-white transition-all duration-200">
        <Link href={loginHref}>Sign In</Link>
      </Button>
    </nav>
  )
}
