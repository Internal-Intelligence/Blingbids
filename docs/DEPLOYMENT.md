# Blingbids.com — Deployment & Testing Checklist

## MVP Rollout Sequence (This Week)

### Day 1–2: Foundation
- [ ] Deploy Next.js frontend to Vercel (`blingbids.com`)
- [ ] Configure env vars from `.env.example`
- [ ] Deploy Anchor program to Solana devnet
- [ ] Initialize Boost Fund PDA on-chain
- [ ] Set up Stripe test mode + Onramper sandbox

### Day 3–4: Core Flows
- [ ] Wire Phantom wallet connect (SolanaProvider)
- [ ] Implement bid placement → escrow lock (devnet SOL)
- [ ] Deploy WebSocket server for live rooms (Railway/Fly.io)
- [ ] Integrate Agora for live video (seller stream)
- [ ] KYC flow via Persona (seller verification wizard)

### Day 5–6: Trust Layer
- [ ] S3 bucket for certs, photos, video attestations
- [ ] GIA cert verification API integration
- [ ] Brink's shipping label API (or manual MVP)
- [ ] Attestation dashboard live data feed
- [ ] Monthly vault proof page template

### Day 7: Launch
- [ ] Seed 10 verified sellers (see marketing doc)
- [ ] Run 3 live demo auctions
- [ ] Enable Boost Fund transparency page
- [ ] Submit to Solana ecosystem directories

---

## Infrastructure

| Service | Provider | Purpose |
|---------|----------|---------|
| Frontend | Vercel | Next.js 15, edge caching |
| WebSocket | Railway / Fly.io | Socket.io live rooms |
| Blockchain | Solana devnet → mainnet | Escrow + Boost Fund |
| Payments | Stripe + Onramper | USD + fiat on-ramp |
| Video | Agora | Live seller streams |
| Storage | AWS S3 | Images, certs, videos |
| KYC | Persona | Seller ID verification |
| DNS | Cloudflare | blingbids.com |

---

## Deploy Commands

```bash
# Frontend
cd /path/to/Blingbids
npm install
npm run build
vercel --prod

# Anchor program (devnet)
cd programs
anchor build
anchor deploy --provider.cluster devnet

# Initialize Boost Fund
anchor run initialize-boost-fund
```

---

## Environment Variables (Production)

```bash
vercel env add NEXT_PUBLIC_SOLANA_RPC_URL
vercel env add NEXT_PUBLIC_ESCROW_PROGRAM_ID
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add NEXT_PUBLIC_WS_URL
vercel env add AGORA_APP_ID
vercel env add PERSONA_API_KEY
```

---

## Testing Checklist

### Seller Flow
- [ ] Connect Phantom wallet
- [ ] Complete verification wizard (ID + video + cert)
- [ ] Quick sell: photo → details → pricing → Go Live (<90s)
- [ ] HOLD button: all 4 actions log on-chain
- [ ] Accept Now triggers escrow release

### Buyer Flow
- [ ] Browse Bling Vault, filter by category
- [ ] Enter live room, see real-time bids
- [ ] Place bid with SOL toggle
- [ ] Place bid with USD (Stripe) toggle
- [ ] Win auction → confetti → escrow confirmation
- [ ] 7-day inspection window starts

### Boost Fund
- [ ] Fee reroute visible in ledger after sale
- [ ] 25% calculation correct (seller 8% + buyer 1.5%)
- [ ] Featured slot subsidy deducts from fund
- [ ] Vault proof link accessible

### Trust
- [ ] All 4 badges display on verified listings
- [ ] Cert popup opens GIA PDF
- [ ] Attestation dashboard shows live status
- [ ] Money-back badge on all listings

### Performance
- [ ] Lighthouse score >90 (mobile)
- [ ] Live room WebSocket latency <200ms
- [ ] Bid placement <3s (Solana confirmation)

---

## Monitoring

- Vercel Analytics + Speed Insights
- Solana program logs (Helius webhook)
- Boost Fund balance alert (daily)
- Escrow dispute queue (Slack webhook)
