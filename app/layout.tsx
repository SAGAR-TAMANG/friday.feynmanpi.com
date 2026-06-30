import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import { baseUrl } from './sitemap'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const title = 'friday — an ai assistant that lives on your computer'
const description =
  "Friday is a voice-first AI desktop assistant inspired by Tony Stark's F.R.I.D.A.Y. Talk to it, let it see your screen, search the web, and control your computer. For Windows & macOS."
const ogImage = `${baseUrl}/og`

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: '%s — friday'
  },
  description,
  applicationName: 'Friday',
  generator: 'Next.js',
  keywords: [
    'friday',
    'friday ai',
    'friday ai assistant',
    'f.r.i.d.a.y',
    'friday tony stark',
    'tony stark ai assistant',
    'jarvis alternative',
    'ai assistant',
    'voice ai assistant',
    'desktop ai assistant',
    'ai that controls your computer',
    'computer use ai',
    'ai agent desktop',
    'openai realtime',
    'windows ai assistant',
    'mac ai assistant',
    'voice assistant for pc'
  ],
  authors: [{ name: 'Sagar Tamang', url: 'https://sagartamang.com' }],
  creator: 'Sagar Tamang',
  publisher: 'Friday (feynmanpi)',
  alternates: {
    canonical: baseUrl
  },
  openGraph: {
    type: 'website',
    url: baseUrl,
    siteName: 'friday',
    title,
    description,
    locale: 'en_US',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: 'friday — an AI assistant that lives on your computer'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    creator: '@sagar_builds',
    site: '@sagar_builds',
    images: [ogImage]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  category: 'technology',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased lowercase tracking-tighter">
        {children}
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
