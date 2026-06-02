'use client'

import { useState } from 'react'
import { ArrowRight, Download, Github, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

// NOTE: windows download is gated behind the same waitlist for now.
// to re-enable the windows-download flow later: re-add 'windows' as a usable
// intent below, uncomment `handleWindowsDownload`, restore the dual buttons
// in the hero / download / cta sections, and restore the `intent === 'windows'`
// branches in the dialog (all commented out below — search for `WINDOWS_DOWNLOAD`).
type Intent = 'windows' | 'mac-waitlist' | 'waitlist'

const SAMPLE_PROMPTS = [
  '"hey friday, what\'s in the news today?"',
  '"friday, search the web for the latest livekit release"',
  '"friday, what time is it in tokyo right now?"',
  '"friday, open the world monitor on screen."',
  '"friday, summarize this article for me."',
  '"friday, what\'s on my system right now?"',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Home() {
  const [open, setOpen] = useState(false)
  const [intent, setIntent] = useState<Intent>('waitlist')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const openGate = (next: Intent) => {
    setIntent(next)
    setEmail('')
    setSubmitted(false)
    setOpen(true)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = email.trim().toLowerCase()
    if (!EMAIL_RE.test(value)) {
      toast.error('Please enter a valid email address.')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value, intent }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        toast.error(data.error || 'Something went wrong. Try again.')
        return
      }
      setSubmitted(true)
      if (intent === 'mac-waitlist' || intent === 'waitlist') {
        toast.success("You're on the waitlist!", {
          description: "We'll email you the moment friday is ready.",
        })
      }
    } catch {
      toast.error('A network error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  // WINDOWS_DOWNLOAD — uncomment when the windows build is ready to ship.
  // const handleWindowsDownload = async () => {
  //   const loadingId = toast.loading('Locating latest Windows version...')
  //   try {
  //     const res = await fetch('/api/download?os=windows&urlOnly=true')
  //     const data = await res.json()
  //     if (!res.ok || data.error) {
  //       toast.error('Download not ready yet', {
  //         description: data.error || 'The Windows build is not available yet — we have your email.',
  //         id: loadingId,
  //       })
  //       return
  //     }
  //     toast.success('Thank you for downloading!', {
  //       description: 'Your download will begin shortly.',
  //       id: loadingId,
  //     })
  //     window.location.href = data.url
  //   } catch {
  //     toast.error('Download failed', {
  //       description: 'A network error occurred.',
  //       id: loadingId,
  //     })
  //   }
  // }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
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
                <Button variant="outline" size="sm" className='lowercase' asChild>
                  <Link href="https://cal.com/sagar-tamang" target="_blank" rel="noopener noreferrer">
                    Talk to me
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden py-28 sm:py-40 border-b border-border">
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Badge variant="secondary" className="tracking-widest uppercase">
              Meet F.R.I.D.A.Y.
            </Badge>
          </div>
          <h1 className="!font-playfair text-5xl sm:text-6xl lg:text-7xl mb-6 font-normal leading-[1.05]">
            an <span className='italic'>ai assistant</span> that lives on your <span className='italic'>computer</span>.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            friday listens to your voice, reasons with an LLM, and talks back —
            <br className="hidden sm:block" />
            wired to live tools so it can actually do things for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button size="lg" onClick={() => openGate('waitlist')} className="lowercase">
              <Mail className="mr-2 w-4 h-4" />
              Join the waitlist
            </Button>
            {/* WINDOWS_DOWNLOAD — uncomment when ready to ship windows builds.
            <Button size="lg" onClick={() => openGate('windows')} className="lowercase">
              <Download className="mr-2 w-4 h-4" />
              Download for windows
            </Button>
            <Button size="lg" variant="secondary" onClick={() => openGate('mac-waitlist')} className="lowercase">
              <Mail className="mr-2 w-4 h-4" />
              Join mac waitlist
            </Button>
            */}
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            free &amp; open source. windows &amp; mac builds coming soon.
          </p>
        </div>
      </section>

      {/* Sample prompts */}
      <section className="py-20 sm:py-28 border-b border-border">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
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
          <div className="grid sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {SAMPLE_PROMPTS.map((prompt) => (
              <div
                key={prompt}
                className="rounded-lg border border-border bg-card/40 px-4 py-3 text-sm text-muted-foreground"
              >
                {prompt}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 sm:py-28 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="mb-4">
              <Badge variant="outline">How it works</Badge>
            </div>
            <h2 className="!font-playfair font-normal text-4xl sm:text-5xl mb-6 leading-tight">
              two pieces. one <span className='italic'>brain</span>.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              a voice pipeline up front, an MCP tool server underneath — talking to each other in real time.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <Badge variant="secondary" className="mb-4">MCP Server</Badge>
                <h3 className="text-xl font-semibold mb-3 lowercase">the stark industries backend</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  a fastmcp server exposing tools over sse — news, web search, system info, world monitor, and more. the llm reaches in here whenever it needs to do real work.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary">›</span> get_world_news</li>
                  <li className="flex items-start gap-2"><span className="text-primary">›</span> search_web &amp; fetch_url</li>
                  <li className="flex items-start gap-2"><span className="text-primary">›</span> open_world_monitor</li>
                  <li className="flex items-start gap-2"><span className="text-primary">›</span> get_current_time &amp; system_info</li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Badge variant="secondary" className="mb-4">Voice Agent</Badge>
                <h3 className="text-xl font-semibold mb-3 lowercase">the ears and mouth</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  a livekit agents pipeline that streams your mic into stt, routes it through an llm, and speaks the answer back — all while pulling tools from the mcp server.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><span className="text-primary">›</span> sarvam saaras v3 — speech to text</li>
                  <li className="flex items-start gap-2"><span className="text-primary">›</span> gemini 2.5 flash — reasoning</li>
                  <li className="flex items-start gap-2"><span className="text-primary">›</span> openai nova — text to speech</li>
                  <li className="flex items-start gap-2"><span className="text-primary">›</span> livekit cloud — the room</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="mt-10 rounded-xl border border-border bg-card/40 p-6 max-w-3xl mx-auto">
            <pre className="text-xs sm:text-sm text-muted-foreground overflow-x-auto leading-relaxed normal-case">{`microphone ─► stt (sarvam saaras v3)
                  │
                  ▼
           llm (gemini 2.5 flash)  ◄────► mcp server (fastmcp / sse)
                  │
                  ▼
           tts (openai nova)
                  │
                  ▼
           speaker / livekit room`}</pre>
          </div>
        </div>
      </section>

      {/* Demo */}
      <section id="demo" className="py-20 sm:py-28 border-b border-border">
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
      </section>

      {/* Platform */}
      <section id="download" className="py-20 sm:py-28 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <Badge variant="secondary">Get friday</Badge>
          </div>
          <h2 className="!font-playfair font-normal text-4xl sm:text-5xl mb-6 leading-tight">
            coming soon to your <span className='italic'>desktop</span>.
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            both windows and macOS builds are in the oven. drop your email and we&apos;ll let you know the moment friday is ready for your machine.
          </p>
          <div className="flex justify-center">
            <Card className="max-w-md w-full text-left">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary rounded-lg mb-4 flex items-center justify-center">
                  <Mail className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Windows &amp; macOS</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  One waitlist for both platforms. We&apos;ll email you the second your build is live.
                </p>
                <Button onClick={() => openGate('waitlist')} className='lowercase'>
                  <Mail className="w-4 h-4 mr-2" />
                  Join the waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
          {/* WINDOWS_DOWNLOAD — uncomment the two-card grid when builds are ready.
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <Card>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 13.5H6.95m10.1 0l-.5-5h-9.1l-.5 5M6.5 19h11l.5-5H6l.5 5z" strokeWidth="1.5" stroke="currentColor" fill="none" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Windows</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Windows 10 and newer. GPU acceleration where supported.
                </p>
                <Button onClick={() => openGate('windows')} className='lowercase'>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-secondary rounded-lg mb-4 flex items-center justify-center">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 2H7c-1.1 0-2 .9-2 2v20c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" strokeWidth="0" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">macOS</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Coming soon — Intel &amp; Apple Silicon. Join the waitlist for early access.
                </p>
                <Button variant="secondary" onClick={() => openGate('mac-waitlist')} className='lowercase'>
                  <Mail className="w-4 h-4 mr-2" />
                  Join waitlist
                </Button>
              </CardContent>
            </Card>
          </div>
          */}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 sm:py-32 border-b border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="!font-playfair font-normal text-4xl sm:text-5xl lg:text-6xl mb-6 leading-tight">
            completely <span className='italic'>free</span>.
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            no sign-in, no credit card. open source, MIT licensed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Button size="lg" onClick={() => openGate('waitlist')} className="lowercase">
              <Mail className="w-4 h-4 mr-2" />
              Join the waitlist
            </Button>
            <Button size="lg" variant="outline" className="lowercase" asChild>
              <Link href="https://github.com/SAGAR-TAMANG/friday-tony-stark-demo" target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                Star on github
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          {/* WINDOWS_DOWNLOAD — uncomment when ready to ship windows builds.
          <Button size="lg" onClick={() => openGate('windows')} className="lowercase">
            <Download className="w-4 h-4 mr-2" />
            Download now
          </Button>
          */}
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <span>support the project by following me on</span>
            <a href="https://x.com/sagar_builds" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-4">X</a>
            <span>&amp;</span>
            <a href="https://www.instagram.com/sagar_builds/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors underline underline-offset-4">Instagram</a>.
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

      {/* Email gate dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="!font-playfair text-2xl font-normal italic lowercase">
              {submitted
                ? "you're on the waitlist."
                : 'join the friday waitlist.'}
            </DialogTitle>
            <DialogDescription className="lowercase">
              {submitted
                ? "we'll email you the moment friday is ready for your machine."
                : 'drop your email and we\'ll let you know the second windows or macOS goes live.'}
            </DialogDescription>
          </DialogHeader>
          {/* WINDOWS_DOWNLOAD — original windows/mac branched titles. restore when the
              windows download button is brought back in handleWindowsDownload + hero.
          <DialogTitle className="!font-playfair text-2xl font-normal italic lowercase">
            {intent === 'windows'
              ? submitted
                ? 'thank you. your download is ready.'
                : 'one quick step.'
              : submitted
                ? "you're on the waitlist."
                : 'join the mac waitlist.'}
          </DialogTitle>
          <DialogDescription className="lowercase">
            {intent === 'windows'
              ? submitted
                ? "click below to start the download. we'll only email you about major releases."
                : 'drop your email and we\'ll show you the download link.'
              : submitted
                ? "we'll email you the moment macOS is ready."
                : 'macOS is in the oven. leave your email and we\'ll let you know first.'}
          </DialogDescription>
          */}

          {!submitted && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="lowercase">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="lowercase"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting} className="lowercase w-full sm:w-auto">
                  {submitting ? 'sending...' : 'join waitlist'}
                </Button>
                {/* WINDOWS_DOWNLOAD — windows had a different label here.
                {submitting
                  ? 'sending...'
                  : intent === 'windows'
                    ? 'continue to download'
                    : 'join waitlist'}
                */}
              </DialogFooter>
            </form>
          )}

          {submitted && (
            <DialogFooter>
              <Button variant="secondary" onClick={() => setOpen(false)} className="lowercase w-full sm:w-auto">
                Close
              </Button>
            </DialogFooter>
          )}
          {/* WINDOWS_DOWNLOAD — restore this branch (and uncomment handleWindowsDownload)
              when the windows installer is ready to ship.
          {submitted && intent === 'windows' && (
            <DialogFooter>
              <Button onClick={handleWindowsDownload} className="lowercase w-full sm:w-auto">
                <Download className="w-4 h-4 mr-2" />
                Download for windows
              </Button>
            </DialogFooter>
          )}
          */}
        </DialogContent>
      </Dialog>
    </div>
  )
}
