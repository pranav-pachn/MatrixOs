Based on the updated PRD, here's the full page map:

\---

\## MatrixOS — Page Structure

\### 1. \`/\` — Landing / Home (MatrixOS Playground)

The \*\*entry point\*\*. This is the platform story page.

\- MatrixOS branding + one-line pitch

\- Adapter selector cards: \*\*Airport\*\* | \*\*Hospital\*\* | \*\*Warehouse\*\*

\- Hospital & Warehouse show as "Coming Soon" (skeleton state) — but they must be \*visible\* to sell the platform story

\- "Launch Runtime" CTA → goes to the dashboard for the selected adapter

\---

\### 2. \`/playground/\[adapter\]\` — Runtime Dashboard

The \*\*main working screen\*\*. Everything lives here for the selected adapter (e.g. \`/playground/airport\`).

This is a \*\*single multi-panel dashboard\*\*, not separate pages:

\`\`\`

┌─────────────────────────────────────────────────────┐

│ Header: MatrixOS | Adapter: Airport | Runtime: LIVE │

├──────────────┬──────────────────────┬────────────────┤

│ Left Panel │ Center Panel │ Right Panel │

│ World State │ Operational Graph │ Runtime │

│ + Resources │ (React Flow) │ Reasoning │

│ │ │ │

├──────────────┴──────────────────────┴────────────────┤

│ Bottom: Metrics Bar (KPIs) │

└─────────────────────────────────────────────────────┘

\`\`\`

\---

\### 3. \`/playground/\[adapter\]/events\` — Event Stream

\- Live feed of all runtime events

\- Divergence alerts highlighted

\- "Trigger Event" controls (scripted demo events)

\- Event timeline / history log

\---

\### 4. \`/playground/\[adapter\]/recovery\` — Recovery Console

The \*\*proof-of-runtime\*\* screen. Shows the full repair pipeline:

\- Impact assessment summary (what broke, what's affected)

\- Reasoning layer output (AI explanation)

\- Decision selected (repair / delay / escalate)

\- Validation result (\`PASS\` / \`REJECTED\` with reason)

\- Execution status (applied / pending)

\---

\### 5. \`/playground/\[adapter\]/memory\` — Operational Memory

\- Past recovery episodes (episodic memory)

\- Policy effectiveness table (semantic memory)

\- Repair playbooks (procedural memory)

\- Confidence scores per strategy

\---

\### 6. \`/graph\` — Operational Graph Explorer \*(optional but strong demo page)\*

\- Full-screen React Flow visualization of the operational graph

\- Node types: Mission, Task, Resource, Constraint, Actor, Objective, Event

\- Edge types: depends\_on, assigned\_to, blocks, requires, violates

\- Filter by adapter / node type

\- Live updates as events fire

\---

\## Full Route Map

\`\`\`

/ ← Playground Home (adapter picker)

/playground/airport ← Airport Runtime Dashboard

/playground/airport/events ← Event Stream

/playground/airport/recovery ← Recovery Console

/playground/airport/memory ← Operational Memory

/playground/hospital ← Hospital (Coming Soon stub)

/playground/warehouse ← Warehouse (Coming Soon stub)

/graph ← (Optional) Graph Explorer

\`\`\`

\---

\## Priority Order for Build

| Priority | Page | Why |

|----------|------|-----|

| \*\*P0\*\* | \`/\` Home | Platform story — judges see this first |

| \*\*P0\*\* | \`/playground/airport\` Dashboard | The main demo screen |

| \*\*P0\*\* | \`/playground/airport/recovery\` | The runtime proof point |

| \*\*P1\*\* | \`/playground/airport/events\` | Makes the runtime feel live |

| \*\*P1\*\* | \`/playground/airport/memory\` | Differentiator (experience-based recovery) |

| \*\*P2\*\* | \`/playground/hospital\` + \`/warehouse\` | Stub pages — platform story only |

| \*\*P2\*\* | \`/graph\` | Visual wow factor, optional |

The \*\*Home + Dashboard + Recovery\*\* trio is the minimum viable demo. Everything else is additive.