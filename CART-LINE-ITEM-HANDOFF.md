# Handoff prompt — "Add Line Item" in the cart/RFQ

Paste everything below the line into a new Claude session, working on any website that has a
cart or quote-request list. It describes the **experience and behavior** to build, not any
specific framework or file layout — Claude should adapt it to the target codebase.

---

## Feature: let users add a part to the cart by typing it, without leaving to search

**The problem it solves.** A user has finished building their cart and, at the last moment,
remembers one more part. They know the part number. Today the only way to add it is: go to
search → find it → open it → add to cart → come back. That round-trip is a deal-breaker — they
often just don't bother. Give them a way to add the item *in place*, right in the cart.

Build this to match the site's existing design system (typography, color tokens, borders,
spacing, button styles, form-field styles). Reuse existing components — quantity stepper, select/
dropdown, autocomplete, buttons — rather than inventing new ones. It should look native to the
cart, not bolted on.

### The trigger — an "Add Line Item" action

- A low-emphasis **tertiary/text button** labeled `+ Add Line Item`.
- **Borderless** (no box/outline), in the brand's **primary accent color**, **left-aligned** to
  the list, placed **directly below the cart list** (outside/under the table, not inside it).
- Also show it in the **empty-cart state**, alongside the existing "Browse catalog" (or
  equivalent) call-to-action — so a user who only has part numbers can start a request from
  memory, never touching the catalog. The first line they add turns the empty state into the list.

### The draft row

Clicking `Add Line Item` appends **one editable row** to the bottom of the list. It has the same
columns as a normal cart line, but:

- **Part No.** → a **text input** with **autocomplete** against the catalog. Selecting a
  suggestion fills the part number (and, if known, the manufacturer).
- **Manufacturer** → a **required combobox**: user can pick from the known manufacturer list
  **or type a custom value not on the list** (real parts often come from unlisted makers — never
  make this a dead end).
- **Item Name** → **read-only**, auto-filled from the part number (see below).
- **Quantity** → the same **stepper** used on every other row (defaults to 1).
- **Remove** → the same trash/remove control; here it **discards the draft**. Stepping quantity
  below 1 also discards it.

### Item name auto-fill (the core delight)

As soon as a part number is entered, the **Item Name populates on its own** — the user never types
it. Resolution order:

1. If the part number matches a **real catalog part**, show its **real name** (resolve live while
   typing / on selecting a suggestion).
2. Otherwise, resolve it to the **same name the rest of the site would show for that part number**
   (e.g. whatever your search-results/detail page derives). Resolve this when the user leaves the
   part-number field, so it doesn't flicker on every keystroke.
3. Guarantee the name is resolved again **at commit**, so a line always carries a name even if the
   user didn't blur the field.

The field is always read-only — it's a lookup result, not something the user edits.

> Decision to make per-site: if your product data has NO reasonable name for an unknown part and
> quoting on a made-up name is unacceptable, instead leave Item Name **blank/optional** for unknown
> parts and only auto-fill on a real match. Pick based on whether your catalog fabricates/derives
> names site-wide (then always fill) or only has curated real parts (then leave blank). Be explicit
> about which you chose.

### One draft at a time

- The user fills **one** draft row before adding another. Keep the `Add Line Item` button
  **disabled until the current draft is valid** (has both a part number and a manufacturer). This
  avoids a mess of empty rows.

### Commit → the row becomes a normal line

- A draft **commits automatically** when it's valid and focus leaves the row (no separate
  "confirm" button). Submitting the whole RFQ/quote form also commits any open valid draft first.
- On commit, the row **locks to plain text** — Part No. and Manufacturer become static text,
  identical to catalog-added rows. Quantity stepper and Remove keep working exactly as on other
  rows. To fix a typo, the user removes and re-adds (cheap in a one-at-a-time flow).
- Rationale: the cart's identity for a line is (part number + manufacturer). Keeping those
  editable after commit would make the line's identity change on every keystroke and reopen
  dedupe/merge logic. Locking on commit keeps the data model simple and makes manual lines
  indistinguishable from normal ones — so everything downstream (totals, submission) just works.

### Duplicate handling — merge, never silently no-op

- If the committed part number + manufacturer **already exists** in the cart, **don't** silently
  do nothing (that reads as broken). Instead: **add the new quantity to the existing line**,
  **scroll to and briefly highlight/flash** that line so the user sees where their part went, and
  clear the draft.

### State & persistence

- The draft is **local UI state only** — it is **never written to the cart's persistent storage**
  (localStorage/server) until it commits. A half-typed row must never survive a refresh.
- Committed lines are ordinary cart lines and persist however the cart normally persists.

### Must-fix implementation gotcha: dropdown clipping

Cart lists are usually wrapped in a horizontally-scrollable container
(`overflow-x: auto`), which **also clips vertically** and will **cut off** the manufacturer
dropdown and the part-number autocomplete (badly — the manufacturer list can be 40+ items). Render
these menus so they **escape the overflow container**: use a **portal to `document.body` with
`position: fixed`**, anchored under the input and repositioned on scroll/resize. Do **not** rely on
`position: absolute` inside the scroll wrapper.

### Accessibility & interaction details

- Real form labels / `aria-label`s on every input; the read-only name is not a control.
- Combobox: full keyboard support (Up/Down to move, Enter to select, Escape to close, type to
  filter), `role="combobox"`/`listbox`/`option`, and it must allow a typed custom value.
- Autocomplete options commit on `mousedown` (so a click lands before the input's blur closes the
  list). Outside-click / blur closes menus; picking an option must not be swallowed by the
  close-on-outside logic (account for the portaled menu when detecting "outside").
- Respect reduced-motion for the merge highlight/scroll (instant instead of animated).

### Acceptance checks

1. `Add Line Item` appears below the list and in the empty state; borderless, accent-colored,
   left-aligned; disabled while a draft is incomplete.
2. Typing a **known** part number fills the real item name; typing an **unknown** one fills the
   site's derived name (or stays blank, per your chosen policy) — with no per-keystroke flicker.
3. Manufacturer dropdown and part-number autocomplete are **fully visible, not clipped**, even at
   the bottom of the list.
4. Manufacturer accepts both a listed value and a **custom typed** value.
5. Committing a valid draft turns it into a normal, plain-text row with working Qty + Remove.
6. Re-adding an existing part **merges quantity + highlights** the existing row.
7. A half-filled draft does **not** persist across reload.
8. Submitting the quote form includes an open, valid, uncommitted draft.
