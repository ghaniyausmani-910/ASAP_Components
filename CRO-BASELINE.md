# CRO Baseline Scorecard — Live Site

**Property:** ASAP Components – GA4 (`G-GW4LSQMS55`)  ·  **Site:** asap-components.com
**Measurement window:** `2026-05-12 → 2026-08-09` (last 90 days)
**Pulled on:** 2026-08-10
**Pulled by:** ____

> This is the fixed reference the redesign is measured against (before/after). Fill every `____`.
> Use the SAME window and the SAME conversion definition when we measure the redesign after launch.

---

## 0 · Conversion definition (do this first — it drives everything)

**Primary conversion (North Star):** `Normal_RFQ` — the legacy site's intentional "RFQ submitted" event. Matches the redesign's `generate_lead`.
**Secondary (sanity / context only):** `form_submit` — GA4-automatic, fires on ALL forms (search, filters, exit popup), so it overcounts leads ~11×. Track the trend, don't treat as the lead number.

⚠️ **Comparison-integrity note:** the redesign's `generate_lead` fires on every RFQ path (hero, inline, quick-quote, BOM, cart); legacy `Normal_RFQ` may fire on fewer paths. At launch, break `generate_lead` down by source and compare like-for-like so the redesign isn't credited just for *counting* more entry points.

_How to find it:_ **Admin → Data display → Events** (see every event + counts) and **Admin → Key events** (what's already marked a conversion). Look for a lead-type event — likely one of: `generate_lead`, `form_submit`, `contact`, or a thank-you/confirmation `page_view`. Tell me what you find and I'll confirm the right one.

---

## 1 · Headline metrics  (window above)

| Metric | Value |
|---|---|
| Sessions | ~136,435 (`session_start`) |
| Total users | 177,740 |
| **Primary conversions — `Normal_RFQ`** | **67 events · 34 users** |
| **Conversion rate (primary)** | **~0.05% by session** (67 ÷ 136,435) · ~0.025% by user *(finalize via GA4 "Session key event rate")* |
| Secondary — `form_submit` (all forms) | 1,527 events · 366 users → ~1.12% by session *(noisy; context only)* |
| Engaged sessions % (engagement rate) | 4.23% (7,454 engaged / 176,347) — but ~55% on quality channels |
| Avg. engagement time / session | ~2s blended (bot-dragged) · 35–55s on Organic/AI/Referral |

_How to pull:_ **Reports → Engagement → Events** for the conversion count; **Reports → Acquisition → Traffic acquisition** (or Reports → Engagement → Overview) for sessions. Set the date range (top-right picker) to the window above. If the conversion event is marked a **Key event**, GA4 shows **“Session key event rate”** directly — that's your conversion rate.

---

## 2 · Funnel & biggest drop-off

_By users (each event's "Total users"), 90-day window:_

_By users (each event's "Total users"), 90-day window:_

| Step | Users | % of visitors | Notes |
|---|---|---|---|
| Entered site | 135,723 | 100% | |
| Used search (`view_search_results`) | 795 | 0.59% | massive drop — almost nobody engages |
| Started a form (`form_start`) | 759 | 0.56% | |
| Submitted a form (`form_submit`, any) | 366 | 0.27% | ~48% of form-starters finish |
| **Requested a quote (`Normal_RFQ`)** | **34** | **0.025%** | the true lead |

**Biggest leak: entered site → engaged.** Only ~0.6% of visitors search or touch a form; a huge, SEO-heavy top-of-funnel that mostly bounces. Getting even a slightly larger fraction to engage is the redesign's biggest opportunity. (Form-start→submit at ~48% is already healthy — the form itself isn't the problem.)

**Search demand signal (bonus):** legacy tracks search hits vs misses — `Partnumber_Search_Exist` 343 users vs `_Non_Exist` 303, plus NSN/CAGE/MFG/Part_Type variants. Roughly *half* of part-number searches return no match — every miss is a lost RFQ. Worth watching on the redesign too (our `search` event carries `results_count`).

_How to pull:_ **Explore → Funnel exploration**. Add steps using the events above. (Enhanced Measurement already gives you `form_start`; `session_start` and `page_view` are automatic.)

---

## 3 · Device split

| Device | Users | Share |
|---|---|---|
| **Desktop** | **~177,000** | **99.4%** |
| Mobile | 980 | 0.6% |
| Tablet | 17 | 0.0% |

OS: Windows ~176K (dominant), Macintosh 712, iOS 591, Android 404. Browser: mostly Chrome.

🔑 **Key insight — optimize DESKTOP, not mobile.** This audience is ~99% desktop (B2B aerospace/defense procurement + likely some bot traffic), the inverse of a normal site. The redesign's CRO effort should target desktop; mobile has negligible volume.

⚠️ **Traffic-quality flag:** 99.4% desktop + Windows-only + only ~0.6% engaging + 34 RFQs / 135K users suggests a meaningful share of bot/low-intent traffic inflating the denominator. True human conversion is likely higher than 0.05%. Doesn't break the before/after (same definition both sides), but consider adding a bot/quality segment before over-interpreting absolute rates.

---

## 4 · Top acquisition channels

| Channel | Sessions | Engagement rate | Avg time | Session key-event rate (all key events) |
|---|---|---|---|---|
| Direct | 128,754 (73%) | 3.47% | 1s | 0.16% |
| Unassigned | 41,946 (24%) | 0.11% | 2s | 0.03% |
| **Organic Search** | 4,819 (2.7%) | **55.3%** | 35s | **4.23%** |
| **AI Assistant** | 254 (0.1%) | 59.5% | 55s | **14.96%** |
| Referral | 231 (0.1%) | 56.3% | 43s | 10.39% |
| Organic Social | 3 | 100% | 27s | 0% |

🔑 **THE key finding: ~97% of traffic (Direct + Unassigned) is bot/low-quality** — near-zero engagement, ~1s visits, ~0.1% conversion. It drags the blended rate to 0.05%. **The real humans come via Organic Search / AI Assistant / Referral and convert at 4–15%.**

➡️ **Measurement decision:** judge the redesign primarily on **Organic Search conversion (~4.2% baseline)**, not the blended rate — a swing in bot volume must not be allowed to mask the redesign's true effect. Segment reports to Organic Search (± Referral/AI) when comparing before/after.

📈 **Channel to nurture:** `AI Assistant` (ChatGPT/Perplexity referrals) converts best (~15%) — favor clean content + structured data on the redesign.

---

## 5 · Top landing pages

| Landing page | Sessions | Session key-event rate |
|---|---|---|
| `(not set)` | 42,584 (24%) | <0.01% ← bot/junk, no real page |
| `/` (homepage) | 556 | **12.59%** (525 key events — the workhorse) |
| `/nsn/nsn-parts` | 140 | 2.14% |
| **`/straightrfq`** | 107 | **61.68%** 🔥 highest-intent page |
| `/nsn/niin-parts` | 69 | 1.45% |
| `/nsn/cage-codes` | 60 | 1.67% |
| `/rfq/thankyou` | 52 | 32.69% (post-conversion page) |
| `/partno-search` | 22 | 13.64% |

_(129,205 landing pages total — a huge SEO long tail.)_

🔑 **Model pages to protect in the redesign:** `/straightrfq` (62%!) and the homepage (12.6%) are where conversion actually happens. Whatever those pages do right (clear RFQ path, high intent capture), the redesign must keep or improve. The `/nsn/*` SEO catalog pages pull traffic but convert at 1–2% — a big opportunity to add stronger RFQ hooks.

---

## 🏁 Baseline summary — what the redesign must beat

**The one-line story:** the legacy site pulls huge traffic (~176K sessions/90 days) but ~97% is bot/low-quality Direct+Unassigned. Real buyers arrive via **Organic Search / AI Assistant / Referral** and convert well. The blended rate (0.05% RFQ, 0.27% all key events) is misleading — **measure the redesign on quality traffic.**

**Primary targets to beat (measure on Organic Search, before → after):**
| Metric | Legacy baseline | Redesign goal |
|---|---|---|
| **Organic Search conversion** (all key events) | **4.23%** | > 4.23% |
| Organic engagement rate | 55.3% | ≥ 55% |
| RFQ conversion (`Normal_RFQ` vs `generate_lead`) | ~0.04% blended / higher on organic | ≥ baseline, like-for-like by source |
| Homepage landing conversion | 12.59% | ≥ 12.59% |
| Search miss rate (`*_Non_Exist` ÷ all searches) | ~50% | lower (fewer dead-end searches) |

**Where the redesign can win biggest:**
1. **Get more of the top-of-funnel to engage** — only ~0.6% search or start a form today.
2. **Lift the `/nsn/*` SEO catalog pages** (1–2% today) with stronger RFQ hooks — that's where the organic volume lands.
3. **Cut the ~50% search-miss rate** — every missed part search is a lost RFQ.
4. **Protect the winners** — `/straightrfq` (62%) and homepage (12.6%).
5. **Desktop-first** — 99% of usage; don't over-invest in mobile.

## Method notes / caveats
- Window: 2026-05-12 → 2026-08-09 (176,347 sessions) — ample volume, no need to widen.
- **Bot/low-quality traffic** dominates (Direct+Unassigned ≈ 97%); consider a GA4 bot/quality segment or compare Organic-only so it can't mask the redesign's effect.
- **Comparison integrity:** legacy `Normal_RFQ` vs redesign `generate_lead` may cover different RFQ paths — at launch, break `generate_lead` down by source and compare like-for-like.
- Add a GA4 **annotation** on the cutover date to mark the before/after boundary.
