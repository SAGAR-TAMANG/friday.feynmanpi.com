# friday.feynmanpi.com

Landing page for **F.R.I.D.A.Y.** — a Tony Stark-inspired voice AI assistant that lives on your computer.

Live at → [friday.feynmanpi.com](https://friday.feynmanpi.com)

The assistant itself lives here → [SAGAR-TAMANG/friday-tony-stark-demo](https://github.com/SAGAR-TAMANG/friday-tony-stark-demo)

---

## What this repo is

A Next.js landing page that:

- Explains what Friday is and how it works
- Collects waitlist signups (Windows + macOS) via **Resend Audiences**
- Deploys to **Cloudflare Workers** via `@opennextjs/cloudflare`

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Fonts | Geist + Playfair |
| Email / waitlist | Resend Audiences API |
| Deployment | Cloudflare Workers (`@opennextjs/cloudflare`) |

---

## Project structure

```
app/
  page.tsx              # Landing page (hero, prompts, how-it-works, demo, waitlist)
  layout.tsx            # Root layout + metadata
  globals.css           # Theme tokens, Tailwind imports
  api/
    signup/route.ts     # POST /api/signup — adds email to Resend Audience
    download/route.ts   # GET /api/download — resolves download URL from R2 (dormant)
components/
  ui/                   # shadcn/ui component library
public/                 # Static assets
wrangler.jsonc          # Cloudflare Workers config
```

---

## Running locally

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in RESEND_API_KEY and RESEND_AUDIENCE_ID

# 3. Start dev server
pnpm dev
```

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | Resend API key — [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_AUDIENCE_ID` | Resend Audience ID — find via `GET https://api.resend.com/audiences` |

---

## Deploying to Cloudflare Workers

**Recommended: connect the GitHub repo to Cloudflare** (builds on Linux, avoids Windows path issues):

Cloudflare dashboard → Workers & Pages → Create → Connect to Git → set build command to `npx opennextjs-cloudflare build` and deploy command to `npx opennextjs-cloudflare deploy`. Add the two env vars in the dashboard.

**Or deploy manually from WSL:**

```bash
pnpm run deploy
```

Add secrets first:
```bash
wrangler secret put RESEND_API_KEY
wrangler secret put RESEND_AUDIENCE_ID
```

---

## License

MIT — see [LICENSE](./LICENSE)
