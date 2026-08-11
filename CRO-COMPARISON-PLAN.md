# CRO Comparison & Launch Measurement Plan (Phase 3)

Companion to `CRO-BASELINE.md`. Purpose: guarantee the redesign is measured **apples-to-apples** against the baseline, and lock the **verdict rule before launch**.

Launch model: **cutover in place** — redesign replaces the legacy site on asap-components.com, same GA4 property (`G-GW4LSQMS55`), split at the cutover date.

---

## 1 · Success criterion (agree this before launch)

**Primary test — measured on Organic Search traffic (quality, not bots):**

| Verdict | Rule |
|---|---|
| ✅ **BEATS** | Redesign Organic-Search RFQ conversion is **meaningfully above** baseline (clear margin, not noise). |
| 🟰 **MEETS** | Within ~normal week-to-week noise of the baseline. |
| ❌ **BELOW** | Clearly under baseline → diagnose (funnel drop-off + session replays) before iterating. |

**Baseline to beat:** Organic Search all-key-events rate **4.23%** (RFQ-specific rate is lower; use the same definition on both sides — see §2).

**Guardrail metrics (must not regress):** total RFQ volume, Organic engagement rate (55%), search-miss rate (~50% → should fall), homepage landing conversion (12.6%).

---

## 2 · Event parity map (legacy ↔ redesign)

The two sites use different event names — this table is how we translate so before/after compares the *same behaviour*.

| Baseline metric | Legacy event (before) | Redesign event (after) | How to compare |
|---|---|---|---|
| **RFQ submission (North Star)** | `Normal_RFQ` | `generate_lead` **where `method=rfq`** | Like-for-like: legacy's single RFQ form ↔ redesign's main RFQ. Cart/BOM (`method=cart/bom`) = **upside**, reported separately. |
| Any-form submit (secondary) | `form_submit` | `form_submit` (GA4-auto, still on) + `contact_submit` | context/sanity only — noisy |
| Search performed | `view_search_results`, `Partnumber_Search_*` | `search` (has `source`, `results_count`) | count of search events |
| **Search miss** | `*_Non_Exist` | `search` where `results_count = 0` | miss rate = misses ÷ all searches |
| RFQ entry intent | *(none — new)* | `rfq_start` (`source`) | new funnel visibility the legacy lacked |
| Add to cart | *(none — new)* | `add_to_cart` | new |
| Contact | (part of `form_submit`) | `contact_submit` | |
| Phone / email click | *(none — new)* | `tel_click` / `mailto_click` | new |

> Because both `Normal_RFQ` and `generate_lead` will be Key Events in the same property, GA4's **Session key event rate** stays continuous across the cutover — one line, split at launch.

---

## 3 · GA4 setup to do NOW (pre-launch)

1. **Mark `generate_lead` as a Key Event.** Admin → Key events → **New key event** → type exactly `generate_lead` → Save. (Works even before it fires in production.)
2. **Keep `Normal_RFQ` marked** as a key event (covers the "before" period). ✅ already is.
3. *(Optional)* mark `contact_submit` as a key event too.
4. **Build a saved comparison Exploration** — "Redesign vs Baseline (Organic)":
   - Explore → blank → **Segment:** Organic Search (Session default channel group = Organic Search).
   - **Dimensions:** Event name, Session default channel group, Landing page, Device category.
   - **Metrics:** Sessions, Key events, Session key event rate, Engagement rate.
   - Save it now so on launch day you just switch the date to before-vs-after.

---

## 4 · Launch-day checklist (Phase 5)

- [ ] Deploy the redesign (cutover). `G-GW4LSQMS55` is already in the code — measurement continues automatically.
- [ ] Add a GA4 **annotation** on the cutover date (marks the before/after boundary in every report).
- [ ] In **DebugView**, confirm production fires `generate_lead`, `search`, `rfq_start`, `add_to_cart`.
- [ ] Confirm the cookie banner + Consent Mode work in production.
- [ ] *(If enabling lead emails)* set `RESEND_API_KEY` + `LEAD_NOTIFY_EMAIL` in the production env.

---

## 5 · Measurement window (Phase 6)

- Organic Search runs ~4,800 sessions / 90 days (~1,600/mo). Plan a window of **≥ 4–8 weeks** to gather enough Organic conversions for a trustworthy read; don't call it on a few days of data.
- Use a **before window of matched length** (e.g. the 8 weeks pre-cutover) vs the 8 weeks post-cutover.
- Watch for confounders (seasonality, a traffic-source shift, campaigns) and note them.

---

## 6 · Verdict template (fill at Phase 6)

| Metric (Organic Search) | Baseline (before) | Redesign (after) | Δ | Read |
|---|---|---|---|---|
| RFQ conversion (`Normal_RFQ` → `generate_lead` method=rfq) | 4.23%* | ____ | ____ | |
| Engagement rate | 55.3% | ____ | ____ | |
| Search-miss rate | ~50% | ____ | ____ | |
| Homepage landing conversion | 12.59% | ____ | ____ | |
| RFQ volume (all methods) | 34 users/90d | ____ | ____ | upside from cart/BOM |

*_all-key-events organic rate; refine to RFQ-only if desired._

**Final verdict:** ⬜ Beats · ⬜ Meets · ⬜ Below — and the specific funnel steps driving the difference.
