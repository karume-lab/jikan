# Jikan — Implementation Strategy

---

## Guiding principles

Build from the outside in. UI shell first, then pages, then wizard steps, then logic. At every stage the app should be runnable and navigable — no dead screens, no broken routes. Logic layers are added incrementally behind already-working UI. This means you can show progress at any point and catch UX problems before they get buried under business logic.

Never block on completeness. If a component needs data that isn't wired up yet, use realistic mock data. Mocks get replaced when the real store or hook is ready. The component itself never changes — only its data source does.

---

## Phase 1 — Foundation

**Goal:** app boots, navigation works, all routes resolve, global shell is in place.

### 1.1 — Router and app shell

Set up `react-router-dom` with four top-level routes: `/` (Home), `/estimates` (Estimates library), `/presets` (Presets screen), `/settings` (Settings). Each route renders a placeholder page component — just a heading and a sentence describing what goes there. No content yet.

`AppShell.tsx` wraps every route. It renders the `NavBar` at the top and the page content below. NavBar has four links: Estimates, Presets, Team (links to Presets with team tab active), Settings. Active link is highlighted. Preset count badges are hardcoded to 0 for now.

Confirm: app loads, all four nav links work, no console errors.

### 1.2 — Global styles and theme

Apply the Mantine theme from `theme.ts` — primary colour `#506e99`, Wix fonts, default radius. Verify the colour ramp renders correctly in both light and dark mode. Set up the Mantine `ModalsProvider` and `Notifications` at the root level in `App.tsx`.

Add `global.css` base styles: font smoothing, scroll behaviour, any Tailwind base overrides that conflict with Mantine.

Confirm: theme is applied, Mantine components render with correct colours, dark mode toggle in Settings works.

### 1.3 — Store scaffolding

Implement all four stores with empty state and no-op actions. Each store reads from and writes to localStorage on every change using `useLocalStorage`. No business logic yet — just the shape.

```
useEstimatesStore     → estimates: Estimate[], activeEstimateId: string | null
useStackPresetsStore  → presets: StackPreset[]
useTeamPresetsStore   → presets: TeamPreset[]
useSettingsStore      → profile, defaults, appearance
```

Confirm: stores initialise without errors, localStorage keys are created on first run, state survives a page refresh.

---

## Phase 2 — Estimates library

**Goal:** the Estimates screen is fully functional — CRUD, search, sort, empty state.

### 2.1 — Home screen

Build the landing screen for first-time visitors. Logo, tagline, two actions: "New estimate" and "Import data." Import data is a disabled button for now with a tooltip: "Coming in Phase 6." New estimate navigates to `/estimates/new`.

### 2.2 — Estimates screen

Build the estimates library with mock data — hardcode three `EstimateSummary` objects matching the real type shape. Render them as `EstimateCard` components.

`EstimateCard` renders: project name, type badge, scope badge, primary model used, date modified, and the headline result. Three hover actions: Open (navigates to `/estimates/:id`), Duplicate (no-op for now, shows a Mantine notification "Coming soon"), Delete (fires `ConfirmModal`, removes from mock data).

Search bar filters the mock estimates by name in real time — pure client-side filter, no store interaction yet.

Sort dropdown: last modified, date created, shortest, longest. Sorts the displayed list only.

Empty state: renders `EstimateEmptyState` when the filtered list is empty.

### 2.3 — Wire estimates store to estimates screen

Replace mock data with `useEstimatesStore`. Implement the real actions:

```
createEstimate(name, projectType, scopeSize) → Estimate
duplicateEstimate(id) → Estimate
deleteEstimate(id) → void
getEstimateSummaries() → EstimateSummary[]
```

New estimate flow: clicking "New estimate" calls `createEstimate` with defaults, gets back an `id`, navigates to `/estimates/:id/step/1`.

Confirm: creating, duplicating, and deleting estimates persists across page refreshes. Search and sort work against real data.

---

## Phase 3 — Wizard shell

**Goal:** the wizard renders, step navigation works, progress indicator is correct, state persists per estimate.

### 3.1 — Wizard shell component

`WizardShell.tsx` renders:
- Top bar: "← Estimates" back link, estimate name (editable inline — `onBlur` saves to store), Save button, "Saved Xs ago" timestamp
- Seven-step progress indicator: Project, Stack, Team, Risks, Model, Comparison, Results — active step highlighted, completed steps show checkmark and are clickable, future steps dimmed
- Step content area: renders the active step component
- Bottom navigation: "← Back" and "Next →" buttons, disabled appropriately at first and last steps

Active step is tracked in URL: `/estimates/:id/step/:stepNumber`. Navigating back and forward updates the URL. Deep-linking to a step works — navigating directly to `/estimates/:id/step/3` renders the team step.

Each step component receives the current estimate from the store via `useEstimatesStore`. Each step dispatches updates to the store on every input change — auto-save fires on every change.

Render placeholder content in each of the seven step slots — a heading and a "Step X — coming soon" message. Confirm: wizard loads, all seven steps navigate correctly, back/next works, breadcrumb is correct, estimate name is editable.

### 3.2 — Wizard step routing

Wire up the step components to their routes. Each step is a lazy-loaded component. Step navigation validates: if a required field is empty (e.g. project name in Step 1), the Next button shows a Mantine notification instead of navigating. Validation rules per step:

- Step 1: project name not empty, at least one feature enabled
- Step 2: at least one technology selected
- Step 3: at least one team member (you are always there — this always passes)
- Step 4: no required fields — risks are optional
- Step 5: model selected, model-specific required fields complete
- Step 6: primary model selected
- Step 7: no required fields — results always render

---

## Phase 4 — Wizard steps (UI only, mock data)

Build each step as a fully interactive UI component. All inputs are controlled and update local component state. Store wiring comes in Phase 5. This separation lets you get the full UX right before introducing state management complexity.

### 4.1 — Step 1: Project

Project name input. Three project type cards — selecting one highlights it, deselects others. Three scope cards — same pattern. Feature chip grid using `FeatureChip.tsx`.

`FeatureChip.tsx`: a toggleable chip. When enabled, it expands with a smooth height transition to reveal the input area. The input area content is a slot — it renders whatever the active model requires (PERT fields, t-shirt buttons, story point selector). For now render `PERTInput` as the default.

`PERTInput.tsx`: three number inputs (optimistic, realistic, pessimistic) in a compact row. Live PERT result shown to the right: computed from `(O + 4R + P) / 6`, rounded to one decimal, updates on every keystroke. Inputs validate: optimistic ≤ realistic ≤ pessimistic — amber warning shown if violated, not a hard block.

Custom feature entry: a small "+ Add feature" button at the end of the chip list. Clicking it reveals an inline text input and a confirm button. On confirm, a new chip appears at the end of the list, pre-expanded.

### 4.2 — Step 2: Stack

**Preset row:**

Three built-in preset cards rendered horizontally with scroll on overflow. Each card: preset name, key tech badges (max 4 shown, "+ X more" if longer), Load button. Clicking Load fires a `ConfirmModal` if technologies are already selected.

"Save current stack as preset" button at the end of the row opens `SavePresetModal` — a single name input with save and cancel.

User presets render after built-ins with edit and delete icons. Edit opens `EditPresetModal` — preset name input at top, then the full tech picker with current selections shown. Delete fires `ConfirmModal`.

**Tech picker:**

Six collapsible sections using Mantine `Accordion`. Each section header: category label, collapse icon, selected count badge. Each section body: a flex-wrap grid of `TechChip` components.

`TechChip.tsx`: a chip with the tech name. When selected, a small inline pill appears beside it — "Know it" in green, "Learning" in amber — clicking the pill toggles familiarity. Deselecting the chip removes the familiarity pill.

Custom tech entry at the bottom: "+ Add custom tech" opens a small modal with name and category dropdown. On save, the tech appears in its category section with a user badge and a delete icon.

Summary line at the bottom: live count of selected techs and learning count. Familiarity penalty percentage shown.

### 4.3 — Step 3: Team

**Team preset row:** same card pattern as stack presets. No built-ins. "Save current team as preset" button.

**Member list:**

"You (Lead)" card always first, not deletable. Role dropdown (Mantine `Select`), seniority dropdown pre-set to Lead, hours per day slider (2–12, default 7, step 1), AI toggle (Mantine `Switch`).

Additional member cards: same fields plus name input and delete icon. Cards have a drag handle icon on the left — drag-to-reorder implemented with a simple index swap on drag end (no heavy library needed).

"+ Add team member" button adds a new blank card with generated default name "Team member X."

**Live summary panel:**

Renders to the right of the member list on larger screens, below on smaller screens. Four metrics updated live from local component state: effective team size, total capacity per day, Brooks' Law channels and overhead percentage, junior count with ramp-up cost and mentorship load.

Role overlap warning: computed from the current member list. An amber Mantine `Alert` appears for each overlapping role pair. Dismissible per session.

### 4.4 — Step 4: Risks

**AI discount note:** rendered conditionally based on lead's AI toggle from Step 3. Uses mock data for now.

**Three preset category cards:**

Each is a Mantine `Accordion` item. Header: category name, description, live expected hours total. Body: list of risk items.

`RiskItem.tsx`: label, enabled toggle (Mantine `Switch`), probability slider (Mantine `Slider`, 0–100, step 5, with percentage label), three impact buttons (Low / Medium / High as a Mantine `SegmentedControl`), custom hours link that expands an inline number input, live expected hours display.

"+ Add risk to this category" link at the bottom of each expanded category — inline form: label input, probability, impact. On save, item appears in the category with a delete icon.

**Custom risks section:**

"+ Add custom risk" button opens `CustomRiskModal` — name, category dropdown, probability slider, impact selector with custom override. On save, card appears with edit and delete icons.

**Running total footer:** sticky above the navigation buttons. Total expected hours and active risk count, updated live.

### 4.5 — Step 5: Model

**Model selector:**

Six model cards in a 2×3 grid. Each card: model name, short description, best-for tag, confidence indicator badge (`ModelConfidenceBadge`). Confidence is hardcoded to green for all models for now. Selecting a card highlights it and reveals the model configuration section below with a smooth expand animation.

A contextual note: "All six models run in parallel. Compare them in the next step."

**PERT + Flat config:** PERT inputs per feature (pre-populated from Step 1). No additional configuration. ScalingToggle shown for informational purposes — flat is pre-selected.

**PERT + COCOMO II config:** PERT inputs per feature. Below them, five `ScaleFactorCard` components. Each card: factor name, description, Jikan-specific example in muted text, six-option selector rendered as a Mantine `SegmentedControl`. Live exponent display: "Exponent b = 1.14" updated as factors change.

**FPA config:** five `FunctionTypeSection` components. Each section: type name, description, "+ Add item" button, list of `FPItem` components each with a name input and complexity `SegmentedControl`. Raw FP total shown per section. Below the sections: 14 GSC sliders in a compact 2-column grid. Adjusted FP and productivity rate shown live. `FpaMappingAssistant` renders as a collapsible section above the function types — shows suggested FP items derived from Step 1 features, each clickable to add.

**UCP config:** `UseCaseList` and `ActorList` side by side. Each list has an "+ Add" button and items with name inputs and complexity/type selectors. Auto-suggested items appear with a "suggested" badge. Below: TCF sliders (13 factors) and ECF sliders (8 factors) in compact grids, each with auto-suggested values shown in muted text. Live UCP calculation displayed.

**Story Points config:** velocity configuration at top — points per sprint number input, sprint length selector. No-velocity warning appears when points per sprint is empty. Reference story picker dropdown. Feature point selectors using Fibonacci scale buttons. Planning poker toggle appears when team has 2+ members — enabling it replaces point selectors with the poker session UI per feature.

`PlanningPokerSession.tsx`: per feature, each team member has their own row with a Fibonacci card selector. Cards face-down until the Reveal button is pressed. After reveal, all values show simultaneously. Outliers highlighted in amber. Consensus input appears post-reveal for the lead to record the agreed value.

**T-Shirt config:** feature list with XS/S/M/L/XL button group per feature. Size legend below. Rough estimate note at top.

### 4.6 — Step 6: Comparison

`ComparisonTable.tsx`: a horizontally scrollable table if needed. Each of the six models is a `ComparisonColumn`. All values are mock data for now — realistic numbers that make sense given a medium web project.

`ComparisonColumn.tsx`: model name as header, confidence badge, four metric rows (total hours, person-months, weeks low, weeks high), any model warnings in amber text, primary model radio button at the bottom, reference model checkbox below the radio.

`DivergenceExplainer.tsx`: a collapsible "Why are these different?" section below the table. Mock explanations for 2–3 model pairs. Expandable with a chevron.

`UpgradePrompt.tsx`: rendered conditionally when T-shirt sizing is primary or a reference — a teal info banner with a "Upgrade to PERT + Flat" button.

### 4.7 — Step 7: Results

Two tabs using Mantine `Tabs`: Simple (default) and Detailed.

**Simple tab:** four `MetricCard` components in a row. Key assumptions block — mock prose for now. Reference model pills row — one `ReferenceModelPill` per selected reference model, each showing model name and week range.

**Detailed tab:** formula chain rendered as a list of `FormulaLine` components. Each line: label, value, unit, operation indicator (base / +add / −subtract / ×multiply), Mantine `Tooltip` on an info icon. Internal lines (template savings) shown with a "[internal]" label in muted text. Reference model chains in a collapsed `Accordion` section below.

**PDF export button:** "Export for client" button at the bottom of both tabs. Clicking opens `PdfExportModal` — two pre-filled inputs (project name, your name), Generate PDF button that calls the PDF library. For now the button shows a "Coming in Phase 6" notification.

---

## Phase 5 — Logic layer

**Goal:** all wizard inputs are wired to stores, formula chain runs on real data, results are accurate.

### 5.1 — Estimate store wiring per step

Wire each step component to `useEstimatesStore`. Each input dispatches a granular update action — never replace the whole estimate object, update only the changed field. This keeps re-renders minimal and auto-save efficient.

```
updateProjectName(id, name)
updateProjectType(id, type)
updateScopeSize(id, scope)
toggleFeature(id, featureId)
updateFeaturePERT(id, featureId, pert)
updateFeatureTShirt(id, featureId, size)
updateFeatureStoryPoints(id, featureId, points)
updateSelectedTechnologies(id, technologies)
updateTeam(id, members)
updateRisks(id, risks)
updateModelConfig(id, modelConfig)
updateComparisonSelection(id, selection)
```

All actions call `storage.save(estimate)` after every update. `updatedAt` is stamped on every write.

### 5.2 — Implement lib/estimation/

Implement the formula chain files in dependency order — each file is pure functions with no React, fully unit-testable:

**`pert.ts`** first — it's used by every other model:
```typescript
pertWeightedHours(o, r, p): number       // (O + 4R + P) / 6
pertStdDev(o, p): number                 // (P - O) / 6
confidenceInterval(e, sigma, z): [number, number]  // e ± z×sigma
```

**`adjustments.ts`** second — used by every model after the base calculation:
```typescript
familiarityPenalty(technologies): number
aiMultiplier(member): number
brooksLawOverhead(memberCount): number
rampUpCost(members): number
mentorshipTax(members, leadHoursPerDay): number
effectiveCapacityPerDay(members): number
```

**`risks.ts`** third:
```typescript
expectedRiskHours(risk, leadAIEnabled): number
totalRiskHours(risks, leadAIEnabled): number
```

**`buffer.ts`** fourth:
```typescript
bufferTier(familiarityPenaltyPercent): 0.15 | 0.30 | 0.45
applyBuffer(hours, tier): number
```

Then the model-specific files:

**`flat.ts`:**
```typescript
scopeBlock(scope): number                // small=20, medium=60, large=130
flatTotal(features, scope): number
```

**`cocomo.ts`:**
```typescript
calculateExponent(scaleFactors): number  // 1.01 + Σ weights
normalizedSize(features, scope): number
cocomoEffort(size, exponent): number
```

**`fpa.ts`:**
```typescript
rawFunctionPoints(items): number
gscAdjustment(gscs): number             // 0.65 + 0.01 × Σ GSCs
adjustedFP(rawFP, gscAdj): number
fpaEffort(adjustedFP, productivityRate): number
```

**`ucp.ts`:**
```typescript
uucw(useCases): number                  // Σ(use case weights)
uaw(actors): number                     // Σ(actor weights)
tcf(tcFactors): number                  // 0.6 + 0.01 × weighted sum
ecf(ecFactors): number                  // 1.4 + (-0.03 × weighted sum)
ucpEffort(uucp, tcf, ecf, hoursPerUCP): number
```

**`storypoints.ts`:**
```typescript
totalPoints(features): number
sprintsNeeded(points, velocity): number
calendarWeeks(sprints, sprintLengthDays): number
sensitivityAnalysis(points, sprintLength): SensitivityPoint[]
```

**`tshirt.ts`:**
```typescript
tshirtHours(features): number           // Σ(size midpoints)
```

**`index.ts`** — the orchestrator. Takes a full `Estimate` object, applies every adjustment in the correct order, returns a `ModelResult`:

```typescript
runModel(estimate, model): ModelResult
buildFormulaSteps(intermediate_values): FormulaStep[]
toPersonMonths(hours): number
toCalendarWeeks(hours, effectiveCapacityPerDay): [number, number]
```

**`comparison.ts`:**
```typescript
runAllModels(estimate): ComparisonResult
explainDivergence(resultA, resultB): DivergenceExplanation
confidenceScore(estimate, model): ConfidenceLevel
```

### 5.3 — Implement useEstimation and useComparison hooks

```typescript
// useEstimation.ts
const { result, formulaSteps, isValid } = useEstimation(estimate, model)

// useComparison.ts
const { results, divergenceExplanations } = useComparison(estimate)
```

Both hooks are pure wrappers around the lib functions. They memoize on estimate inputs — the formula chain only re-runs when the estimate changes. No side effects.

### 5.4 — Wire results to Steps 6 and 7

Replace mock data in `StepComparison` with `useComparison(estimate)`. Replace mock data in `StepResults` with `useEstimation(estimate, primaryModel)`.

Confidence indicators are now real — `ModelConfidenceBadge` reads from `ModelResult.confidence`. Warnings are real. Formula steps in `DetailedView` are real. All numbers are live.

### 5.5 — Model-specific auto-suggestions

Implement the auto-suggestion logic that makes Steps 5 smarter:

UCP: when Step 5 loads with UCP selected, derive suggested use cases from Step 1 features. Each feature maps to one or more use cases. Auth → "User registration" (average), "User login" (simple), "Password reset" (simple). Dashboard → "View dashboard" (complex). Payments → "Initiate payment" (complex), "View payment history" (average). Suggestions appear with an "auto-suggested" badge — the user clicks to accept or ignores them.

FPA: similar mapping. Auth → External Input (user registration form, average), External Query (login lookup, simple), ILF (users table, average). Suggestions appear in `FpaMappingAssistant`.

COCOMO scale factors: auto-suggest values from existing inputs. Stack familiarity informs Precedentedness — many "learning it" techs → Low. Team cohesion from team preset usage — saved team = High. Process maturity from CI/CD feature — if CI/CD is enabled → High. These are suggestions, never overrides.

UCP TCF/ECF: auto-suggest from stack and team. Real-time service selected → Concurrency = High. Multiple "learning it" techs → Familiarity with process = Low. Junior team members → Motivation slider initialized lower.

---

## Phase 6 — Data management and PDF

**Goal:** export/import works, PDF generates correctly, clear data works.

### 6.1 — Export and import

Implement `lib/exportImport.ts`:

```typescript
exportAllData(): string          // JSON.stringify of full localStorage state
exportEstimates(): string
exportStackPresets(): string
exportTeamPresets(): string

importAllData(json, strategy): ImportResult
importEstimates(json, strategy): ImportResult
importStackPresets(json, strategy): ImportResult
importTeamPresets(json, strategy): ImportResult

type ImportStrategy = "merge" | "overwrite" | "skip_conflicts"
type ImportResult = { imported: number, skipped: number, conflicts: string[] }
```

`JsonDropzone.tsx` in the Settings screen uses Mantine `Dropzone` to accept JSON files. On file drop, the JSON is parsed, a summary modal shows what will be imported, the user confirms, and the import function runs.

Conflict resolution modal: when imported data has a name conflict with existing data, a Mantine modal lists the conflicts with three options per conflict — Overwrite, Keep existing, Keep both (renames incoming as "Copy of X").

### 6.2 — PDF generation

Implement `lib/pdf.ts` using html2canvas + jsPDF.

The PDF is generated from a hidden off-screen React component `PdfDocument` — a clean, styled HTML layout that renders the three-tier estimate. This component is mounted imperceptibly, captured with html2canvas, and passed to jsPDF.

`PdfDocument` renders:
- Header: project name (bold, large), "Prepared by [name]" and date (muted, small)
- Three-column tier layout: Lean MVP / Standard build / Full-featured
- Each column: tier name as header, feature list as bullets, calendar week range as a prominent number, "Not included" as a smaller bullet list
- Reference estimates section below the three columns: a simple table — model name, week range, confidence. Header: "Alternative estimates for reference."
- Footer: disclaimer text

Tier derivation logic:
- Lean MVP: features marked as core (auth + the two highest-PERT-value features the user has enabled)
- Standard: all enabled features
- Full-featured: all enabled features plus all disabled features from the built-in list

Week ranges per tier: lean uses the P10 confidence interval (optimistic scenario), standard uses the P50 (expected), full-featured uses the P90 (pessimistic scenario). These come directly from the PERT standard deviation calculation already in the formula chain.

### 6.3 — Clear all data

Settings screen "Clear all data" button fires a Mantine modal with strong warning text. On confirm, call a `clearAllData()` function that wipes all localStorage keys owned by Jikan, resets all four stores to empty state, and navigates to the Home screen.

---

## Phase 7 — Presets and Settings screens

**Goal:** Presets screen and Settings screen are fully functional with CRUD.

### 7.1 — Presets screen

Two tabs: Stack presets and Team presets.

**Stack presets tab:** renders all presets in a responsive card grid. Built-in presets: Load and Duplicate. User presets: Load, Edit, Duplicate, Delete, Export single. "+ New preset" button opens a creation modal with the full `TechPicker` component embedded. "Export all" and "Import" buttons at the top.

Edit modal (`EditPresetModal`): preset name input, full `TechPicker` with current selections loaded. Save commits to `useStackPresetsStore`. This reuses the same `TechPicker` component from Step 2 — the component is data-agnostic, it just receives a selection array and an onChange callback.

**Team presets tab:** same grid. "+ New team preset" opens a modal with the `TeamMemberCard` list embedded — add members, assign roles, save. Reuses `TeamMemberCard` from Step 3.

### 7.2 — Settings screen

Profile section: your name text input, auto-saved on blur to `useSettingsStore`.

Defaults section: default hours per day (slider), default scaling model (radio cards), default sprint length (select), default buffer tier (radio). These values are read by the wizard when creating a new estimate to pre-fill sensible starting values.

Appearance section: light/dark/system toggle using Mantine `SegmentedControl`. Updates `useSettingsStore.appearance`, which the `MantineProvider` reads to set `colorScheme`.

Data management section: six buttons as described. Each destructive action (clear all, overwrite import) fires a Mantine confirmation modal.

---

## Phase 8 — Polish and edge cases

**Goal:** the app handles every edge case gracefully, feels polished, is production-ready.

### 8.1 — Validation and error states

Every wizard step validates its required fields before allowing Next. Validation errors are shown inline — not as a blocking modal, as red helper text below the offending field plus a Mantine notification summarising what's missing.

Empty states: every list that can be empty (no features enabled, no team members beyond lead, no risks, no presets) has a proper `EmptyState` component — not a blank space.

Loading states: localStorage restore on page load should be instant since it's synchronous, but add a brief initialisation guard that prevents the app from rendering until stores are hydrated. This prevents a flash of empty state on return visits.

### 8.2 — Responsive layout

The wizard is designed for desktop (1024px+) but needs to be usable on tablet (768px+). The team summary panel stacks below the member list on narrow screens. The comparison table scrolls horizontally. The three-tier results layout stacks vertically on mobile. The PDF export is desktop-only — a note tells mobile users to open on desktop for PDF generation.

### 8.3 — Keyboard navigation and accessibility

All interactive elements are keyboard accessible. Mantine handles this for its own components. Custom components (feature chips, model cards, tech chips) need explicit `tabIndex`, `onKeyDown` Enter/Space handlers, and `aria-` labels. The wizard step indicator is a `nav` element with `aria-label="Estimate steps"`.

### 8.4 — Performance

Feature chips with PERT inputs re-render on every keystroke. Memoize `FeatureChip` with `React.memo`. PERT result calculation in `PERTInput` is wrapped in `useMemo`. The comparison step runs all six models — memoize `useComparison` on the estimate object with deep equality check so it only recalculates when inputs actually change, not on every render.

localStorage writes are debounced by 300ms — rapid input changes (slider dragging, typing) don't hammer localStorage on every keystroke.

### 8.5 — Final integration pass

Walk through the complete user journey from first visit to PDF export as a fresh user. Verify: estimates persist across refreshes, presets load correctly into the wizard, the comparison table shows meaningful numbers, the PDF renders cleanly, clear all data resets everything. Fix any wiring gaps found during this pass.

---

## Build order summary

```
Phase 1   Foundation          Router, shell, theme, store scaffolding
Phase 2   Estimates library   CRUD, search, sort, empty state
Phase 3   Wizard shell        Navigation, step routing, auto-save
Phase 4   Wizard steps UI     All 7 steps, fully interactive, mock data
Phase 5   Logic layer         Formula chain, store wiring, real results
Phase 6   Data + PDF          Export/import, PDF generation, clear data
Phase 7   Presets + Settings  Presets CRUD, settings persistence
Phase 8   Polish              Validation, responsive, a11y, performance
```
