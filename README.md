# Blingbids.com

Jewelry & gold RWA live auction platform. Bid with Solana or USD. Zero trust loss.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

- **Frontend**: Next.js 15, Tailwind, shadcn-style components, Framer Motion
- **Blockchain**: Solana Anchor (escrow, HOLD, Boost Fund fee reroute)
- **Payments**: Phantom + Stripe + Onramper (skeleton)
- **Real-time**: Socket.io WebSocket (skeleton)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── vault/              # Bling Vault browse
│   ├── live/[id]/          # Live auction rooms
│   ├── sell/               # Quick sell flow
│   ├── boost-fund/         # Transparency dashboard
│   └── attestation/        # Trust dashboard
├── components/
│   ├── auction/            # BidPanel, HoldButton, ListingCard
│   ├── live/               # LiveRoom
│   ├── seller/             # VerificationWizard, QuickSellFlow
│   ├── vault/              # VaultCarousel
│   └── sparkle/            # SparkleOverlay, ConfettiWin
├── lib/
│   ├── solana/             # Escrow + HOLD client helpers
│   └── types.ts            # Core types
└── providers/              # SolanaProvider

programs/
└── blingbids_escrow/       # Anchor program (escrow + HOLD + Boost Fund)

docs/
├── FIGMA-SPEC.md           # Full Figma file description
├── DEPLOYMENT.md           # Deploy & test checklist
└── MARKETING.md            # Launch copy & assets
```

## Bling AI (Grok Integration)

Powered by xAI Grok via `/v1/responses` through secure server-side routes (`/api/grok`). Uses **grok-4.3** for chat/reasoning and **grok-build-0.1** for structured build tasks (auto-fill, cert check, copy). API key stays in `.env.local` only.

| Tool | Where | What it does |
|------|-------|--------------|
| `chat` | Floating Bling AI widget (all pages) | Platform expert Q&A |
| `analyze-listing` | Quick Sell → Details | AI scan & auto-fill title, category, description |
| `suggest-pricing` | Quick Sell → Pricing | Market-based start/target/reserve prices |
| `verify-cert` | Verification wizard | GIA/AGS cert trust scoring |
| `hold-advisor` | Live room (seller) | Recommends HOLD action |
| `live-insights` | Live room (buyer) | Bid strategy & fair value range |
| `generate-image` | Quick Sell | AI listing photos via Grok Imagine |

```bash
# .env.local
XAI_API_KEY=your_key_here
XAI_MODEL=grok-4.3
XAI_BUILD_MODEL=grok-build-0.1
XAI_IMAGE_MODEL=grok-imagine-image-quality
```

## Merchant Turnover & AI Sales Disclosure

Merchants must **list every AI-assisted sale** each time a turnover report is submitted.

- **Portal**: `/merchant` → `/merchant/turnover`
- **Tracked tools**: Grok scan, pricing, images, cert check, HOLD advisor, Bling AI chat
- **Validation**: Report blocked until all `pending-report` AI sales in the period are declared
- **API**: `GET /api/merchant/ai-sales`, `POST /api/merchant/turnover-report`, `POST /api/merchant/ai-sales/track`

## Key Features

- **RWA Trust System**: Seller verification wizard, escrow, insured shipping, 7-day inspection
- **HOLD Button**: Accept Now / Pause & Hold / Extend Supply / Add Matching Pieces
- **Bling Boost Fund**: 25% of fees routed on-chain for community subsidies
- **Quick Sell**: Wallet → scan → verify → price → Go Live in <90s
- **Dark neon-gold theme** with diamond sparkles

## Docs

- [Figma Specification](docs/FIGMA-SPEC.md)
- [Deployment Checklist](docs/DEPLOYMENT.md)
- [Marketing Assets](docs/MARKETING.md)

## Environment

Copy `.env.example` to `.env.local` and fill in values.

## License

Proprietary — Blingbids.com © 2026