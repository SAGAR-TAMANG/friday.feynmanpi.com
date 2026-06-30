'use client'

import { useEffect, useState } from 'react'
import { ArrowRight, Download, Github, Mic } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

type OS = 'windows' | 'mac'

const SAMPLE_PROMPTS = [
  '"hey friday, what\'s in the news today?"',
  '"friday, search the web for the latest livekit release"',
  '"friday, what time is it in tokyo right now?"',
  '"friday, open the world monitor on screen."',
  '"friday, summarize this article for me."',
  '"friday, what\'s on my system right now?"',
]

const OS_LABEL: Record<OS, string> = { windows: 'windows', mac: 'mac' }

// Best-effort client-side OS detection. Prefers the modern User-Agent Client
// Hints API and falls back to the (deprecated but widely supported)
// navigator.platform / userAgent strings. Returns null when undetermined.
function detectOS(): OS | null {
  if (typeof navigator === 'undefined') return null
  const uaData = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData
  const hint = (uaData?.platform || navigator.platform || navigator.userAgent || '').toLowerCase()
  if (hint.includes('win')) return 'windows'
  if (hint.includes('mac') || hint.includes('darwin')) return 'mac'
  return null
}

export default function Home() {
  // null until detected on the client — avoids any SSR/hydration mismatch.
  const [detected, setDetected] = useState<OS | null>(null)

  useEffect(() => {
    setDetected(detectOS())
  }, [])

  // Default to Windows when detection is inconclusive.
  const primary: OS = detected ?? 'windows'
  const other: OS = primary === 'windows' ? 'mac' : 'windows'

  // Resolves the latest build for the OS from the R2 bucket via /api/download.
  // If that platform's build hasn't been uploaded yet, the route returns a
  // friendly error which we surface in the toast — no download is started.
  const handleDownload = async (os: OS) => {
    const label = os === 'windows' ? 'Windows' : 'macOS'
    const loadingId = toast.loading(`Locating latest ${label} version...`)
    try {
      const res = await fetch(`/api/download?os=${os}&urlOnly=true`)
      const data = await res.json()

      if (!res.ok || data.error) {
        toast.error('Download not ready yet', {
          description: data.error || `The ${label} build is not available yet.`,
          id: loadingId,
        })
        return
      }

      toast.success('Thank you for downloading!', {
        description: 'Your download will begin shortly.',
        id: loadingId,
      })
      window.location.href = data.url
    } catch {
      toast.error('Download failed', {
        description: 'A network error occurred.',
        id: loadingId,
      })
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero — full-screen height on every device; the video itself is a
          shorter, vertically-centered band on mobile so more of it is visible. */}
      <section className="relative min-h-svh w-full overflow-hidden">
        {/* Blurred full-bleed backdrop — fills the empty areas around the
            centered mobile video band so it isn't flat black. */}
        <video
          playsInline
          autoPlay
          muted
          loop
          preload='auto'
          aria-hidden='true'
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-2xl"
        >
          <source src="/scene-01.mp4" type="video/mp4" />
        </video>

        {/* Background video — centered ~60svh band on mobile, full-bleed from sm up */}
        <video
          playsInline
          autoPlay
          muted
          loop
          preload='auto'
          aria-hidden='true'
          className="absolute inset-x-0 top-1/2 h-[60svh] w-full -translate-y-1/2 object-cover sm:top-0 sm:h-full sm:translate-y-0"
        >
          <source src="/scene-01.mp4" type="video/mp4" />
        </video>
        {/* Legibility overlay + fade into the page below */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/25 to-background" />

        {/* Overlay navigation */}
        <nav className="absolute inset-x-0 top-0 z-30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center justify-center gap-2">
                {/* <Image src="/icon.svg" alt="Logo" width={24} height={24} className='bg-gray-100/30 rounded-lg' /> */}
                <span className="text-lg font-semibold lowercase tracking-tighter font-playfair italic text-start text-top">friday</span>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href="https://github.com/SAGAR-TAMANG/friday-tony-stark-demo"
                  className="hidden sm:inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  target='_blank'
                >
                  <Github className="w-4 h-4" />
                  Star on GitHub
                </Link>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" className='lowercase backdrop-blur' asChild>
                    <Link href="https://cal.com/sagar-tamang" target="_blank" rel="noopener noreferrer">
                      Talk to me
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Bottom-anchored content: oversized headline left, download right. */}
        <div className="relative z-20 flex min-h-svh flex-col justify-end px-6 pb-12 sm:px-10 sm:pb-14 lg:px-16">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            {/* Headline */}
            <div className="max-w-xl text-left">
              <p className="mb-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                meet f.r.i.d.a.y.
              </p>
              <h1 className="!font-playfair font-normal leading-[0.9]">
                <span className="block text-6xl sm:text-7xl lg:text-8xl">
                  an <span className="italic">ai assistant</span>
                </span>
                <span className="mt-3 block text-xl sm:text-2xl lg:text-3xl text-muted-foreground">
                  that lives on your computer.
                </span>
              </h1>
            </div>

            {/* Download action */}
            <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
              <Button size="lg" onClick={() => handleDownload(primary)} className="lowercase hover:cursor-pointer">
                <Download className="mr-2 h-4 w-4" />
                download for {OS_LABEL[primary]}
              </Button>
              <button
                onClick={() => handleDownload(other)}
                className="text-xs lowercase text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground hover:cursor-pointer"
              >
                or download for {OS_LABEL[other]}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Sample prompts */}
      <section className="py-20 sm:py-28 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="mb-4">
              <Badge variant="outline">Just talk to it</Badge>
            </div>
            <h2 className="!font-playfair font-normal text-4xl sm:text-5xl mb-4 leading-tight">
              say it out <span className='italic'>loud</span>.
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              friday joins a livekit room, listens to your mic, and answers in a natural voice.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {SAMPLE_PROMPTS.map((prompt) => (
              <div
                key={prompt}
                className="group flex items-start gap-3 rounded-xl border border-border bg-card/40 p-4 transition-colors hover:border-primary/40 hover:bg-card"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Mic className="h-4 w-4" />
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground transition-colors group-hover:text-foreground">
                  {prompt}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo */}
      {/* <section id="demo" className="py-20 sm:py-28 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="mb-4">
              <Badge variant="outline">Demo</Badge>
            </div>
            <h2 className="!font-playfair font-normal text-4xl sm:text-5xl mb-4 leading-tight">
              see it <span className='italic'>working</span>.
            </h2>
            <p className="text-muted-foreground">
              a quick walk-through of friday answering live questions out loud.
            </p>
          </div>
          <div className="relative w-full overflow-hidden rounded-xl border border-border bg-black aspect-video">
            <iframe
              src="https://www.youtube.com/embed/mMY9swqe3BI"
              title="F.R.I.D.A.Y. demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </div>
      </section> */}

      {/* Platform */}
      <section id="download" className="py-20 sm:py-28 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Badge variant="secondary">Get friday</Badge>
          </div>
          <h2 className="!font-playfair font-normal text-4xl sm:text-5xl mb-6 leading-tight">
            built for your <span className='italic'>desktop</span>.
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            friday runs as a native app on both Windows and macOS. grab your build below — if a platform isn&apos;t live yet, we&apos;ll let you know.
          </p>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card className={`relative overflow-hidden transition-colors ${primary === 'windows' ? 'border-primary/50 ring-1 ring-primary/30 bg-gradient-to-b from-secondary/30 to-transparent' : ''}`}>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.05 13.5H6.95m10.1 0l-.5-5h-9.1l-.5 5M6.5 19h11l.5-5H6l.5 5z" strokeWidth="1.5" stroke="currentColor" fill="none" />
                    </svg>
                  </span>
                  {detected === 'windows' && <Badge className="text-[10px]">your device</Badge>}
                </div>
                <h3 className="text-xl font-semibold mb-2">Windows</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Windows 10 and newer. GPU acceleration where supported.
                </p>
                <Button
                  onClick={() => handleDownload('windows')}
                  variant={primary === 'windows' ? 'default' : 'secondary'}
                  className='w-full lowercase'
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download for windows
                </Button>
              </CardContent>
            </Card>
            <Card className={`relative overflow-hidden transition-colors ${primary === 'mac' ? 'border-primary/50 ring-1 ring-primary/30 bg-gradient-to-b from-secondary/30 to-transparent' : ''}`}>
              <CardContent className="pt-6">
                <div className="mb-4 flex items-start justify-between">
                  <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary">
                    <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 2H7c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" strokeWidth="0" />
                    </svg>
                  </span>
                  {detected === 'mac' && <Badge className="text-[10px]">your device</Badge>}
                </div>
                <h3 className="text-xl font-semibold mb-2">macOS</h3>
                <p className="text-muted-foreground text-sm mb-5">
                  Intel &amp; Apple Silicon. Native, with offline processing.
                </p>
                <Button
                  onClick={() => handleDownload('mac')}
                  variant={primary === 'mac' ? 'default' : 'secondary'}
                  className='w-full lowercase'
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download for mac
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card/40 px-6 py-16 sm:px-12 text-center">
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent" />
            <div className="relative">
              <h2 className="!font-playfair font-normal text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
                completely <span className='italic'>free</span>.
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                no sign-in, no credit card. open source, MIT licensed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
                <Button size="lg" onClick={() => handleDownload(primary)} className="lowercase">
                  <Download className="w-4 h-4 mr-2" />
                  Download for {OS_LABEL[primary]}
                </Button>
                <Button size="lg" variant="outline" className="lowercase" asChild>
                  <Link href="https://github.com/SAGAR-TAMANG/friday-tony-stark-demo" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" />
                    Star on github
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="text-sm text-muted-foreground flex flex-wrap items-center justify-center gap-2">
                <span>support the project by following me on</span>
                <a href="https://x.com/sagar_builds" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-4">X</a>
                <span>&amp;</span>
                <a href="https://www.instagram.com/sagar_builds/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-4">Instagram</a>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image src="/icon.svg" alt="Logo" width={24} height={24} className='bg-gray-100/30 rounded-lg' />
                <span className="font-semibold">friday</span>
              </div>
              <p className="text-sm text-muted-foreground">
                your ai assistant that lives on your computer.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#download" className="hover:text-foreground transition-colors">Download</a></li>
                <li><a href="#demo" className="hover:text-foreground transition-colors">Demo</a></li>
                <li>
                  <a href="https://github.com/SAGAR-TAMANG/friday-tony-stark-demo" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                    GitHub
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Made by</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="https://x.com/sagar_builds" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">X (sagar_builds)</a>
                </li>
                <li>
                  <a href="https://www.instagram.com/sagar_builds/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a>
                </li>
                <li>
                  <a href="https://cal.com/sagar-tamang" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Talk to me</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <p className="text-center text-sm text-muted-foreground">
              © 2026 friday. MIT licensed.
              <br />
              Built by <a href="https://x.com/sagar_builds" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-4">sagar_builds</a> for the World.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
