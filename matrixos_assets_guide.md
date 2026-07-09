# MatrixOS — Font & Asset Guide

## Palette Analysis

From the palette image, MatrixOS uses a **pure monochromatic black scale**:

| Token | Hex | Usage |
|-------|-----|-------|
| `50`  | `#FAFAFA` | Page background (light mode) |
| `100` | `#F5F5F5` | Secondary surface |
| `200` | `#E6E6E6` | Neomorphic raised surfaces |
| `300` | `#D6D6D6` | Neomorphic shadow (light edge) |
| `400` | `#A5A5A5` | Disabled states, muted text |
| `500` | `#767676` | Secondary text, subtext |
| `600` | `#575757` | Body text |
| `700` | `#434343` | Strong body / labels |
| `800` | `#292929` | Dark surface (dark mode panel) |
| `900` | `#1A1A1A` | Dark mode background |
| `950` | `#000000` | Primary black, headings |

> [!IMPORTANT]
> The palette is a **neutral monochromatic black scale** — no color accent is defined. You need to add **1–2 accent colors** for status indicators (divergence, health, warnings). See recommendations below.

---

## Recommended Accent Colors (not in palette)

Since neomorphism works on neutral surfaces, add these semantic accent colors:

| Role | Hex | Usage |
|------|-----|-------|
| **Divergence / Alert** | `#FF4D4D` | Red — divergence events, constraint violations |
| **Recovery / Success** | `#00D084` | Green — safe recovery, approved plans |
| **Planning / AI** | `#6C63FF` | Purple — AI reasoning, planning layer |
| **Optimization** | `#F5A623` | Amber — optimization running, metrics |
| **World Model / Data** | `#29B6F6` | Cyan/Blue — live data, knowledge graph nodes |

---

## 🔤 Font Recommendations

MatrixOS is a **runtime control platform** — think mission control meets OS terminal. The fonts must communicate:
- Technical authority
- Real-time data density
- Clarity at a glance

### Primary Recommendation: `Space Grotesk` + `Geist Mono`

This is the top pairing for MatrixOS.

#### `Space Grotesk` — Display & UI Text
```
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
```
- **Why**: Geometric, technical, slightly futuristic. Has the "operating system" feel. Used by Figma's data-heavy tools. Excellent at dashboard scales.
- **Weights to use**: 500 (UI labels), 600 (section headers), 700 (KPI numbers / headings)
- **Use for**: Nav, panel headers, metric labels, mission names, status tags

#### `Geist Mono` — Monospace / Data
```
@import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;700&display=swap');
```
- **Why**: Made by Vercel, purpose-built for Next.js dashboards. Ultra-clean, no retro terminal vibes. Designed for data density — tight spacing, very legible at 11–13px. Pairs perfectly with Space Grotesk (both geometric, same modern era). Feels native to the Next.js stack.
- **Use for**: Event stream, divergence records, timestamps, task IDs, constraint output, runtime logs, code-style reasoning outputs

---

### Alternative Pairings

#### Option B: `Space Grotesk` + `DM Mono`
- `DM Mono` (by Colophon Foundry) — refined and minimal, not "coder-y"
- More designer-friendly than Geist Mono, works beautifully in dark neomorphic UIs
- Good if you want a slightly warmer monospace feel

#### Option C: `Space Grotesk` + `IBM Plex Mono`
- IBM's monospace — very authoritative, strong "systems software" feel
- More structured/engineered look, great at small sizes (11px logs)
- Safe, universally trusted enterprise alternative

#### Option D: `Syne` + `Fira Code`
- More expressive / hackathon-bold. `Syne` has an architectural, structural feel.
- Risk: can feel stylized over functional for a runtime demo

---

### Tailwind Font Config

```js
// tailwind.config.js
const { fontFamily } = require('tailwindcss/defaults');

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', ...fontFamily.sans],
        mono: ['Geist Mono', ...fontFamily.mono],
      },
    },
  },
};
```

```js
// layout.tsx — Google Fonts via next/font
import { Space_Grotesk, Geist_Mono } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-mono',
});
```

---

### Typography Scale (for MatrixOS UI)

| Element | Font | Size | Weight | Usage |
|---------|------|------|--------|-------|
| Page title | Space Grotesk | 32px / 2xl | 700 | "MatrixOS Runtime" |
| Panel header | Space Grotesk | 18px / lg | 600 | "World State", "Divergence" |
| KPI number | Space Grotesk | 36px / 3xl | 700 | Recovery time, delay |
| Section label | Space Grotesk | 12px / xs | 500 | "MISSIONS", "RESOURCES" |
| Body text | Space Grotesk | 14px / sm | 400 | Descriptions, explanations |
| Event ID / code | Geist Mono | 13px | 400 | `EVT-1042`, `FuelTruckFailure` |
| Timestamp | Geist Mono | 11px | 400 | `T+12:34` |
| Log/output | Geist Mono | 12px | 400 | Reasoning panel output |
| Constraint result | Geist Mono | 13px | 500 | `PASS` / `REJECTED` |

---

## 📦 Required Assets

### 1. Icons & Icon Library

Since you're on Next.js + Tailwind + shadcn/ui, use **Lucide React** (already bundled with shadcn).

For MatrixOS specifically, you'll need icons for:

| Category | Icons Needed | Lucide Names |
|----------|-------------|--------------|
| Runtime status | Play, Pause, Activity | `Play`, `Pause`, `Activity` |
| Events | Zap, AlertTriangle, Bell | `Zap`, `AlertTriangle`, `Bell` |
| Divergence | GitBranch, TrendingDown, AlertCircle | `GitBranch`, `TrendingDown`, `AlertCircle` |
| Recovery | RefreshCw, CheckCircle, XCircle | `RefreshCw`, `CheckCircle2`, `XCircle` |
| Resources | Truck, Users, MapPin, Fuel | `Truck`, `Users`, `MapPin`, `Fuel` |
| Planning | Brain, Network, Cpu | `Brain`, `Network`, `Cpu` |
| Constraint | Lock, Shield, ShieldCheck | `Lock`, `Shield`, `ShieldCheck` |
| Metrics | BarChart2, TrendingUp, Clock | `BarChart2`, `TrendingUp`, `Clock` |
| Navigation | ChevronRight, Menu, X | `ChevronRight`, `Menu`, `X` |
| Knowledge Graph | Share2, GitMerge | `Share2`, `GitMerge` |

> [!TIP]
> For a few special icons (aircraft, airport gate, etc.) consider **Phosphor Icons** (`phosphor-react`) — it has aviation-specific icons not in Lucide.

---

### 2. Chart & Visualization Libraries (already in stack)

| Library | Already Listed | Use for |
|---------|---------------|---------|
| **Recharts** | ✅ Yes | Metrics panel — delay charts, recovery rates, resource utilization bars |
| **React Flow** | ✅ Yes | Knowledge graph visualization, dependency graph, task DAG |
| **Framer Motion** | ✅ Yes | All panel animations, divergence pulse effects, status transitions |

**Additional to consider:**
- **D3.js** (optional) — For the Gantt/timeline view (expected vs actual execution). Recharts doesn't do Gantt natively.
- **`react-gantt-chart`** or build a custom SVG timeline with D3.

---

### 3. Neomorphism 200 Component Package

Since you have this, here's how to map neomorphic components to MatrixOS panels:

| Neomorphic Component | MatrixOS Use |
|---------------------|-------------|
| **Raised card** | Mission cards in Left panel (World State) |
| **Inset/pressed panel** | Timeline track background (expected vs actual) |
| **Raised button** | "Trigger Event" button, "Execute Repair" button |
| **Inset toggle** | Baseline comparison mode toggle |
| **Raised badge/chip** | Resource status badges (Available, Occupied, Unavailable) |
| **Inset input** | Event parameter inputs in disruption panel |
| **Raised progress bar** | Task completion, delay reduction bar |
| **Inset metric display** | Bottom KPI cards (Recovery Time, Repairs Issued) |
| **Notification / alert** | Divergence detection alert, constraint rejection alert |

> [!IMPORTANT]
> Neomorphism requires **a single consistent background color** for the shadows to work. With the black-scale palette, you have two options:
> - **Light mode**: Use `#E6E6E6` (300) as the base — classical white neomorphism
> - **Dark mode**: Use `#1A1A1A` (900) as the base — dark neomorphism (more dramatic, better for a runtime demo)
> 
> **Recommend dark mode** for MatrixOS — it reads as more technical/operational.

Dark neomorphism CSS pattern:
```css
/* Base surface */
background: #1A1A1A;

/* Raised element */
box-shadow: 6px 6px 12px #0d0d0d, -6px -6px 12px #272727;

/* Inset/pressed element */
box-shadow: inset 6px 6px 12px #0d0d0d, inset -6px -6px 12px #272727;
```

---

### 4. Custom Visual Assets Required

These need to be created or sourced:

#### a) MatrixOS Logo / Wordmark
- Style: Geometric, monospaced feel, tech brand
- Format: SVG (scalable for header/favicon)
- Suggestion: "MX" monogram with a circuit/grid motif

#### b) Airport Digital Twin Background / Illustration
- A top-down airport gate layout SVG or simplified schematic
- Shows: gates, taxiways, aircraft positions, service vehicle positions
- Can be built with React Flow nodes or a custom SVG

#### c) Aircraft Icon (SVG)
- Top-down view of aircraft silhouette
- Used as mission node in the Digital Twin panel
- Multiple states: normal, in-turnaround, delayed, recovered

#### d) Service Vehicle Icons (SVG)
- Fuel truck, baggage cart, cleaning vehicle, tug/pushback
- Top-down schematic view
- Used in the resource assignment visualization

#### e) Favicon
- 32×32 and 64×64 SVG/ICO
- Based on MatrixOS logo mark

---

### 5. Animation Assets (Framer Motion)

No file assets needed — define these in code:

| Animation | Trigger | Effect |
|-----------|---------|--------|
| **Divergence pulse** | Event fires | Red ring pulse on affected mission card |
| **Recovery glow** | Repair approved | Green border fade-in on fixed task |
| **Constraint rejection flash** | Invariant violation | Red flash + shake on rejected plan card |
| **State transition** | Task status changes | Smooth color/border morph |
| **Event stream entry** | New event | Slide-in from right in event log |
| **Metrics counter** | Recovery executes | Animated number increment (Framer `useMotionValue`) |
| **Graph edge highlight** | Impact assessment | Highlighted path along React Flow edges |

---

### 6. Data / Seed Assets

These are code/JSON assets, not visual:

| Asset | Purpose |
|-------|---------|
| `airport-scenario.json` | Seed data: 3 aircraft, 6 resources, initial plan |
| `disruption-events.json` | Pre-scripted events: FuelTruckFailure, HeavyRain, GateBlocked |
| `recovery-knowledge-base.json` | Seeded experience: 10–15 past recovery patterns with confidence scores |
| `runtime-invariants.json` | Constraint definitions: boarding/fueling overlap rule etc. |

---

### 7. Next.js + Tailwind Specific Config Assets

| File | Purpose |
|------|---------|
| `tailwind.config.js` | Font tokens, extended palette, neomorphic shadow utilities |
| `globals.css` | CSS variables for the black scale + accent colors |
| `components/ui/` | shadcn/ui component overrides to match neomorphic style |
| `public/fonts/` | Self-hosted Geist Mono (optional, for offline hackathon use) |

---

## Summary Checklist

### Fonts
- [x] **Space Grotesk** — primary UI font (via `next/font/google`)
- [x] **Geist Mono** — monospace/data font (via `next/font/google`) — by Vercel, native to Next.js

### Icon Libraries
- [x] **Lucide React** (via shadcn) — general UI icons
- [ ] **Phosphor Icons** (optional) — aviation-specific icons

### Visualization
- [x] **Recharts** — metrics charts
- [x] **React Flow** — knowledge graph / task DAG
- [x] **Framer Motion** — all micro-animations
- [ ] **D3.js** — Gantt/timeline view (optional but recommended)

### Custom SVG Assets Needed
- [ ] MatrixOS logo / wordmark
- [ ] Airport gate layout (top-down schematic)
- [ ] Aircraft silhouette (top-down)
- [ ] Service vehicle icons (fuel truck, tug, baggage, cleaning)
- [ ] Favicon set

### Data / Seed Files
- [ ] `airport-scenario.json`
- [ ] `disruption-events.json`
- [ ] `recovery-knowledge-base.json`
- [ ] `runtime-invariants.json`

### Config
- [ ] `tailwind.config.js` with Space Grotesk + Geist Mono + extended palette
- [ ] Dark neomorphic CSS shadow utilities
- [ ] Accent color tokens (red/green/purple/amber/cyan)
