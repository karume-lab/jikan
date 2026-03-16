**Jikan (時間) — Complete User Journey**

---

**First visit (no saved data)**

The user lands on the Jikan home screen. The logo and name sit at the top — "Jikan 時間" with a subtle tagline: "Know your time before you spend it." Two clear actions dominate the screen: a large "New estimate" button and a smaller "Import data" link beneath it for users transferring from another device. No wall of instructions. No onboarding modal. Just one clear entry point.

A persistent top navigation bar is visible on every screen after this one. It has four items: Estimates, Presets, Team, Settings. This is the global nav — the user can jump between any section at any time without losing state.

---

**Estimates screen (the library)**

This is the home screen after the first visit. The user sees all their saved estimates in a card grid.

Each estimate card shows: project name, project type badge (web / mobile / full platform), scope badge (small / medium / large), date created, date last modified, and the headline result — "~3 weeks · 0.3 PM · Solo". Cards are sorted by last modified by default.

A search bar at the top filters estimates by name in real time. A sort dropdown offers: last modified, date created, shortest estimate, longest estimate.

Each card has three action icons on hover: Open (pencil icon — loads the full wizard with all inputs restored exactly as left), Duplicate (copy icon — creates a new estimate with "Copy of [name]" and today's date, opens it immediately in the wizard), Delete (trash icon — fires a Mantine confirmation modal: "Delete [project name]? This cannot be undone.").

A "+ New estimate" button in the top right starts a fresh wizard. An "Export all estimates" button exports the full estimates array as JSON.

Empty state on first visit: a centered illustration placeholder, the text "No estimates yet", and a large "Create your first estimate" button.

---

**Wizard entry**

Clicking "New estimate" or "Open" on an existing estimate takes the user into the wizard. The top bar now shows: "← Estimates" back link on the left, the current estimate name (editable inline — clicking it turns it into a text input, blur saves it) in the center, and a "Save" button on the right. Auto-save runs in the background on every change, but the explicit Save button gives the user confidence their work is committed. A last-saved timestamp shows in muted text beside the Save button: "Saved 2s ago."

The five-step progress indicator sits below the top bar: Project → Stack → Team → Risks → Results. The active step is highlighted, completed steps show a checkmark, future steps are dimmed. The user can click any completed step to jump back to it freely.

---

**Step 1 — Project**

The user sees the project form, one logical section flowing top to bottom.

Project name input at the top — if opened from an existing estimate, it pre-fills. If new, the placeholder reads "e.g. Baykart Admin, Seiyuu v2…"

Three large cards for project type: Web app, Mobile app, Full platform. Each has a short description. One selected at a time, selected state visually distinct.

Three cards for scope: Small, Medium, Large. Same card pattern.

A scaling model toggle sits directly beneath the scope cards — "Flat additive" (default) and "COCOMO exponential" side by side. A Mantine tooltip on the info icon explains the difference in one sentence: "Flat adds fixed hours per scope level. COCOMO compounds complexity — a large project costs more than twice a medium one."

The feature list renders below as a grid of toggleable chips: Auth, Dashboard, Payments, Real-time, File storage, Email/notifs, AI features, Admin portal, SEO/perf, CI/CD + deploy. A "+ Add custom feature" button opens an inline input. When a feature chip is toggled on, it expands in place to reveal three compact number fields: Optimistic hours, Realistic hours, Pessimistic hours. Sensible defaults pre-fill each field. The live PERT result shows to the right in muted text: "≈ 9h". Toggling a feature off collapses the PERT inputs and greys the chip.

"Next: Stack →" button at the bottom.

---

**Step 2 — Stack**

The stack step has two distinct sections: Presets at the top, Tech picker below.

**Presets section:**

A horizontal row of preset cards — three built-in (HackJS, Django starter, FastAPI starter) followed by any user-saved presets. Each card shows the preset name and its top 4 technologies listed as small badges, with "and X more" if longer. Built-in presets have a subtle "built-in" label. User presets have an edit icon and a delete icon.

Clicking any preset card fires a Mantine confirmation modal if technologies are already selected: "Load [preset name]? This will replace your current stack selection." On confirm, the tech picker below updates to reflect all technologies in that preset, with their familiarity settings. The user can freely edit after loading.

A "Save current stack as preset" button at the end of the preset row opens a Mantine modal with a single name input. On save, the new preset appears immediately in the row. This is a create operation.

**Preset CRUD:**

Edit — clicking the edit icon on a user preset opens a Mantine modal showing the preset name (editable) and a full list of its technologies with their familiarity toggles. The user can rename, add technologies, remove technologies, or flip familiarity settings. Save commits the changes. Built-in presets cannot be edited but can be duplicated — a "Duplicate" option appears on their cards, creating an editable copy.

Delete — clicking the delete icon fires a Mantine confirmation modal. Built-in presets have no delete icon.

Export — a small "Export presets" button above the preset row downloads all user presets as JSON. An "Import presets" button beside it accepts a JSON file and merges incoming presets with existing ones, skipping duplicates by name.

**Tech picker section:**

Six collapsible category sections: Frontend, Backend, Database / ORM, Auth, Infrastructure, Other. Each section has a header with a collapse toggle and a count badge showing how many techs in that category are selected.

Each technology is a toggleable chip. When selected, a small inline familiarity pill appears attached to the chip — "Know it" / "Learning" — defaulting to "Know it". The chip + pill together form a compact single unit. The user can select many technologies and flip familiarity without leaving the flow.

A "+ Add custom tech" button at the bottom of the picker opens a Mantine modal: tech name, category dropdown. On save, the custom tech appears in its category section with a user badge and a delete icon. Custom techs persist in localStorage and are available across all estimates.

A summary line at the bottom of the step updates live: "14 technologies selected · 3 marked learning." Familiarity penalty reads as a percentage beside it: "Familiarity penalty: ~12%."

"← Back" and "Next: Team →" at the bottom.

---

**Step 3 — Team**

The team step has two sections: Team presets at the top, Team member list below.

**Team presets section:**

A horizontal row of saved team presets — same card pattern as stack presets. Each card shows the preset name, number of members, and role badges. A "Save current team as preset" button. Built-in presets: none — team presets are entirely user-created.

**Team preset CRUD:**

Create — "Save current team as preset" button, name input modal, saves immediately.

Edit — clicking the edit icon on a preset opens a modal showing all members with their fields editable. Rename, add members, remove members, change roles or seniority, flip AI toggles. Save commits.

Delete — confirmation modal before delete.

Export / Import — "Export team presets" and "Import team presets" buttons above the row. Same JSON merge pattern as stack presets.

**Team member list:**

The first card is always "You (Lead)" — not deletable, but all fields are editable: role dropdown, seniority (pre-set to Lead), hours per day slider (default 7), AI toggle (default on).

Each additional member card shows: name input, role dropdown (Frontend / Backend / Mobile / DevOps / Fullstack), seniority dropdown (Junior / Mid / Senior / Lead), hours per day slider, AI toggle, and a delete icon. Cards can be reordered by drag — not critical but a nice touch using a simple drag handle.

An "+ Add team member" button below the list adds a blank card.

A live team summary panel sits to the right (or below on smaller screens) and updates in real time as the team changes:

- Effective team size: "3.2 effective devs from 4 people"
- Total capacity: "22.4 effective hours/day"
- Brooks' Law: "6 communication channels · +24% coordination overhead"
- Junior count: "2 juniors · +16h ramp-up cost · ~44% mentorship load on lead"

Role overlap warnings appear as Mantine amber notification banners beneath the summary: "You and Alex both own Backend — this may create decision overhead." One banner per overlapping role pair. Dismissible but reappears if the overlap persists on next visit.

"← Back" and "Next: Risks →" at the bottom.

---

**Step 4 — Risks**

The risks step has three preset category sections and a custom risks section.

**Preset risk categories:**

Three cards, each collapsible: Integration risks, Technical risks, External risks. Each card has a header showing category name, description, and a live total: "Integration risks · ~12h expected."

Expanding a category reveals a list of individual risk items. Each risk item has: a label, an enabled/disabled toggle, a probability slider (0–100% with a live percentage readout), and three impact buttons — Low (8h), Medium (20h), High (40h). A "Custom" link beside the impact buttons expands an inline number input for a raw hour override. The expected hours for that item show live to the right: "~6h" in muted text.

Built-in risk items within each category:

Integration: Third-party API integration, Payment gateway, OAuth provider, External webhook, Real-time service.

Technical: Unfamiliar framework, Performance requirements, Complex data model, Mobile platform quirks, Monorepo setup.

External: Vague requirements, Client feedback delays, Scope drift, Late design changes, Third-party approval delays.

**Risk item CRUD within presets:**

The user can add custom items to any preset category — a small "+ Add risk to this category" link at the bottom of each expanded category. This opens an inline form: risk label, probability, impact. On save it appears in that category. User-added items within preset categories have a delete icon. Built-in items cannot be deleted but can be disabled via their toggle.

**Custom risks section:**

A separate "Custom risks" section below the three preset categories. Empty by default with a muted "No custom risks yet" state. A "+ Add custom risk" button opens a Mantine modal: risk name, category dropdown (Integration / Technical / External / Other), probability slider, impact selector + custom override. On save, the custom risk appears as a card in this section.

Custom risk CRUD: each card has an edit icon (reopens the modal pre-filled) and a delete icon (confirmation modal). Full edit of all fields.

**AI discount note:**

A contextual note at the top of the step in muted small text: "AI enabled for [lead name] — integration and technical risk hours reduced by 25%." Visible only when the lead has AI toggled on in Step 3.

**Running total:**

A sticky footer bar at the bottom of the risks step (above the navigation buttons) shows: "Total risk exposure: ~34h across 8 active risks." Updates live as the user enables/disables risks or adjusts probability and impact.

"← Back" and "Next: Results →" at the bottom.

---

**Step 5 — Results**

The results screen renders immediately. All calculations happen client-side in milliseconds. No loading state — the numbers are just there.

Two tabs at the top: Simple (default) and Detailed.

**Simple tab:**

Four metric cards in a row:

- Total effort: "108h · 0.68 PM"
- Calendar time: "2–4 weeks"
- Effective team: "1.15 devs"
- Scaling model: "COCOMO exponential"

Below the metrics: a "Key assumptions" block in plain prose — four to six sentences summarising the most important factors in plain language. "This estimate assumes you are working solo at 7 hours per day with AI assistance. Auth and Dashboard account for ~22h of core feature work. HackJS template savings of ~12h have been applied. Buffer of 15% applied — stack is mostly familiar. Total risk exposure is ~18h across 4 active risks." This section is copyable as plain text — a small copy icon sits in its top-right corner.

**Detailed tab:**

The full formula chain rendered as a structured breakdown, step by step:

```
Feature hours (PERT-weighted)
  Auth             ≈  8h   (O:5  R:8  P:14)
  Dashboard        ≈ 14h   (O:10 R:14 P:20)
  Payments         ≈ 22h   (O:16 R:22 P:30)
  ──────────────────────────────────────────
  Feature subtotal   44h

Base hours
  Type: web app                              20h
  Scope: medium (COCOMO ×1.15)              +69h
  ──────────────────────────────────────────
  Base subtotal                              89h

Adjustments
  Familiarity penalty (3 learning techs)    +11h
  Template savings (HackJS)                 −12h   [internal]
  AI multiplier (lead, AI on: ×1.15)        −14h
  Brooks' Law (1 person, 0 channels ×1.00)   +0h
  Junior ramp-up (0 juniors)                 +0h
  Mentorship tax (0 juniors)                 +0h
  Risk hours (AI-discounted)                +18h
  ──────────────────────────────────────────
  Adjusted subtotal                         92h

Buffer
  Tier: 15% (known stack)                  +14h
  ──────────────────────────────────────────
  Total effort                             106h
  Person-months                           0.66 PM
  Calendar weeks (@ 7h/day solo)         2.1–3.8 weeks
```

Each line has a small info icon that opens a Mantine tooltip explaining that line in one sentence.

A muted note below the chain: "Template savings are internal and are not included in the client export."

**PDF export:**

A prominent "Export for client" button sits at the bottom of both tabs. Clicking it opens a Mantine modal with two pre-filled fields: Project name (from Step 1) and Your name (defaults to "Daniel Karume" — stored in Settings, editable here). A "Generate PDF" button triggers html2canvas + jsPDF.

The PDF renders as a clean, professional document:

- Header: project name, "Prepared by [name]", date
- A short one-paragraph project summary
- Three columns: Lean MVP / Standard build / Full-featured
- Each column: included features as a bullet list, calendar week range, "Not included" as a short bullet list
- Footer: "This estimate is based on defined scope. Changes to scope may affect timeline."
- No hours, no person-months, no formulas, no stack names, no template references, no multipliers

---

**Presets screen (global nav)**

Accessible from the top nav at any time. Two tabs: Stack presets and Team presets.

**Stack presets tab:**

A grid of all saved stack presets — both built-in and user-created. Each card shows preset name, technology count, and a scrollable list of tech badges.

Built-in preset cards: Load button, Duplicate button. No edit, no delete.

User preset cards: Load button, Edit button (opens a full edit modal — rename, add/remove technologies, flip familiarity settings), Duplicate button, Delete button (confirmation modal), Export button (downloads this single preset as JSON).

A "+ New preset" button at the top right opens a blank preset creation modal — name input, then a full tech picker identical to the one in Step 2. On save, the preset appears in the grid.

An "Export all presets" button and an "Import presets" button at the top of the tab. Import merges, skipping name conflicts with a prompt: "[Preset name] already exists. Overwrite or keep both?"

**Team presets tab:**

Same grid pattern. Each card shows preset name, member count, and role badges.

User preset cards: Load (applies to current estimate's team step), Edit (modal showing all members with full field editing), Duplicate, Delete, Export.

A "+ New team preset" button opens a team builder modal — add members with all their fields, name the preset, save. Appears immediately in the grid.

Export all / Import all with same merge pattern.

---

**Settings screen (global nav)**

A clean settings page with four sections:

**Profile** — Your name (used as default in PDF exports), editable text input. Saved to localStorage.

**Data management** —

- Export all data: downloads the entire localStorage as a single JSON file — estimates, presets, settings, custom techs, all of it
- Import data: accepts a JSON file, shows a summary of what will be imported ("4 estimates, 3 stack presets, 2 team presets"), confirmation modal before applying
- Export estimates only: just the estimates array as JSON
- Import estimates: merges, handles name conflicts with a prompt
- Clear all data: red button, Mantine confirmation modal with strong language — "This will permanently delete all your estimates, presets, custom technologies, and settings. This cannot be undone." Two buttons: "Cancel" and "Yes, delete everything."

**Appearance** — Light / Dark / System toggle. Persisted in localStorage.

**Defaults** — Set default hours per day (used as pre-fill in Step 3), default scaling model (flat or COCOMO), default buffer tier. These feed into every new estimate as starting values, saving repetitive input.

---

**Return visit (data restored)**

The user lands directly on the Estimates screen. Their saved estimates are all there, restored from localStorage. The last modified estimate is highlighted subtly at the top. The global nav shows their preset counts as small badges — "Presets (5)" — so they know their data is intact at a glance. Everything is exactly as they left it.
