# RFQ Cart — Functional Handoff Prompt

> **How to use this document.** Paste it as the brief for implementing the cart on another site. It specifies **behaviour, state, and data contracts only** — every class name, colour, border, and font here is illustrative. Keep the target site's own design language for all visual decisions. Where a visual choice carries *functional* weight (e.g. the control must swap in place, the dropdown must escape a clipping ancestor), that is called out as **[functional]** and must be preserved even though its styling is yours.

---

## 1. What this feature actually is

This is **not an e-commerce cart**. There is no price, no stock count, no checkout, no payment. It is a **quote-request basket ("RFQ cart")**:

- The user collects part numbers while browsing.
- Each line carries a **quantity** they want quoted.
- On submit, the whole basket becomes **one Request For Quote** with a single set of contact details.
- The cart is then **emptied** and a reference number is shown.

Design consequence: the mental model is "a list I'm building for someone to price", not "items I'm buying". Nothing in the UI should promise a price, a total cost, or a payment step.

---

## 2. Architecture at a glance

```
Root layout
└── CartProvider ...................... React Context + localStorage persistence
    ├── Header → CartButton .......... icon + live count badge, links to /cart
    ├── Any parts table → AddToCartControl ... per-row add / quantity
    └── /cart → CartView
        ├── committed line rows (QtyStepper, remove)
        ├── DraftLineRow ............. inline "add a part by hand" row
        └── RFQ contact form ......... submit → clears cart, shows reference
```

Seven source files, ~700 lines total:

| File | Role |
| --- | --- |
| `lib/cart/CartContext.tsx` | State, persistence, all mutations. **The only file with cart logic.** |
| `components/cart/CartButton.tsx` | Header icon + count badge |
| `components/cart/AddToCartControl.tsx` | Row-level add → stepper swap |
| `components/cart/QtyStepper.tsx` | `– n +` control, reused in 3 places |
| `components/cart/CartView.tsx` | The cart page: table, draft orchestration, RFQ form, success state |
| `components/cart/DraftLineRow.tsx` | The editable "Add Line Item" row |
| `app/cart/page.tsx` | Route shell (breadcrumb + `CartView` + trust band) |

Supporting (not cart-specific, but the draft row depends on them): `Combobox`, `PortalDropdown`, `SuggestionsDropdown`, `useAutocomplete`, `Select`.

---

## 3. The data model

One line item. This is the entire shape — **there is no price, id, image, or SKU field**:

```ts
interface CartLine {
  partNo: string          // "MS27039-1-08"
  manufacturer: string    // "Amphenol"  — part of the identity, see §3.1
  description?: string    // "Power Connector" — display only, never identity
  quantity: number        // integer ≥ 1, always
}
```

### 3.1 Identity / dedupe key — the single most important decision

A line is identified by **part number + manufacturer**, not part number alone:

```ts
keyFor(partNo, manufacturer) = `${slugify(manufacturer)}::${partNo}`
```

- `slugify` lowercases and collapses non-alphanumerics to `-`, so `"Parker Hannifin"` and `"parker hannifin"` collapse to one key.
- **`partNo` is compared verbatim** — case- and punctuation-sensitive. `MS27039-1-08` and `ms270391 08` are two different lines.

**Why manufacturer is in the key:** the same part number is legitimately sold by multiple manufacturers, and a quote for each is a distinct request.

> ⚠️ **Known sharp edge, decide deliberately on your site.** Because manufacturer is in the key, the *same part number* sourced from two places creates **two separate lines**. In the source site this actually happens: the catalog listing resolves `MS27039-1-08` to its canonical manufacturer (`National Aerospace Standards Co`), while the `/search` route fabricates a deterministic placeholder manufacturer (`Eaton`) for the same query. Adding from both pages yields two rows for one part number. **Verified live.** If your site has one authoritative manufacturer per part, either key on `partNo` alone or normalise the manufacturer before it reaches `addItem`.

### 3.2 Quantity invariant

Quantity is **always an integer ≥ 1**, enforced centrally at the store boundary:

```ts
clampQty(n) = Number.isFinite(n) ? Math.max(1, Math.floor(n)) : 1
```

Every mutation passes through it, so no component can write a `0`, a `-3`, a `2.5`, or a `NaN` into the cart. **A quantity of 0 does not exist** — decrementing from 1 removes the line instead (§5.2).

---

## 4. Store contract

Expose exactly this. Components should never touch storage or reimplement the key.

```ts
lines: CartLine[]
totalCount: number                                     // Σ quantity, NOT lines.length
keyFor(partNo, manufacturer): string
getLine(partNo, manufacturer): CartLine | undefined
addItem({ partNo, manufacturer, description?, quantity? }): void
setQuantity(partNo, manufacturer, quantity): void
removeItem(partNo, manufacturer): void
clear(): void
```

Semantics that matter:

- **`addItem` is idempotent — it does NOT increment.** If the key already exists it returns the previous state untouched. Quantity is *not* bumped, and `description` is *not* refreshed. Adding twice from a listing page is a deliberate no-op.
  *(Contrast with the draft row, which explicitly sums — §6.4. If you want "add again = +1", change it here, in one place.)*
- `quantity` defaults to `1` when omitted.
- `setQuantity` / `removeItem` on a missing key are silent no-ops.
- `totalCount` is the **sum of quantities**, not the row count. A cart with 2 rows of qty 2 and 3 shows a badge of **5** and a heading of "2 parts · 5 total qty". **Verified live.**
- `useCart()` throws outside the provider — fail loud, not silent.

### 4.1 Persistence and the hydration rule **[functional]**

Storage: `localStorage`, key `asap:cart:v1`, value = `JSON.stringify(lines)`. The `:v1` suffix is deliberate — bump it if the shape ever changes, so old payloads are ignored rather than crashing.

Three rules that must survive porting, because getting them wrong causes real bugs:

1. **Read only after mount**, never during render. Reading `localStorage` while rendering breaks SSR/SSG hydration.
2. **Report `totalCount` as `0` until hydrated.** The badge must match what the server rendered on the first client paint, or React logs a hydration mismatch. Track a `mounted` flag and gate the count on it.
3. **Do not write until hydrated.** Without this guard, the initial `[]` state persists *before* the read completes and **wipes the user's saved cart on every page load**.

Both read and write are wrapped in `try/catch`: corrupt JSON is ignored, and a full/disabled quota fails silently rather than breaking the page. The read also verifies `Array.isArray(parsed)` before accepting it.

> If your target site is not SSR (pure SPA), rules 1–2 relax, but **rule 3 still applies**.

---

## 5. Adding to the cart from a listing

### 5.1 The in-place swap **[functional]**

`AddToCartControl` occupies one table cell and renders **two mutually exclusive states in the same slot**:

- **Not in cart** → an "Add" button (cart icon + label). `aria-label="Add {partNo} to cart"`.
- **In cart** → the `– n +` quantity stepper.

There is no separate "added!" toast, no modal, no drawer, no redirect. The button *becoming* the stepper is the entire feedback mechanism. **Verified live:** clicking Add swaps the control immediately and the header badge increments in the same frame.

Because state lives in context and is keyed on part+manufacturer, **the same part shown anywhere reflects its cart state** — search results, category listings, related-parts strips all show a stepper for a part already in the cart, with no extra wiring.

Keep in your own styling: the swap must not change the cell's width enough to reflow the table (both states are sized comparably), and the label may collapse to icon-only at narrow widths (`sr-only` on small screens keeps it announced).

### 5.2 Quantity stepper behaviour

Reused at three sizes/places (listing row, cart row, draft row). Behaviour is identical everywhere:

| Interaction | Result |
| --- | --- |
| `+` | quantity + 1, immediately |
| `–` when quantity > 1 | quantity − 1, immediately |
| **`–` when quantity == 1** | **fires `onDecrementBelowOne`** — the caller removes the line (or discards the draft). Never produces 0. |
| Type digits | free-text local draft; **non-digits are stripped on input** |
| Blur / `Enter` | commits: parses int, `< 1` or unparseable → **silently reverts to the current value** |
| Outside change (`+`/`–`/store) | input re-syncs via effect on `quantity` |

The typed value is **local component state until commit**, so a half-typed `""` never reaches the store. `Enter` calls `preventDefault()` so it cannot submit an enclosing form. `inputMode="numeric"` gets the numeric keypad on mobile without the spinner arrows of `type="number"`.

`onDecrementBelowOne` is a required prop, not optional — every call site must decide what "below one" means. Listing row and cart row → remove the line. Draft row → discard the draft.

### 5.3 Header badge

Icon-only link to `/cart` with a count badge shown **only when `totalCount > 0`**. Displays `99+` above 99. The accessible name carries the count and pluralises: `"Cart"` / `"Cart, 1 item"` / `"Cart, 8 items"` — so screen-reader users get the count without seeing the badge. Present in both desktop and mobile header clusters.

---

## 6. The cart page

Three exclusive top-level states.

### 6.1 Empty state

Shown when `lines.length === 0` **and no draft row is open**. Icon, "Your cart is empty", one line of explanatory copy, and two actions: **Browse catalog** (primary) and **Add Line Item** (secondary).

The `&& !draft` condition matters **[functional]**: the moment the user opens a draft from the empty state, the view flips straight to the table so they can type into the row. Without it, the draft would open invisibly behind the empty state.

### 6.2 Populated state — layout

Two columns on desktop, stacked on mobile:

- **Left (flexible):** page header, count heading, `Clear cart`, the line-item table, `Add Line Item`.
- **Right (fixed ~360px):** the RFQ contact form, **sticky** on desktop, top-aligned with the page header.

Sticky-sidebar rationale: a long cart must never push the submit button out of reach. Preserve the *intent* (submit always reachable) in your own layout idiom; the exact width and offset are yours.

Heading text: `"{n} parts · {totalCount} total qty"`, pluralising `part`/`parts`. `Clear cart` is a low-emphasis text button — it empties immediately, **with no confirmation dialog**. (Consider adding one; the source has none.)

### 6.3 Line-item table

Five columns: **Part No. · Manufacturer · Item Name · Quantity · Remove**.

- Part No. is monospaced **[functional-ish]** — these are alphanumeric identifiers users visually diff character by character; a mono face genuinely aids that. Keep a monospace treatment even if the family differs.
- Item Name falls back to `—` when absent.
- Quantity uses the stepper (`–` at 1 removes the row).
- Remove is an icon button, `aria-label="Remove {partNo}"`.
- The table scrolls horizontally inside its own container at narrow widths; the page itself must not scroll sideways.
- Rows are keyed by `keyFor(...)`, so React never reuses a row's DOM/input state across different parts.

### 6.4 The draft "Add Line Item" row — the distinctive part

The purpose: a user who **already knows the part number** can build a whole RFQ without ever visiting the catalog or running a search.

**Core principle [functional]:** the draft is **local UI state, never a `CartLine`**, until it is valid and committed. A half-typed row therefore never reaches `localStorage`, never counts toward the badge, and never survives a reload.

```ts
interface DraftLine { partNo: string; manufacturer: string; description: string; quantity: number }
emptyDraft()      → { partNo: '', manufacturer: '', description: '', quantity: 1 }
isDraftValid(d)   → d.partNo.trim() !== '' && d.manufacturer.trim() !== ''
```

Validity requires **part number AND manufacturer**. Description and quantity never gate it.

**Exactly one draft is open at a time.** Clicking `Add Line Item` while a *valid* draft is open commits it and opens a fresh one — enabling rapid sequential entry. While the open draft is *invalid*, the button is **disabled** (so it can't silently discard typed input). The button also calls `preventDefault()` on `mousedown` so it does not steal focus before the row's blur logic runs **[functional]**.

Column behaviour within the row:

| Column | Behaviour |
| --- | --- |
| **Part No.** | Autofocused text input with autocomplete against the canonical parts table. `autoComplete="off"`. |
| **Manufacturer** | **Creatable combobox** — filtered list of known manufacturers that *also* accepts a freely typed value. Deliberately not a locked `<select>`: a remembered part may come from a manufacturer not on the list. |
| **Item Name** | **Read-only, derived.** Never user-editable. Resolution rules below. |
| **Quantity** | Same stepper. `–` at 1 **discards the whole draft**. |
| **Remove** | Discards the draft. |

**Item-name resolution — two-stage, deliberately:**

1. **While typing:** only an exact canonical part-number match resolves a description (a cheap table lookup). Anything else leaves it blank — this avoids per-keystroke churn in the cell.
2. **On blur of the part field:** if a part number was typed but nothing resolved, fall back to the site's deterministic name generator so the cell is never left blank. **Verified live:** typing `D38999` (not a canonical number) resolved to `Jack Screw` on blur via the fallback.

*Port note:* that fallback exists because the source catalog is procedurally generated, not a real database. **If your target site has a real product/parts API, replace stage 2 with a lookup** (or leave the cell blank / `—`) rather than fabricating a name.

**Selecting an autocomplete suggestion** fills the part number, the description, **and auto-fills the manufacturer** the part is sourced from — which the user may still override before committing.

**Commit-on-blur [functional]:** the row commits itself when focus **genuinely leaves the row** — checked via `relatedTarget` and `currentTarget.contains(next)`, so tabbing between the row's *own* inputs and stepper does not commit. There is no confirm/save button by design.

- Focus leaves while **valid** → commit. **Verified live:** filling manufacturer then clicking the contact form committed the line and bumped the badge.
- Focus leaves while **invalid** → **the row stays open and is not treated as an error.** No red borders, no validation message. **Verified live.**

**Commit semantics — note the asymmetry with `addItem`:**

- Key **not** in cart → add as a new line.
- Key **already** in cart → **sum the quantities** (`existing + draft`) and **flash the existing row** to show where the quantity landed. **Verified live:** re-entering `D38999` / `Amphenol` kept 4 lines and took that line from qty 1 → 2.

The flash is a ~1.2s background fade on the target row, plus `scrollIntoView` to bring it into view — and it **honours `prefers-reduced-motion`** by using instant rather than smooth scrolling. Restyle the highlight freely; keep the reduced-motion check.

**Dropdown clipping [functional]:** the table wrapper needs `overflow-x` for narrow screens, which would clip a normally-positioned absolute dropdown inside a cell. Both the suggestion list and the combobox menu are therefore **rendered in a portal to `document.body`, fixed-positioned and anchored to the input**, with position recalculated on scroll/resize (scroll listener in the **capture** phase so scrolling *any* ancestor repositions it). If you port the draft row into any scrollable container, you need this or an equivalent (a positioning library like Floating UI is a fine substitute).

**Option-pick vs. blur ordering [functional]:** every dropdown option commits on `mousedown` with `preventDefault()`, not on `click`. Otherwise the input's `blur` fires first, closes the list, and the click lands on nothing. This is the classic dropdown bug — preserve the pattern regardless of styling.

### 6.5 Keyboard support

Both dropdowns implement roving-focus listbox semantics: `ArrowDown` / `ArrowUp` (wrapping in the suggestions list), `Enter` to commit the highlighted option, `Escape` to close, `Tab` closes the combobox menu. The active index **resets to −1 whenever the filtered result set changes**, so a stale index can never commit the wrong row **[functional]**. `role="combobox"` + `aria-expanded` + `aria-controls` + `aria-autocomplete="list"` on inputs, `role="listbox"`/`role="option"` + `aria-selected` on the lists. The combobox's `Enter` only intercepts when a row is highlighted, otherwise it bubbles so the enclosing row/form can act on it.

### 6.6 Submit and success

The sidebar form collects: Contact Name\*, Company Name\*, Company Type, Phone\*, Email\*, Need Parts By\*, Comments, and a **required** terms checkbox. (\* = required.)

On submit, in order:

1. **If a valid draft is still open, commit it first** — so a part the user typed but never blurred out of is not silently lost. **This is easy to miss and matters.**
2. Close the draft.
3. Generate a reference id — source uses `'ASAP-' + random 6 digits`.
4. Switch to the success state.
5. **`clear()` the cart** — which also clears `localStorage`.

The success state replaces the whole view: confirmation icon, "Your RFQ has been submitted", a response-time promise, the **reference number in monospace**, and two follow-up actions (search more parts / back to home).

> **Backend is not implemented.** `submit` calls `preventDefault()` and never posts anywhere; the reference number is client-side random. **You must add:** a real POST, an in-flight/disabled state on the button, error handling with the cart **preserved on failure** (clearing before a confirmed success loses the user's work), and a server-issued reference id. Also note the form fields are **uncontrolled** — they are never read into JS. Wire them up (controlled state or `FormData`) before sending anything, and validate the email/phone server-side.

---

## 7. Accessibility checklist

- Every icon-only control has an `aria-label` that names its target: `"Add {partNo} to cart"`, `"Remove {partNo}"`, `"Decrease quantity"`, `"Increase quantity"`, `"Quantity"`, `"Discard new line item"`.
- The cart link's accessible name carries the live count and pluralises correctly.
- Quantity inputs are `type="text"` + `inputMode="numeric"` (numeric keypad, no spinners) with non-digits stripped on input.
- Listbox/combobox ARIA as in §6.5.
- The row-flash animation respects `prefers-reduced-motion`.
- Read-only derived cells are plain text, not disabled inputs — so they aren't focus traps.

---

## 8. Port checklist

**Required — the feature is broken without these**

1. Provider mounted **above** both the header and the page content (same tree, or the badge won't update).
2. `localStorage` key with a **version suffix**; `try/catch` on read *and* write; `Array.isArray` guard on parse.
3. The three hydration rules from §4.1 — especially **do not write before hydrating**.
4. `clampQty` at the **store boundary**, not in components.
5. Decide your identity key (§3.1) and normalise manufacturer at the point of add if the same part can arrive from multiple sources.
6. `onDecrementBelowOne` wired at every stepper call site.
7. Dropdown options commit on `mousedown` + `preventDefault`, not `click`.
8. Portal (or equivalent) for any dropdown inside a scrollable/overflow container.
9. Draft stays local until valid; commit-on-blur uses `relatedTarget` containment.
10. Submit commits a still-open valid draft **before** clearing.

**Decisions to make deliberately**

- `addItem` idempotent (source) vs. incrementing on re-add.
- `Clear cart` with or without confirmation (source: without).
- Item-name fallback: real lookup, blank, or generated (source: generated — see §6.4 port note).
- Cross-tab sync: **not implemented.** Two open tabs will overwrite each other's cart, last write wins. Add a `storage` event listener if you need it.
- Cart expiry / max lines: **neither implemented.** The cart persists indefinitely and unboundedly.

**Must be built for production**

- Real submit endpoint, in-flight state, failure handling that **preserves** the cart, server-issued reference id.
- Controlled (or `FormData`-read) form fields — they are currently uncontrolled and unread.
- Server-side validation of contact fields.

---

## 9. Reference: files to read in the source repo

```
src/lib/cart/CartContext.tsx              ← start here; all logic
src/components/cart/QtyStepper.tsx
src/components/cart/AddToCartControl.tsx
src/components/cart/CartButton.tsx
src/components/cart/DraftLineRow.tsx
src/components/cart/CartView.tsx
src/app/cart/page.tsx
src/app/layout.tsx                        ← provider placement
src/components/ui/{Combobox,PortalDropdown,SuggestionsDropdown}.tsx
src/components/ui/useAutocomplete.ts
src/lib/utils.ts                          ← slugify (identity key)
```

Every behaviour marked **Verified live** in this document was exercised against the running app, not inferred from source.
