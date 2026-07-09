# Project

MatrixOS is a domain-agnostic runtime platform for coordinated AI operational systems — it maintains a live operational graph, detects execution divergence, selects and validates repairs, and learns from recovery history. Any domain (airport, hospital, warehouse, factory) is an adapter on top of the same runtime kernel.

---

# Overall Progress

```
Overall Completion: 2%
Current Milestone:  Planning & Architecture Complete — Build Not Started
```

---

# Architecture

## Frontend
- Framework: **Next.js 15** (App Router)
- Styling: **Tailwind CSS v3**
- Component library: **shadcn/ui** (Radix primitives)
- Animations: **Framer Motion**
- Graph visualization: **React Flow**
- Charts: **Recharts**
- Icons: **Lucide React** (via shadcn) + **Phosphor Icons** (aviation-specific)
- Fonts: **Space Grotesk** (UI) + **Geist Mono** (data/mono) via `next/font/google`
- UI style: **Dark neomorphism** on `#1A1A1A` base with glassmorphism panels for dense content areas

## Backend
- Framework: **FastAPI** (Python)
- Real-time: **WebSockets** (FastAPI native)
- AI layer: **GPT-4o** or equivalent — structured JSON outputs
- Optimization: **Google OR-Tools CP-SAT**
- Database: **SQLite** (hackathon MVP)

## Database
- SQLite for MVP
- Tables: missions, tasks, resources, events, divergences, repairs, recovery_memory

## Authentication
- None for MVP (hackathon demo, no auth required)

## Deployment
- Local dev for hackathon
- Future: Vercel (frontend) + Railway/Render (FastAPI backend)

---

# Design System

## Color Palette

### Base (monochromatic black scale)
| Token | Hex     | Usage                          |
|-------|---------|--------------------------------|
| 50    | #FAFAFA | Page background (light mode)   |
| 100   | #F5F5F5 | Secondary surface              |
| 200   | #E6E6E6 | Neomorphic raised surfaces     |
| 300   | #D6D6D6 | Neomorphic shadow light edge   |
| 400   | #A5A5A5 | Disabled states, muted text    |
| 500   | #767676 | Secondary text, subtext        |
| 600   | #575757 | Body text                      |
| 700   | #434343 | Strong body / labels           |
| 800   | #292929 | Dark surface panel             |
| 900   | #1A1A1A | **Dark mode base background**  |
| 950   | #000000 | Primary black, headings        |

### Accent colors (semantic, added on top of palette)
| Role               | Hex     | Usage                                          |
|--------------------|---------|------------------------------------------------|
| Divergence / Alert | #FF4D4D | Red — divergence events, constraint violations |
| Recovery / Success | #00D084 | Green — safe recovery, approved plans          |
| Planning / AI      | #6C63FF | Purple — AI reasoning, planning layer          |
| Optimization       | #F5A623 | Amber — optimization running, metrics          |
| World Model / Data | #29B6F6 | Cyan — live data, knowledge graph nodes        |

## Neomorphism Pattern (dark mode)
```css
/* Base surface */
background: #1A1A1A;

/* Raised element (cards, buttons) */
box-shadow: 6px 6px 12px #0d0d0d, -6px -6px 12px #272727;

/* Inset/pressed element (tracks, inputs) */
box-shadow: inset 6px 6px 12px #0d0d0d, inset -6px -6px 12px #272727;
```

> DECISION: Use dark neomorphism as accent style for cards/buttons only.
> Use glassmorphism (backdrop-blur + subtle border) for main panel containers.
> This prevents muddy readability issues when colored runtime states overlay neomorphic surfaces.

## Typography Scale
| Element           | Font          | Size      | Weight | Usage                          |
|-------------------|---------------|-----------|--------|--------------------------------|
| Page title        | Space Grotesk | 32px/2xl  | 700    | "MatrixOS Runtime"             |
| Panel header      | Space Grotesk | 18px/lg   | 600    | "World State", "Divergence"    |
| KPI number        | Space Grotesk | 36px/3xl  | 700    | Recovery time, delay metrics   |
| Section label     | Space Grotesk | 12px/xs   | 500    | "MISSIONS", "RESOURCES"        |
| Body text         | Space Grotesk | 14px/sm   | 400    | Descriptions, explanations     |
| Event ID / code   | Geist Mono    | 13px      | 400    | `EVT-1042`, `FuelTruckFailure` |
| Timestamp         | Geist Mono    | 11px      | 400    | `T+12:34`                      |
| Log/output        | Geist Mono    | 12px      | 400    | Reasoning panel output         |
| Constraint result | Geist Mono    | 13px      | 500    | `PASS` / `REJECTED`            |

## Neomorphism Package
- Package location: `c:\Users\Rahul SP\MatrixOS\neumorphism\`
- Source: Themesberg Neumorphism UI (Bootstrap 4 + SCSS + Gulp)
- Usage decision: **Visual reference ONLY** — do NOT import directly
- Extract: shadow math from `src/scss/neumorphism/_variables.scss`
- Port those values to Tailwind custom utilities in `tailwind.config.js`

---

# Folder Structure

```
MatrixOS/
├── EXECUTION_PLAN.md          <- THIS FILE — single source of truth
├── prd.md                     <- Updated product requirements
├── README.md                  <- Updated project README
├── matrixos_assets_guide.md   <- Font, asset, icon decisions
├── pages.md                   <- Page structure reference
├── pallete.png                <- Color palette reference image
├── neumorphism/               <- Reference package (Bootstrap, do not import)
│   └── src/scss/neumorphism/  <- Extract shadow variables from here
└── frontend/                  <- EMPTY — build starts here
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx                         <- / Home (adapter picker)
    │   ├── globals.css
    │   └── playground/
    │       └── [adapter]/
    │           ├── page.tsx                 <- Dashboard
    │           ├── events/page.tsx          <- Event Stream
    │           ├── recovery/page.tsx        <- Recovery Console
    │           └── memory/page.tsx          <- Operational Memory
    ├── components/
    │   ├── ui/                              <- shadcn/ui overrides
    │   ├── runtime/                         <- Runtime-specific components
    │   │   ├── OperationalGraph.tsx
    │   │   ├── MissionCard.tsx
    │   │   ├── ResourceBadge.tsx
    │   │   ├── EventStream.tsx
    │   │   ├── DivergenceAlert.tsx
    │   │   ├── RecoveryConsole.tsx
    │   │   ├── MemoryPanel.tsx
    │   │   └── MetricsBar.tsx
    │   └── layout/
    │       ├── Header.tsx
    │       ├── Sidebar.tsx
    │       └── PanelLayout.tsx
    ├── lib/
    │   ├── api.ts                           <- REST API client
    │   ├── websocket.ts                     <- WebSocket client
    │   └── adapters/
    │       ├── airport.ts                   <- Airport adapter config
    │       ├── hospital.ts                  <- Hospital stub
    │       └── warehouse.ts                 <- Warehouse stub
    ├── hooks/
    │   ├── useRuntimeState.ts
    │   ├── useWebSocket.ts
    │   └── useDivergence.ts
    ├── types/
    │   └── runtime.ts                       <- Shared TypeScript types
    ├── public/
    │   └── fonts/                           <- Optional self-hosted fonts
    ├── tailwind.config.js
    ├── next.config.js
    └── package.json
```

---

# Pages

## Priority Order

| Priority | Route                           | Screen               | Status      |
|----------|---------------------------------|----------------------|-------------|
| P0       | `/`                             | Home — Adapter Picker| NOT STARTED |
| P0       | `/playground/airport`           | Runtime Dashboard    | NOT STARTED |
| P0       | `/playground/airport/recovery`  | Recovery Console     | NOT STARTED |
| P1       | `/playground/airport/events`    | Event Stream         | NOT STARTED |
| P1       | `/playground/airport/memory`    | Operational Memory   | NOT STARTED |
| P2       | `/playground/hospital`          | Hospital Stub        | NOT STARTED |
| P2       | `/playground/warehouse`         | Warehouse Stub       | NOT STARTED |
| P3       | `/graph`                        | Graph Explorer       | NOT STARTED |

## Page Specifications

### `/` — Home (MatrixOS Playground)
- MatrixOS logo + tagline: "A runtime platform for dynamic operational systems"
- Adapter selector cards:
  - **Airport** — fully functional, CTA: "Launch Runtime"
  - **Hospital** — visible, CTA: "Coming Soon" (disabled)
  - **Warehouse** — visible, CTA: "Coming Soon" (disabled)
- Purpose: sell the platform story to judges before they click in
- Style: dark, cinematic, neomorphic adapter cards

### `/playground/[adapter]` — Runtime Dashboard
Three-panel layout + metrics bar:
```
+----------------------------------------------------------+
|  Header: MatrixOS | Adapter: Airport | Status: LIVE      |
+----------------+---------------------+--------------------+
|  LEFT PANEL    |    CENTER PANEL     |   RIGHT PANEL      |
|  World State   |  Operational Graph  |  Runtime Reasoning |
|  Missions      |  (React Flow)       |  Impact / Decision |
|  Resources     |  Live node updates  |  Validation result |
|  Events feed   |                     |  Repair explanation|
+----------------+---------------------+--------------------+
|  METRICS BAR: Recovery Time | Repairs | Delay | Utilization|
+----------------------------------------------------------+
```

### `/playground/[adapter]/events` — Event Stream
- Live scrolling feed of runtime events
- Color-coded: divergence (red), info (cyan), recovery (green)
- "Trigger Event" button panel with scripted disruptions
- Geist Mono timestamps throughout

### `/playground/[adapter]/recovery` — Recovery Console
Full repair pipeline:
1. Impact Assessment
2. Reasoning Layer output (AI explanation)
3. Decision selected (repair / delay / escalate)
4. Validation result (PASS green / REJECTED red + reason)
5. Execution status (applied / pending / failed)

### `/playground/[adapter]/memory` — Operational Memory
- Episodic memory: past recovery episodes table
- Semantic memory: policy effectiveness / success rates
- Procedural memory: repair playbooks
- Confidence scores per strategy (Recharts chart)

---

# Runtime Architecture (Backend)

## 6 Generic Layers
```
Perception Layer   <- Reads live graph + incoming events
Reasoning Layer    <- Impact assessment + repair generation (LLM)
Decision Layer     <- Chooses response (priority/constraint-aware)
Validation Layer   <- Deterministic constraint enforcement (REJECTS bad plans)
Execution Layer    <- Applies approved repair to world model
Learning Layer     <- Stores + reuses recovery outcomes
```

## Domain SDK — Adapter Interface
Every adapter must implement:
```python
resources()    -> List[Resource]
tasks()        -> List[Task]
constraints()  -> List[Constraint]
events()       -> List[EventType]
objectives()   -> List[Objective]
validators()   -> List[Validator]
visualizer()   -> VisualizerConfig
```

## Adapters
| Adapter                  | Status    |
|--------------------------|-----------|
| AirportAdapter           | IMPLEMENT |
| HospitalAdapter          | STUB ONLY |
| WarehouseAdapter         | STUB ONLY |
| FactoryAdapter           | FUTURE    |
| EmergencyResponseAdapter | FUTURE    |

## Operational Graph
```
Nodes: Mission | Task | Resource | Constraint | Actor | Objective | Event
Edges: depends_on | assigned_to | blocks | requires | violates | produces | observes
```

## FastAPI Endpoints (planned, not built)
| Method | Route             | Purpose                      | Status    |
|--------|-------------------|------------------------------|-----------|
| POST   | /api/events       | Ingest disruption event      | NOT BUILT |
| GET    | /api/world-state  | Current graph snapshot       | NOT BUILT |
| GET    | /api/missions     | All active missions + status | NOT BUILT |
| GET    | /api/resources    | Resource availability        | NOT BUILT |
| GET    | /api/divergences  | Active divergence records    | NOT BUILT |
| GET    | /api/repairs      | Repair history               | NOT BUILT |
| POST   | /api/trigger      | Fire a scripted demo event   | NOT BUILT |
| GET    | /api/memory       | Recovery memory records      | NOT BUILT |
| WS     | /ws/runtime       | Live runtime state stream    | NOT BUILT |

---

# Seed Data Required (JSON files, to be created in /data/)
| File                           | Purpose                                           |
|--------------------------------|---------------------------------------------------|
| `airport-scenario.json`        | 3 aircraft, 6 resources, initial plan, task graph |
| `disruption-events.json`       | FuelTruckFailure, HeavyRain, GateBlocked scripts  |
| `recovery-knowledge-base.json` | 10-15 past recoveries with confidence scores      |
| `runtime-invariants.json`      | Hard constraint definitions                       |

---

# Required Assets

## Icons
- **Lucide React** — general UI (via shadcn)
- **Phosphor Icons** — aviation-specific (aircraft, gate icons)

## Custom SVGs (to be created)
| Asset                         | Status      |
|-------------------------------|-------------|
| MatrixOS logo / wordmark      | NOT CREATED |
| Airport gate layout schematic | NOT CREATED |
| Aircraft top-down silhouette  | NOT CREATED |
| Service vehicle icons         | NOT CREATED |
| Favicon set (32x32, 64x64)    | NOT CREATED |

## Visualization Libraries
| Library       | Use                                         |
|---------------|---------------------------------------------|
| Recharts      | Metrics bar charts, recovery rate charts    |
| React Flow    | Operational graph, task DAG, dependency map |
| Framer Motion | All micro-animations, state transitions     |
| D3.js         | Gantt / timeline (expected vs actual)       |

---

# Framer Motion Animations
| Animation                  | Trigger              | Effect                                  |
|----------------------------|----------------------|-----------------------------------------|
| Divergence pulse           | Event fires          | Red ring pulse on affected mission card |
| Recovery glow              | Repair approved      | Green border fade-in on fixed task      |
| Constraint rejection flash | Invariant violation  | Red flash + shake on rejected plan      |
| State transition           | Task status changes  | Smooth color/border morph               |
| Event stream entry         | New event arrives    | Slide-in from right in event log        |
| Metrics counter            | Recovery executes    | Animated number increment               |
| Graph edge highlight       | Impact assessment    | Path highlight along React Flow edges   |

---

# Components (to be built)

## Layout
| Component   | Purpose                                 |
|-------------|-----------------------------------------|
| Header      | Brand, adapter selector, runtime status |
| Sidebar     | Navigation between playground screens   |
| PanelLayout | Three-column dashboard wrapper          |

## Runtime
| Component        | Purpose                                       |
|------------------|-----------------------------------------------|
| OperationalGraph | React Flow canvas — live node/edge graph      |
| MissionCard      | Neomorphic raised card per aircraft/mission   |
| ResourceBadge    | Status pill: Available / Occupied / Failed    |
| EventStream      | Scrolling live event log                      |
| DivergenceAlert  | Red pulse alert card when divergence detected |
| RecoveryConsole  | Full pipeline: impact -> decision -> validation|
| MemoryPanel      | Past recovery table with confidence scores    |
| MetricsBar       | Bottom KPI strip                              |

## Adapter Picker (Home)
| Component     | Purpose                                      |
|---------------|----------------------------------------------|
| AdapterCard   | Neomorphic card per domain (airport etc)     |
| AdapterBadge  | "LIVE" / "Coming Soon" status badge          |
| PlaygroundHero| Headline + tagline hero block                |

---

# State Management
| Hook / Context  | Purpose                                | Status    |
|-----------------|----------------------------------------|-----------|
| useRuntimeState | Global runtime graph state             | NOT BUILT |
| useWebSocket    | WebSocket connection + message handler | NOT BUILT |
| useDivergence   | Active divergence records + alerts     | NOT BUILT |
| RuntimeContext  | Provider wrapping playground layout    | NOT BUILT |

---

# Environment Variables
| Variable                | Value                           | Status  |
|-------------------------|---------------------------------|---------|
| NEXT_PUBLIC_API_URL     | http://localhost:8000           | MISSING |
| NEXT_PUBLIC_WS_URL      | ws://localhost:8000/ws/runtime  | MISSING |
| OPENAI_API_KEY          | (user provides)                 | MISSING |

---

# Completed
- [x] Product requirements finalized (prd.md updated)
- [x] README updated with new platform positioning
- [x] Font decision: Space Grotesk + Geist Mono
- [x] Palette analyzed: monochromatic black scale + 5 accent colors defined
- [x] Neomorphism package evaluated: use as visual reference only
- [x] Design system decided: dark neomorphism cards + glassmorphism panels
- [x] Page structure defined: 7 routes, priority ordered
- [x] Backend architecture defined: 6 layers + adapter SDK
- [x] API endpoints mapped (planned, not built)
- [x] Component inventory created
- [x] Seed data files identified
- [x] Asset list created (matrixos_assets_guide.md)
- [x] EXECUTION_PLAN.md created

---

# In Progress

[ ] **Brick 1 — Next.js project scaffold**
- Current file: `frontend/` (empty directory)
- Current objective: Run create-next-app, install all dependencies, verify dev server starts
- Current blockers: None
- Success condition: `npm run dev` runs with blank dark page, no errors

---

# Next Tasks (ordered, highest priority first)

> BUILD PHILOSOPHY: Brick by brick. One component at a time.
> Each brick is built completely and verified before the next brick starts.
> Do NOT build an entire page at once. Do NOT skip ahead.
> Mock/static data is used for all UI bricks until backend is wired.

---

## PHASE 1 — Project Foundation

1. [ ] **Brick 1 — Next.js scaffold**
   - File: `frontend/`
   - Command: `npx create-next-app@latest . --typescript --tailwind --eslint --app`
   - Done when: dev server runs, blank page loads, no errors

2. [ ] **Brick 2 — Dependency installation**
   - Install: `framer-motion reactflow recharts lucide-react @phosphor-icons/react`
   - Install: `npx shadcn-ui@latest init`
   - Done when: all packages resolve, no peer dep errors

3. [ ] **Brick 3 — Tailwind config**
   - File: `tailwind.config.js`
   - Add: Space Grotesk + Geist Mono font families
   - Add: extended color palette (all 11 base tokens + 5 accent colors)
   - Add: custom shadow utilities (`shadow-neu-raised`, `shadow-neu-inset`)
   - Done when: custom classes work in a test component

4. [ ] **Brick 4 — Global CSS + CSS variables**
   - File: `app/globals.css`
   - Add: CSS variables for all palette tokens
   - Add: neomorphic shadow variables
   - Add: base `body` dark background (#1A1A1A)
   - Done when: page background is #1A1A1A

5. [ ] **Brick 5 — Root layout with fonts**
   - File: `app/layout.tsx`
   - Add: `Space_Grotesk` + `Geist_Mono` via `next/font/google`
   - Add: CSS variable injection (`--font-sans`, `--font-mono`)
   - Add: base html/body classes
   - Done when: fonts load correctly in browser

6. [ ] **Brick 6 — Shared TypeScript types**
   - File: `types/runtime.ts`
   - Define: Mission, Task, Resource, Event, Divergence, RepairPolicy, Adapter types
   - Done when: types file compiles with no errors

---

## PHASE 2 — Home Page (brick by brick)

7. [ ] **Brick 7 — PlaygroundHero component**
   - File: `components/layout/PlaygroundHero.tsx`
   - Content: MatrixOS logo text + tagline + subtitle
   - Style: centered, Space Grotesk 700, dark background
   - Done when: renders correctly on `/` route

8. [ ] **Brick 8 — AdapterBadge component**
   - File: `components/runtime/AdapterBadge.tsx`
   - Variants: `live` (green pulse dot) | `coming-soon` (grey, disabled)
   - Done when: both badge states render with correct colors

9. [ ] **Brick 9 — AdapterCard component**
   - File: `components/runtime/AdapterCard.tsx`
   - Props: `name`, `description`, `status` (live | coming-soon), `icon`, `href`
   - Style: dark neomorphic raised card, hover lift effect (Framer Motion)
   - Done when: all 3 adapter cards render on home page

10. [ ] **Brick 10 — Home page assembly**
    - File: `app/page.tsx`
    - Assemble: PlaygroundHero + 3 AdapterCards (Airport live, Hospital stub, Warehouse stub)
    - Route: Airport card links to `/playground/airport`
    - Done when: full home page renders and navigation works

---

## PHASE 3 — Dashboard Shell (brick by brick)

11. [ ] **Brick 11 — Dashboard layout shell**
    - File: `app/playground/[adapter]/layout.tsx`
    - Structure: Header bar + three-column content area + bottom metrics bar slots
    - NO content yet — just the grid/flex skeleton
    - Done when: layout renders with visible grid lines (use border outlines)

12. [ ] **Brick 12 — Header component**
    - File: `components/layout/Header.tsx`
    - Content: MatrixOS wordmark | Adapter name pill | Runtime status indicator (LIVE dot)
    - Done when: renders in dashboard layout with mock adapter name "Airport"

13. [ ] **Brick 13 — PanelLayout component**
    - File: `components/layout/PanelLayout.tsx`
    - Props: `left`, `center`, `right` (ReactNode slots)
    - Style: glassmorphism panels (backdrop-blur, subtle border, #292929 bg)
    - Done when: three panels render with visible glass effect

---

## PHASE 4 — Left Panel: World State (brick by brick)

14. [ ] **Brick 14 — ResourceBadge component**
    - File: `components/runtime/ResourceBadge.tsx`
    - Props: `name`, `type`, `status` (available | occupied | unavailable | failed)
    - Style: small pill with status color dot
    - Done when: 4 status variants render correctly

15. [ ] **Brick 15 — MissionCard component**
    - File: `components/runtime/MissionCard.tsx`
    - Props: `id`, `type`, `status`, `priority`, `deadline`, `tasks[]`
    - Style: neomorphic raised card, status color left border
    - States: normal | in-progress | delayed | recovered | diverged
    - Done when: card renders with mock airport mission data

16. [ ] **Brick 16 — Left panel assembly**
    - File: `components/runtime/WorldStatePanel.tsx`
    - Content: "MISSIONS" section label + list of MissionCards
    - Content: "RESOURCES" section label + list of ResourceBadges
    - Mock data: 3 missions, 6 resources
    - Done when: full left panel populates with mock airport data

---

## PHASE 5 — Center Panel: Operational Graph (brick by brick)

17. [ ] **Brick 17 — React Flow base canvas**
    - File: `components/runtime/OperationalGraph.tsx`
    - Setup: ReactFlow provider, blank canvas, dark background
    - Done when: empty graph canvas renders without errors

18. [ ] **Brick 18 — Custom node types**
    - File: `components/runtime/nodes/MissionNode.tsx`
    - File: `components/runtime/nodes/TaskNode.tsx`
    - File: `components/runtime/nodes/ResourceNode.tsx`
    - Style: colored by type, Geist Mono labels, neomorphic border
    - Done when: 3 node types render on the canvas

19. [ ] **Brick 19 — Static airport graph**
    - File: `lib/adapters/airport.ts`
    - Define: mock nodes (3 missions, 9 tasks, 6 resources) + edges
    - Done when: full airport operational graph renders on canvas with all node types

---

## PHASE 6 — Right Panel: Runtime Reasoning (brick by brick)

20. [ ] **Brick 20 — ReasoningPanel shell**
    - File: `components/runtime/ReasoningPanel.tsx`
    - Content: placeholder sections for Impact / Decision / Validation
    - Style: glassmorphism, Geist Mono text throughout
    - Done when: empty panel renders with section labels

21. [ ] **Brick 21 — DivergenceAlert component**
    - File: `components/runtime/DivergenceAlert.tsx`
    - Props: `eventType`, `affectedMissions[]`, `severity`
    - Style: red border, Framer Motion pulse animation
    - Done when: alert renders and pulses with mock data

22. [ ] **Brick 22 — ValidationResult component**
    - File: `components/runtime/ValidationResult.tsx`
    - Props: `status` (PASS | REJECTED), `reason`
    - Style: green for PASS, red flash + shake for REJECTED
    - Done when: both states render with animations

---

## PHASE 7 — Bottom: Metrics Bar (brick by brick)

23. [ ] **Brick 23 — MetricTile component**
    - File: `components/runtime/MetricTile.tsx`
    - Props: `label`, `value`, `unit`, `trend` (up | down | neutral)
    - Style: neomorphic inset display, Geist Mono value, Space Grotesk label
    - Done when: single tile renders with mock number

24. [ ] **Brick 24 — MetricsBar assembly**
    - File: `components/runtime/MetricsBar.tsx`
    - Content: 5 MetricTiles: Recovery Time | Repairs Issued | Delay Reduction | Invariant Violations Prevented | Resource Utilization
    - Mock data: static numbers
    - Done when: full bottom strip renders across dashboard

---

## PHASE 8 — Dashboard Final Assembly

25. [ ] **Brick 25 — Full dashboard page**
    - File: `app/playground/[adapter]/page.tsx`
    - Assemble: Header + PanelLayout(WorldStatePanel, OperationalGraph, ReasoningPanel) + MetricsBar
    - Done when: complete 3-panel dashboard renders with all mock data

---

## PHASE 9 — Event Stream Page (brick by brick)

26. [ ] **Brick 26 — EventRow component**
    - File: `components/runtime/EventRow.tsx`
    - Props: `id`, `type`, `timestamp`, `severity`, `description`
    - Style: color-coded row, Geist Mono ID + timestamp, slide-in animation
    - Done when: single event row renders

27. [ ] **Brick 27 — EventStream component**
    - File: `components/runtime/EventStream.tsx`
    - Content: scrollable list of EventRows with mock data
    - Done when: 10 mock events render in scrollable feed

28. [ ] **Brick 28 — TriggerEventPanel component**
    - File: `components/runtime/TriggerEventPanel.tsx`
    - Content: buttons for each scripted event (FuelTruckFailure, HeavyRain, GateBlocked, CrewUnavailable, EmergencyArrival)
    - Style: neomorphic raised buttons, one per disruption type
    - Done when: panel renders with 5 trigger buttons

29. [ ] **Brick 29 — Events page assembly**
    - File: `app/playground/[adapter]/events/page.tsx`
    - Assemble: TriggerEventPanel + EventStream
    - Done when: full events page renders

---

## PHASE 10 — Recovery Console Page (brick by brick)

30. [ ] **Brick 30 — PipelineStep component**
    - File: `components/runtime/PipelineStep.tsx`
    - Props: `step`, `title`, `status` (pending | active | complete | rejected), `content`
    - Style: numbered step with connector line, status color
    - Done when: single pipeline step renders in both states

31. [ ] **Brick 31 — RecoveryConsole component**
    - File: `components/runtime/RecoveryConsole.tsx`
    - Content: 5 PipelineSteps (Impact → Reasoning → Decision → Validation → Execution)
    - Mock data: static airport scenario
    - Done when: full recovery pipeline renders with mock data

32. [ ] **Brick 32 — Recovery page assembly**
    - File: `app/playground/[adapter]/recovery/page.tsx`
    - Assemble: RecoveryConsole + DivergenceAlert
    - Done when: full recovery page renders

---

## PHASE 11 — Memory Page (brick by brick)

33. [ ] **Brick 33 — MemoryTable component**
    - File: `components/runtime/MemoryTable.tsx`
    - Content: table of past recoveries (id, type, strategy, confidence, outcome)
    - Style: Geist Mono data cells, sortable columns
    - Done when: table renders with 10 mock recovery rows

34. [ ] **Brick 34 — ConfidenceChart component**
    - File: `components/runtime/ConfidenceChart.tsx`
    - Library: Recharts BarChart
    - Content: strategy name vs confidence score
    - Done when: chart renders with mock strategy data

35. [ ] **Brick 35 — Memory page assembly**
    - File: `app/playground/[adapter]/memory/page.tsx`
    - Assemble: MemoryTable + ConfidenceChart + tab switcher (Episodic / Semantic / Procedural)
    - Done when: full memory page renders

---

## PHASE 12 — Stub Pages

36. [ ] **Brick 36 — Hospital stub page**
    - File: `app/playground/hospital/page.tsx`
    - Content: "Coming Soon" message + HospitalAdapter card
    - Done when: page renders and links back to home

37. [ ] **Brick 37 — Warehouse stub page**
    - File: `app/playground/warehouse/page.tsx`
    - Same as hospital stub
    - Done when: page renders and links back to home

---

## PHASE 13 — Backend (after all UI bricks complete)

38. [ ] **Brick 38 — FastAPI scaffold**
    - File: `backend/main.py`
    - FastAPI app + CORS + health check endpoint
    - Done when: `uvicorn main:app` starts

39. [ ] **Brick 39 — SQLite schema + seed**
    - File: `backend/models/database.py`
    - Create all 6 tables, load seed JSON
    - Done when: DB initializes with airport scenario data

40. [ ] **Brick 40 — World model service**
    - File: `backend/services/world_model.py`
    - CRUD for operational graph nodes/edges
    - Done when: GET /api/world-state returns seeded graph

41. [ ] **Brick 41 — Event manager service**
    - File: `backend/services/event_manager.py`
    - POST /api/events + POST /api/trigger
    - Done when: events persist + return correctly

42. [ ] **Brick 42 — Impact assessment service**
    - File: `backend/services/impact_assessment.py`
    - Traverses graph to find affected nodes from an event
    - Done when: returns list of affected missions/tasks for a trigger

43. [ ] **Brick 43 — Constraint engine**
    - File: `backend/services/constraint_engine.py`
    - Hard rules: boarding/fueling overlap, pushback clearance, etc.
    - Returns PASS or REJECTED with reason
    - Done when: correctly rejects at least one invalid repair

44. [ ] **Brick 44 — Planning service (LLM)**
    - File: `backend/services/planning_service.py`
    - GPT-4o call with structured JSON output for repair candidates
    - Done when: returns structured repair plan JSON

45. [ ] **Brick 45 — Experience store**
    - File: `backend/services/experience_store.py`
    - GET /api/memory + POST to record outcomes
    - Similarity retrieval from recovery_memory table
    - Done when: returns ranked strategies for a given divergence

46. [ ] **Brick 46 — WebSocket runtime stream**
    - File: `backend/services/websocket_manager.py`
    - WS endpoint: /ws/runtime
    - Broadcasts state diffs when events fire
    - Done when: frontend receives live events via WebSocket

---

## PHASE 14 — Wire Frontend to Backend

47. [ ] **Brick 47 — REST API client**
    - File: `lib/api.ts`
    - Typed wrappers for all REST endpoints
    - Done when: all endpoints callable from frontend

48. [ ] **Brick 48 — WebSocket hook**
    - File: `hooks/useWebSocket.ts`
    - Connects to /ws/runtime, dispatches events to state
    - Done when: live event appears in EventStream without page refresh

49. [ ] **Brick 49 — Replace mock data (dashboard)**
    - Replace all static mock data in dashboard with live API responses
    - Done when: dashboard shows real seeded airport scenario

50. [ ] **Brick 50 — Wire trigger buttons to backend**
    - TriggerEventPanel buttons call POST /api/trigger
    - Dashboard + EventStream update via WebSocket
    - Done when: clicking "FuelTruckFailure" triggers full runtime chain

---

## PHASE 15 — Animations + Polish

51. [ ] **Brick 51 — Divergence pulse animation**
    - Framer Motion: red ring pulse on MissionCard when divergence detected

52. [ ] **Brick 52 — Recovery glow animation**
    - Framer Motion: green border fade-in on recovered mission card

53. [ ] **Brick 53 — Constraint rejection flash**
    - Framer Motion: red flash + shake on ValidationResult when REJECTED

54. [ ] **Brick 54 — Event stream slide-in**
    - Framer Motion: new EventRow slides in from right

55. [ ] **Brick 55 — Metrics counter animation**
    - Framer Motion useMotionValue: numbers increment smoothly on recovery

56. [ ] **Brick 56 — Graph edge highlight**
    - React Flow animated edges on impact assessment path

---

## PHASE 16 — Demo Prep

57. [ ] **Brick 57 — Seed data finalization**
    - `data/airport-scenario.json` — 3 aircraft, 6 resources, task graph
    - `data/disruption-events.json` — 5 scripted events
    - `data/recovery-knowledge-base.json` — 15 seeded past recoveries
    - `data/runtime-invariants.json` — 5 hard constraint rules

58. [ ] **Brick 58 — Full demo run-through**
    - Test all 5 demo minutes end-to-end
    - Verify: divergence visible, at least one repair rejected, recovery executes
    - Done when: demo runs without manual intervention

---

# Modified Files

| Path                            | Purpose              | Changes                              |
|---------------------------------|----------------------|--------------------------------------|
| prd.md                          | Product requirements | Full rewrite — platform framing      |
| README.md                       | Project README       | Full rewrite — generic runtime focus |
| matrixos_assets_guide.md        | Asset decisions      | Created — fonts, icons, animations   |
| EXECUTION_PLAN.md               | This file            | Created — project source of truth    |

---

# Database Schema (planned)

```sql
-- missions
CREATE TABLE missions (
  id TEXT PRIMARY KEY,
  adapter TEXT,
  type TEXT,
  priority INTEGER,
  status TEXT,
  deadline TEXT,
  created_at TEXT
);

-- tasks
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  mission_id TEXT,
  type TEXT,
  duration INTEGER,
  expected_state TEXT,
  actual_state TEXT,
  execution_state TEXT
);

-- resources
CREATE TABLE resources (
  id TEXT PRIMARY KEY,
  adapter TEXT,
  type TEXT,
  availability TEXT,
  current_assignment TEXT
);

-- events
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  adapter TEXT,
  type TEXT,
  timestamp TEXT,
  severity TEXT,
  payload TEXT
);

-- divergences
CREATE TABLE divergences (
  id TEXT PRIMARY KEY,
  expected_state TEXT,
  actual_state TEXT,
  severity TEXT,
  detected_at TEXT
);

-- recovery_memory
CREATE TABLE recovery_memory (
  id TEXT PRIMARY KEY,
  divergence_signature TEXT,
  strategy TEXT,
  confidence REAL,
  success_rate REAL,
  outcome TEXT,
  recorded_at TEXT
);
```

---

# Bugs
None — build not started.

---

# Decisions

| Decision | Reason |
|----------|--------|
| Next.js 15 App Router | Modern, native font optimization, server/client split |
| Tailwind CSS | Required per PRD; avoids Bootstrap conflict with neumorphism package |
| Do NOT import Bootstrap neumorphism package | Stack mismatch — extract SCSS shadow values as Tailwind utilities instead |
| Dark mode only | Ops/runtime tools read as more technical in dark mode |
| Glassmorphism for main panels | Dense data + colored runtime states need backdrop-blur clarity, not neomorphic softness |
| Geist Mono over JetBrains Mono | Made by Vercel — purpose-built for Next.js, no retro terminal vibes |
| Space Grotesk for UI | Geometric + technical — works at data-density scales |
| Airport as sole full adapter | Hackathon scope; Hospital + Warehouse appear as stubs for platform story |
| SQLite for backend | Zero config, fast seed, replaceable later |
| GPT-4o structured JSON | AI proposes repair candidates; constraint engine validates — this split IS the thesis |
| Mock data first | Build all UI with static data, wire backend last — faster iteration |

---

# Technical Debt

| Item                       | Reason Deferred               |
|----------------------------|-------------------------------|
| Hospital adapter full impl | Hackathon scope               |
| Warehouse adapter full impl| Hackathon scope               |
| OR-Tools CP-SAT optimizer  | May simplify if time-limited  |
| Full graph DB persistence  | SQLite in-memory for hackathon|
| Authentication             | Not needed for demo           |
| WebSocket scaling          | Single connection for demo    |
| Accessibility (a11y)       | Design first, a11y pass later |

---

# Current Context

Nothing has been built yet. Planning phase is complete.

The next task is to initialize the Next.js frontend inside:
`c:\Users\Rahul SP\MatrixOS\frontend\`

Start with Task 1 (Next.js initialization) and proceed in order.
Do NOT change any decisions above without updating this file.

---

# Handoff Instructions

1. Read this entire file before writing any code.
2. The `frontend/` directory is EMPTY — start there.
3. First command: scaffold Next.js 15 + Tailwind inside `frontend/`
4. Follow the Folder Structure section exactly.
5. Use Space Grotesk + Geist Mono via `next/font/google`.
6. Do NOT import the Bootstrap neumorphism package.
7. Build pages in Priority Order: Home -> Dashboard -> Recovery -> Events -> Memory.
8. Use static/mock data first — wire backend AFTER all UI is complete.
9. After any task, mark it `[x]` in Completed and update In Progress + Next Tasks.
10. Backend (FastAPI) is separate — build AFTER frontend UI is complete.

---

# Session Summary

**Session 1 — 2026-07-09**

- Read and analyzed: prd.md, README.md, matrixos_README.md, pallete.png
- Understood product pivot: MatrixOS = domain-agnostic runtime platform, airport is adapter #1
- Decided font system: Space Grotesk + Geist Mono (rejected JetBrains Mono)
- Analyzed monochromatic black palette + defined 5 semantic accent colors
- Evaluated Themesberg neumorphism Bootstrap package — use as reference only
- Decided UI style: dark neomorphism for cards + glassmorphism for panels
- Defined 7-page route structure with build priority
- Mapped all backend: 6 runtime layers + adapter SDK contract
- Defined all components, hooks, state, endpoints, animations, seed data
- Created matrixos_assets_guide.md
- Created EXECUTION_PLAN.md (this file)

No code written. Planning 100% complete. Ready to build.
