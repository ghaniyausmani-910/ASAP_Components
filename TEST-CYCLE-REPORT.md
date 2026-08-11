# ASAP Components — Test Cycle Report

**Date:** 2026-08-10  ·  **Branch:** `feat/cart-add-line-item`
**Scope:** First test cycle — stand up a framework and cover the conversion-critical logic
(BOM parsing, search, cart, RFQ). **Lens:** hurdles that get in the way of improving CRO
(the search → RFQ → cart → quote funnel).

---

## 1. What ran & the result

| Step | Command | Result |
|------|---------|--------|
| Unit/component suite | `npx vitest run` | ✅ **80 passed / 80** (9 files, ~2.4s) |
| Production build | `npm run build` | ✅ **55 routes generated, no errors** |
| Lint | `npm run lint` | ⛔ **Blocked — interactive prompt** (see F-2) |
| Sanity check | break `parseQty` clamp → revert | ✅ suite went red on the exact test, green after revert |

**Bottom line:** the code under test is healthy. The friction is in *tooling gaps* and, more
importantly for your goal, in *the funnel not being measurable or low-friction enough to
optimize*.

---

## 2. Issues faced during the cycle (engineering / process)

These are the concrete hurdles hit while getting a test cycle to run at all. Each one is a
reason a future automated (Cowork/CI) cycle could stall.

| # | Issue | Impact | Status / Fix |
|---|-------|--------|--------------|
| **F-1** | **No test framework existed** (0 tests, no runner). | Regressions in the funnel could ship unnoticed — nothing guards search/cart/RFQ. | ✅ Fixed — Vitest + React Testing Library + jsdom added. |
| **F-2** | **`npm run lint` is interactive** — no ESLint config, so `next lint` opens a setup prompt and hangs. | **Any headless cycle (Cowork/CI) will freeze here.** Also means lint isn't actually running today. | ⚠️ Open — see suggestion S-3. |
| **F-3** | **jsdom has no `localStorage`** in this Node 26 / Vitest 4 combo. The cart persists there, so cart tests crashed on setup. | Cart (a conversion step) was untestable out of the box. | ✅ Fixed — in-memory polyfill + per-test reset in `vitest.setup.ts`. |
| **F-4** | **Non-determinism in the RFQ success path** — the reference id is `'ASAP-' + Math.random()`. | Can't assert an exact value; more importantly it's **not a real reference number** (see C-2). | ✅ Handled in tests (regex). Product concern raised below. |
| **F-5** | **Unexpected working-tree edits from another session** — `Footer.tsx`, `quality/page.tsx`, `policies/[slug]/page.tsx`, `primitives.tsx` show as modified but were **not** part of this cycle. | Muddies the diff; risk of committing unrelated changes. | ⚠️ Flag — review/segregate before committing. |
| **F-6** | Vite config emitted an ESM/CJS warning. | Cosmetic noise. | ✅ Fixed — renamed to `vitest.config.mts`. |

---

## 3. CRO friction points surfaced by exercising the funnel

Testing forced us to walk every step of the conversion path. What the code actually does at
each step — and where it will cost conversions:

### C-1 · You cannot measure conversion at all  ⟵ highest-impact
There is **no analytics / event instrumentation anywhere** in the funnel. No event fires on
search, on "Add to cart", on RFQ submit, or on BOM upload. **CRO is impossible to improve
without a baseline** — today you can't answer "what % of searches become RFQs?" or "where do
people drop?".

### C-2 · RFQ submissions go nowhere (stubbed)
`RfqForm.submit` sets a local success state and a **random** reference id. No request is sent,
no lead is persisted, no email/CRM handoff happens. So even the leads you *do* capture in the
UI are **not actually captured**. This is the single biggest gap between "looks like it
converts" and "actually converts".

### C-3 · High field-burden on the primary conversion action
The full RFQ form requires **~10 fields** before submit: Mfg Part No, Manufacturer, Quantity,
Need Parts By, First Name, Last Name, Company Name, Phone, Email, **and** the T&C consent
checkbox. Field count is one of the most direct, well-documented drags on form conversion.

### C-4 · Search dead-ends are avoided — keep this (a win)
`searchTargetHref` routes a **miss** straight into a pre-filled RFQ (`/rfq/search?partno=…`)
instead of a "no results" page. That's a genuinely good CRO pattern — verified by test. Don't
lose it in any redesign.

### C-5 · Bulk-lead path (BOM) is robust — protect it (a win)
The BOM parser correctly handles messy real-world exports (quoted commas, embedded newlines,
alias headers, qty like `"1,000"`/`"12 ea"`, positional fallback). BOM uploads are your
**highest-value leads** (a whole bill of materials). It's solid — now guarded by tests.

### C-6 · Cart is reliable — protect it (a win)
Dedupe (incl. case-insensitive manufacturer key), quantity clamping, and localStorage
persistence all behave correctly. A cart that silently loses or double-counts items kills
multi-line RFQs; this one doesn't.

---

## 4. Suggestions (prioritized)

| Priority | Suggestion | Addresses |
|----------|------------|-----------|
| **P0** | **Add funnel instrumentation.** Fire structured events on `search submitted`, `search → RFQ redirect`, `add to cart`, `BOM uploaded`, `RFQ submitted`, with the part/qty context. Even a thin `track()` shim now unblocks every future CRO decision. | C-1 |
| **P0** | **Wire RFQ + contact submissions to a real endpoint** and persist the lead (API route → email/CRM), with a genuine server-issued reference number. | C-2, F-4 |
| **P1** | **Cut RFQ friction.** Trim/soften required fields (e.g. 2-step: part + email first, details after; make Company/Phone optional) and A/B test against the current form once C-1 exists. | C-3 |
| **P1** | **Make lint headless.** Commit an ESLint config (`.eslintrc.json` with `next/core-web-vitals`) so `next lint` stops prompting; add `test` + `lint` to a CI step. | F-2 |
| **P2** | **Add a smoke test per funnel route** (`/`, `/instant-rfq`, `/search`, `/cart`) so a broken conversion page fails the build, not production. | F-1 |
| **P2** | **Segregate the stray edits** (F-5) before committing this cycle; keep the test-only diff clean. | F-5 |

---

## 5. Coverage map & known gaps

**Covered (regression-guarded):** BOM parsing • command/⌘K search ranking + routing • header
autocomplete + search-target routing • utils (slugify, seededRand determinism) • cart context
(dedupe/clamp/persist) • RFQ form (variants, prefill, AOG, BOM mode, success/reset) • BOM
review editing • command palette (results, keyboard, routing) • add-to-cart control.

**Not covered (candidates for next cycle):** page-level components & routing (catalog
directory/listing/part-detail, home hero/quick-quote), the `/search` and `/rfq/search` route
behavior end-to-end, form → backend submission (doesn't exist yet), and any analytics (doesn't
exist yet). No end-to-end/browser tests — all current tests are unit/component (jsdom).

---

## Appendix — files added this cycle (test-only)

```
vitest.config.mts, vitest.setup.ts            # framework + jsdom polyfills
package.json                                   # + "test" / "test:watch" scripts
src/lib/rfq/__tests__/parseBom.test.ts         # 16
src/lib/data/__tests__/command-search.test.ts  # 9
src/lib/data/__tests__/suggestions.test.ts     # 12
src/lib/__tests__/utils.test.ts                # 7
src/lib/cart/__tests__/CartContext.test.tsx    # 10
src/components/rfq/__tests__/RfqForm.test.tsx           # 9
src/components/rfq/__tests__/BomReview.test.tsx         # 6
src/components/search/__tests__/CommandPalette.test.tsx # 8
src/components/cart/__tests__/AddToCartControl.test.tsx # 3
```
No application source was modified (the one temporary `parseBom.ts` mutation was reverted).
