import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

// Shared chrome for the /privacy and /terms pages. The rest of the site is
// force-lowercased via the <body> class; legal prose needs proper casing
// (trademarks like "OpenAI"/"Google", readability), so the <main> here resets to
// `normal-case` + `tracking-normal`. The brand chrome (wordmark, footer) stays
// lowercase by living outside that <main>.

export function LegalShell({
  title,
  lastUpdated,
  children
}: {
  title: string
  lastUpdated: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-5 sm:px-6">
          <Link href="/" className="font-serif text-xl italic tracking-tight">
            friday
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            back to home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 normal-case tracking-normal sm:px-6 sm:py-16">
        <h1 className="font-serif text-3xl italic tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {lastUpdated}</p>
        <div>{children}</div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
          <p>© 2026 friday. all rights reserved.</p>
          <nav className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              terms
            </Link>
            <Link href="/" className="transition-colors hover:text-foreground">
              home
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}

// ── Prose primitives — keep the page files readable and styling consistent ──

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      {title ? (
        <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      ) : null}
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 text-base font-semibold text-foreground">{children}</h3>
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[15px] leading-relaxed text-muted-foreground">{children}</p>
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted-foreground">
      {children}
    </ul>
  )
}

export function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-medium text-foreground">{children}</strong>
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-foreground underline underline-offset-4 transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  )
}
