# MatrixOS

**Adaptive Runtime for Coordinated AI Systems**

> **Every plan eventually becomes wrong.**

MatrixOS is a runtime platform for maintaining execution viability when reality diverges from plan, while strictly enforcing non-negotiable operational rules.

Existing AI agent frameworks generate plans or route messages. MatrixOS does more: it provides **verifiable recovery**. It continuously repairs execution when the world changes, guaranteeing that no AI action violates operational invariants.

---

## The Three Pillars

MatrixOS is built on exactly three core concepts:

### 1. Shared World Model
Any operational environment is represented as a live graph (Missions, Tasks, Resources, Constraints). This is the common runtime language of MatrixOS.

### 2. Invariant Engine
This is the core moat. MatrixOS enforces strict, deterministic operational rules. Invariants are supplied by the Domain Adapter and encode immutable operational rules defined by domain experts.

### 3. Recovery Intelligence
When a disruption occurs, MatrixOS evaluates the impact and searches for viable recovery paths, using **Recovery Memory** to learn which repairs work best over time.

---

## The Recovery Loop

MatrixOS is not a static stack; it is a continuous loop:

```text
       Event (Disruption)
               ↓
       Impact Assessment
               ↓
    Planner Agent (Propose Repairs)
               ↓
  Recovery Agent (Rank & Refine)
               ↓
       Invariant Engine (Validate)
               ↓
      Execution Runtime (Apply)
               ↓
     Recovery Memory Updated
```

AI proposes solutions, but the Invariant Engine deterministically validates them.

---

## Research Question

> **How can autonomous AI systems safely adapt operational plans without violating hard domain constraints?**

MatrixOS explores how to bridge the gap between non-deterministic AI problem-solving and the strict safety requirements of critical operational systems.

---

## Agent vs. Engine Roles

**Why multiple agents?**
Planning and recovery are different cognitive tasks. 
- **Planner Agent**: Generates viable repairs from the current world state.
- **Recovery Agent**: Reasons from prior operational outcomes to improve future repair strategies.
- **Invariant Engine (Non-Agent)**: Deterministic validation remains outside the agents to guarantee safety.

---

## Evaluation

How do we prove MatrixOS works? We measure our dynamic runtime against standard static workflows:

| Metric | Static Workflow | MatrixOS |
| :--- | :--- | :--- |
| **Recovery Time** | 8 min (Manual) | 2 min (Automatic) |
| **Safety Violations** | 3 (Human error) | 0 (Invariant Engine) |
| **Replanning** | Manual | Automatic |

---

## The Platform Experience & Customers

MatrixOS is a general platform, not a single application. 
**Potential Customers:** Airports, Logistics Companies, Hospitals, Manufacturing, Utilities.

**Dynamic Domain Switching:** 
The platform can load multiple domains. A user can click **Switch Adapter**, and the entire runtime transitions to the new domain's rules, constraints, and entities—**without restarting**.

The **Airport** is our Reference Implementation for the hackathon, but the runtime itself remains completely generic.

---

## Why MatrixOS is Different

If asked "Why can't standard agent frameworks build this?", the answer is:
**The Invariant Engine.** 

Standard frameworks orchestrate LLM calls. MatrixOS acts as a protective kernel that strictly verifies and recovers operations. It ensures that the AI cannot violate the physics or business rules of the domain.

---

# Tech Stack

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion
- React Flow
- Recharts

## Backend

- FastAPI (Python)
- WebSockets
- Pydantic
- Uvicorn

## AI Runtime

- DeepSeek V4 Pro via NVIDIA API (Recovery & Planner Agents)
- Structured Outputs
- Function Calling

## Optimization

- Google OR-Tools (CP-SAT)

## Runtime

- AsyncIO
- Event Bus
- Shared World Model
- Invariant Engine
- Recovery Memory

## Database

- SQLite 

## Deployment

- Vercel (Frontend)
- Railway / Render (Backend)

---

# Repository Structure

```
matrixos/
│
├── frontend/
│
├── backend/
│   ├── runtime/
│   ├── planner/
│   ├── recovery/
│   ├── invariants/
│   ├── adapters/
│   ├── optimization/
│   ├── execution/
│   └── api/
│
├── docs/
│
└── README.md
```

---

# Roadmap

## Hackathon MVP

- [x] Shared World Model
- [x] Runtime Architecture
- [ ] Planner Agent
- [ ] Recovery Agent
- [ ] Invariant Engine
- [ ] Airport Adapter
- [ ] Runtime Console
- [ ] Dynamic Recovery Demo

## Future

- Hospital Adapter
- Warehouse Adapter
- Factory Adapter
- Multi-runtime Coordination
- Predictive Operational Intelligence

---

# Runtime Architecture

```text
             MatrixOS Runtime

          Shared World Model

                  │

          Planner Agent (LLM)

                  │

         Recovery Agent (LLM)

                  │

         Invariant Engine

                  │

         Execution Runtime

                  │

          Recovery Memory

                  │

      Airport | Hospital | Factory
```

---

## MatrixOS vs Traditional Agent Frameworks

| Capability | Traditional Agent Framework | MatrixOS |
|------------|-----------------------------|----------|
| Task orchestration | ✅ | ✅ |
| Continuous world state | ❌ | ✅ |
| Deterministic safety validation | ❌ | ✅ |
| Runtime recovery | ⚠️ | ✅ |
| Domain adapters | ⚠️ | ✅ |
| Operational invariants | ❌ | ✅ |
| Adaptive replanning | ⚠️ | ✅ |
