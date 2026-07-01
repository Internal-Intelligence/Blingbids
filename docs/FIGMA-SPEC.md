# Blingbids.com — Figma File Specification

## Design System

### Color Tokens
| Token | Hex | Usage |
|-------|-----|-------|
| `bling-black` | `#0A0A0F` | Page background |
| `bling-surface` | `#12121A` | Secondary surfaces |
| `bling-card` | `#1A1A24` | Cards, panels |
| `bling-border` | `#2A2A3A` | Borders, dividers |
| `bling-gold` | `#D4AF37` | Primary accent |
| `bling-neon` | `#FFD700` | Live states, HOLD button |
| `bling-gold-light` | `#F5E6A3` | Secondary text |

### Typography
- **Display**: Inter Bold / custom wordmark for "Blingbids.com"
- **Body**: Inter Regular 14–16px
- **Bid amounts**: Inter Bold 32–48px with gold gradient fill

### Components Library (Figma)
1. `Button/Primary-Gold` — gradient, glow shadow
2. `Button/HOLD` — pulsing neon border, 56px height
3. `Badge/Bling-Verified` — sparkle animation variant
4. `Badge/GIA-Certified` — blue accent
5. `Badge/Brinks-Insured` — emerald accent
6. `Badge/Money-Back` — purple accent
7. `Card/Listing` — 288×auto, sparkle overlay layer
8. `Panel/Bid` — progress bar + SOL/USD toggle
9. `Panel/Trust` — cert popup trigger
10. `Banner/Boost-Fund` — gold header strip

---

## Screen 1: Homepage (`/`)

**Frame**: 1440×auto (desktop), 390×auto (mobile)

### Layout
```
┌─────────────────────────────────────────────────────────┐
│ HEADER: Logo | Vault | Live | Boost Fund | Trust | CTA │
├─────────────────────────────────────────────────────────┤
│ HERO (full-width card, sparkle overlay)                 │
│   "Blingbids.com" wordmark                              │
│   Subtitle: jewelry & gold RWA tagline                  │
│   [Enter Bling Vault] [Quick Sell]                      │
├─────────────────────────────────────────────────────────┤
│ TRUST PILLARS (3-col grid)                              │
│   Zero Trust Loss | Crypto-Fast | Boost Fund            │
├─────────────────────────────────────────────────────────┤
│ BOOST FUND BANNER (4-stat grid)                         │
├─────────────────────────────────────────────────────────┤
│ CAROUSEL: "🔴 Live Now" (horizontal scroll, snap)       │
├─────────────────────────────────────────────────────────┤
│ CAROUSEL: "Bling Vault"                                 │
├─────────────────────────────────────────────────────────┤
│ GRID: Featured Pieces (4-col)                           │
├─────────────────────────────────────────────────────────┤
│ FOOTER (4-col links)                                    │
└─────────────────────────────────────────────────────────┘
```

**Interactions**: Sparkle on hover (listing cards), gold particle burst on CTA click.

---

## Screen 2: Live Room (`/live/[id]`)

**Frame**: 1440×900 — the hero experience

### Layout (12-col grid)
```
Row 1: LIVE badge + viewer count | Title + seller | Trust badges
Row 2: Boost Fund compact banner (full width)
Row 3:
  Col 1-7 (60%): 360° viewer / video player
  Col 8-12 (40%): Bid panel + HOLD button (seller only)
Row 4:
  Col 1-4: Live chat (emoji storm bar + messages)
  Col 5-7: Trust sidebar (cert popup, escrow status)
  Col 8-12: Boost Fund full banner
```

### HOLD Button Spec
- Size: full width of bid column, 64px height
- Style: `border-2 #FFD700`, `bg rgba(212,175,55,0.2)`, pulse animation 2s
- Dropdown (opens upward): 4 options with icons
  - Accept Now ✓
  - Pause & Hold ⏸
  - Extend Supply ⏱
  - Add Matching Pieces +

### Bid Panel Spec
- Progress bar: current bid → target price
- Payment toggle: Solana | USD (pill switcher)
- Quick bid chips: +$100, +$250, +$500, +$1000
- Custom amount input + gold Bid button
- Footer note: "1.5% buyer fee · escrow protected"

---

## Screen 3: Quick Sell (`/sell`)

### Step Flow (wizard tabs)
1. **Scan** — camera/upload zone, dashed gold border
2. **Details** — auto-filled title, category dropdown
3. **Verify** — 4-step wizard (wallet → ID → 15s video → cert)
4. **Pricing** — start / target / hidden reserve inputs
5. **Go Live** — gold particle explosion → redirect to live room

**Target**: complete flow in <90 seconds (progress timer in header).

---

## Screen 4: Bling Vault (`/vault`)

- Category sections: Jewelry, Gold Bar, Diamond, Watch, Chain
- Filter bar: Live | Timed | Price range | Cert type
- Listing cards with 360° preview thumbnail badge

---

## Screen 5: Boost Fund (`/boost-fund`)

- Hero stats (collected, distributed, slots, prizes)
- On-chain ledger table (green inflow, red outflow)
- Monthly vault proof link card

---

## Screen 6: Attestation Dashboard (`/attestation`)

- 4 KPI tiles at top
- Live feed of verified listings with status icons
- Cert popup modal (GIA PDF viewer overlay)

---

## Mobile Adaptations

- Live Room: stack vertically — video → bid panel → HOLD → chat → trust
- Bottom nav: Vault | Live | Sell | Profile
- One-tap quick bid (sticky bottom bar)
- Haptic feedback on bid placement (spec for native wrapper)

---

## Figma File Structure
```
📁 Blingbids.com Design System
  📁 Tokens (colors, type, spacing, shadows)
  📁 Components
  📁 Icons (Lucide subset + custom sparkles)
📁 Screens — Desktop
📁 Screens — Mobile
📁 Prototypes
  → Homepage → Vault → Live Room → Bid → Win (confetti)
  → Quick Sell → Verify → Go Live
📁 Marketing
  📁 Social (1200×630 OG, tweet cards)
  📁 Investor One-Pager
```