**Jikan (時間) — Complete Final Spec**

---

**Identity**
Name: Jikan (時間) — Japanese for "time". A personal project estimation tool built by and for Daniel Karume.

---

**Tech stack**
React + Tailwind CSS + Mantine UI. No backend, no AI processing. All logic in client-side JS. html2canvas + jsPDF for PDF generation. localStorage for all persistence. Mantine handles interactive complexity (modals, notifications, sliders, dropdowns, tooltips). Tailwind handles layout and custom styling.

---

**Data persistence**
Every input auto-saves to localStorage on change and restores on next visit. This covers all wizard inputs, saved stack presets, team presets, risk entries, and custom technologies. A "clear all data" button is accessible from the app at all times — with a confirmation prompt before wiping. Full localStorage export and import as JSON for backup, restore, and device transfer.

---

**Wizard — 5 steps**

**Step 1 — Project**

- Project name
- Project type: web app / mobile app / full platform
- Scope: small (MVP, 1–3 features) / medium (4–8 features) / large (9+ features, multi-role)
- Scaling model toggle — user picks per project:
  - Flat additive: scope adds a fixed hour block, simple and predictable, default for quick estimates
  - COCOMO exponential: complexity compounds as scope grows using exponent `1.12–1.20`, more rigorous, recommended for large projects
  - Detailed view in Step 5 shows which model was used and explains the difference in the output
- Feature list: toggle features on/off. Each active feature gets three PERT inputs — optimistic, realistic, pessimistic hours
- PERT formula per feature: `(O + 4R + P) / 6`
- Built-in features: Auth, Dashboard, Payments, Real-time, File storage, Email/notifs, AI features, Admin portal, SEO/perf, CI/CD + deploy
- Custom feature entry available

**Step 2 — Stack**

Tech picker pre-loaded with your full portfolio stack, grouped by category. Each selected technology gets a familiarity toggle — "know it well" or "learning it". Custom technology entry for anything outside your stack.

Categories and technologies:

- Frontend: Next.js, React Native + Expo, Tailwind CSS, shadcn/ui, Mantine UI, TanStack Query, Zustand, Zod, React Hook Form
- Backend: Django + DRF, NestJS, Express, FastAPI, Elysia + Eden Treaty
- Database / ORM: PostgreSQL, MySQL, Drizzle ORM, Prisma, SQLite
- Auth: Better Auth, NextAuth
- Infrastructure: Docker, Nginx, GitHub Actions, Vercel, EAS
- Other: GraphQL/Strawberry, oRPC, OpenAPI/Scalar, Biome, Turborepo + Bun

Familiarity penalty is a weighted average across all "learning it" selections. More unfamiliar technologies = steeper penalty, fed directly into the formula chain.

**Stack presets / templates:**

Save any stack selection as a named template. Loading a preset pre-selects all its technologies and familiarity settings. Presets are fully editable after loading. Three built-in presets ship with the app:

- HackJS: Next.js + Expo + Elysia + Eden Treaty + Drizzle ORM + SQLite + Better Auth + Turborepo + Bun + shadcn/ui + Zod + TanStack Query + Biome
- Django starter: Next.js + Django + DRF + PostgreSQL + Prisma + NextAuth + Tailwind CSS + Zod
- FastAPI starter: Next.js + FastAPI + PostgreSQL + Drizzle ORM + Better Auth + Tailwind CSS + Zod

All saved presets persisted in localStorage. Presets exportable and importable as JSON independently from main data.

**Step 3 — Team**

- You are added as lead by default
- Add any number of additional team members
- Per person: name, role (frontend / backend / mobile / devops / fullstack), seniority (junior / mid / senior / lead), hours per day, AI toggle
- Efficiency ratings:
  - Junior: 50% — 70% with AI
  - Mid: 85% — 95% with AI
  - Senior: 110% — 120% with AI
  - Lead: 100% — 115% with AI
- Junior ramp-up cost: 12h without AI, 8h with AI — per junior added
- Mentorship load: 20–25% of lead output consumed per junior on the team
- Role overlap warning: if two or more people share the same role, the tool warns that decision overhead will increase
- Brooks' Law communication overhead: `n×(n-1)/2 × 4%` — auto-calculated, shown in detailed view
- Team compositions saveable as named presets, persisted in localStorage

**Step 4 — Risks**

Three preset categories, each with a probability slider (0–100%) and fixed impact buckets:

- Integration risks: third-party APIs, new services, webhooks
- Technical risks: unfamiliar patterns, performance constraints, complex architecture
- External risks: client feedback delays, vague requirements, scope drift

Impact buckets: low = 8h / medium = 20h / high = 40h — with a custom hour override per risk entry. Expected hours per risk: `probability × impact`. AI discount: 25% reduction on integration and technical risk hours when lead has AI enabled. Custom risk entry: free-form name, category, probability, impact. All risks persisted in localStorage.

**Step 5 — Results**

Two tabs: simple and detailed.

Simple view: total effort in person-months, calendar week range (low–high), effective team size, scaling model used, key assumptions in plain language.

Detailed view: full formula chain — PERT per feature, scaling model applied (flat or COCOMO with exponent shown), per-tech familiarity penalty, template savings (internal only, never shown to client), AI multiplier per person, Brooks' Law overhead, risk contributions, buffer tier applied, final totals.

---

**Formula chain**

1. Per-feature PERT: `(O + 4R + P) / 6` → summed across all active features = raw feature hours
2. Base hours by project type + scope scaling:
   - Flat additive: fixed hour block added per scope level
   - COCOMO exponential: `base × scope_size^1.15` — exponent steepens total as scope grows
3. Per-tech familiarity penalty: weighted average of "learning it" selections → additional hours added
4. Template savings: subtracted silently per phase — never shown to client or on PDF
5. AI multiplier: applied per person based on seniority + AI toggle → effective capacity per person
6. Brooks' Law overhead: `(1 + n×(n-1)/2 × 0.04)` multiplier on total effort
7. Junior ramp-up cost: flat hours added per junior
8. Mentorship tax: percentage of lead hours reallocated away from output
9. Risk hours: `sum of (probability × impact)` across all risks, with AI discount on integration and technical categories
10. Tiered buffer: determined by familiarity penalty magnitude — 15% mostly known / 30% mixed / 45% new territory
11. Total effort in hours → person-months (`÷ 160`) → divide by effective team capacity per day → calendar weeks as low–high PERT range

---

**PDF export — client facing**

Triggered from results screen. Prompts for project name and your name before generating. Three-tier layout:

- Lean MVP: minimum viable feature set, fastest timeline
- Standard build: what the client most likely needs
- Full-featured: everything scoped, longest timeline

Each tier shows: feature list, calendar week range, what's included, what's not included. No formulas, no multipliers, no stack or template mentions, no internal logic whatsoever.

---

**Data management**

- Auto-save to localStorage on every input change
- Full restore on next visit
- Clear all data — confirmation prompt before wiping
- Export full data as JSON
- Import JSON to restore previous state
- Stack presets independently exportable / importable
- Team presets independently exportable / importable



https://www.google.com/imgres?q=pert%20chart%20logo&imgurl=https%3A%2F%2Fnulab.com%2Fnuweb_assets%2Fimages%2Fcacoo%2Fexample%2Fwhy-use-pert-chart-maker.webp&imgrefurl=https%3A%2F%2Fnulab.com%2Fcacoo%2Fexamples%2Fpert-chart-maker%2F&docid=WeREbRRt6FjgvM&tbnid=xjUpApdMuszDtM&vet=12ahUKEwiB1tLsjqSTAxVJ8LsIHczOOCcQnPAOegQIJxAB..i&w=288&h=288&hcb=2&ved=2ahUKEwiB1tLsjqSTAxVJ8LsIHczOOCcQnPAOegQIJxAB