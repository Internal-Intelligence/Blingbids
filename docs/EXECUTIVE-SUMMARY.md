# Blingbids.com — Executive Summary

## Vision

**Blingbids.com** is the fun, interactive, crypto-fast marketplace for physical jewelry, gold bars, diamonds, luxury watches, and precious pieces. Sellers liquidate in under 90 seconds; buyers bid with Solana or USD under a zero-trust-loss verification stack.

## What We Built (MVP Skeleton)

| Layer | Status | Location |
|-------|--------|----------|
| Next.js 15 frontend | ✅ Built & compiles | `src/` |
| Dark neon-gold UI + sparkles | ✅ Implemented | Tailwind + Framer Motion |
| Live auction rooms | ✅ Interactive skeleton | `/live/[id]` |
| Quick Sell + verification wizard | ✅ 5-step flow | `/sell` |
| HOLD button (4 actions) | ✅ With on-chain mapping | `HoldButton.tsx` |
| Boost Fund transparency | ✅ Dashboard + ledger | `/boost-fund` |
| Trust attestation dashboard | ✅ Live feed | `/attestation` |
| Anchor escrow program | ✅ Rust skeleton | `programs/blingbids_escrow/` |
| Fee reroute (25% → Boost Fund) | ✅ In program logic | `release_escrow` instruction |
| Figma spec | ✅ Full screen layouts | `docs/FIGMA-SPEC.md` |
| Deployment plan | ✅ Week-by-week | `docs/DEPLOYMENT.md` |
| Marketing assets | ✅ Copy + thread + one-pager | `docs/MARKETING.md` |

## Monetization

- **8–12% total take**: seller 7–10%, buyer 1–2%
- **25% of fees** → Bling Boost Fund (on-chain, transparent)
- **Optional 2%** creator royalty → Boost Fund
- VIP subscriptions + paid boosts (skeleton ready)

## Competitive Moat

1. Mandatory attestation (ID + video + GIA/AGS cert)
2. Solana escrow + 7-day inspection guarantee
3. Seller HOLD controls logged on-chain
4. Boost Fund community flywheel (subsidizes everyone)
5. Live entertainment format (chat, emoji storms, confetti wins)

## Next Steps to Production

1. Deploy to Vercel + Solana devnet
2. Wire Phantom wallet + real bid transactions
3. Deploy WebSocket server for live rooms
4. Integrate Stripe/Onramper + Persona KYC
5. Seed 10 verified sellers for launch week

## Run Locally

```bash
cd Blingbids && npm install && npm run dev
```

Visit `http://localhost:3000` — homepage, vault, live rooms, quick sell, boost fund, and attestation all navigable.