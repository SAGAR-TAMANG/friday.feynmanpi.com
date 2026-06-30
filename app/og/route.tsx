import { ImageResponse } from 'next/og'

// Dynamic Open Graph image (1200×630) used for link unfurls on X, Discord,
// iMessage, LinkedIn, etc. No custom font is fetched (uses the system serif), so
// it renders fast and works on the Cloudflare/OpenNext runtime. Override the
// headline per-page with ?title=...
export function GET(request: Request) {
  const url = new URL(request.url)
  const title = url.searchParams.get('title') || 'an ai assistant that lives on your computer'

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full justify-between bg-black text-white p-16"
        style={{ fontFamily: 'serif' }}
      >
        <div tw="flex items-center">
          <span tw="text-lg text-neutral-400">friday.feynmanpi.com</span>
        </div>
        <div tw="flex flex-col">
          <h1 tw="text-7xl font-bold tracking-tight leading-tight" style={{ fontStyle: 'italic' }}>
            friday
          </h1>
          <h2 tw="flex text-4xl text-neutral-300 tracking-tight leading-tight mt-2">{title}</h2>
        </div>
        <div tw="flex items-center justify-between w-full">
          <span tw="text-2xl text-white">voice · vision · web search · computer control</span>
          <span tw="text-xl text-neutral-400">windows &amp; macOS</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  )
}
