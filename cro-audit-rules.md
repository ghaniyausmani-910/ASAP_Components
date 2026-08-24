# CRO audit rules

A pass/fail rule set for auditing each site. Every rule is binary — mark it, note the site, move on. Nothing here is a matter of taste.

**How to use.** Run the site against each rule and record pass, fail or N/A. Failures that are cosmetic go to the fix lane; failures that are code, data or CMS behaviour go to the dev backlog. Cite the rule ID so nothing gets re-litigated.

**The numbers these rules exist to move** (measured on ASAP Components, GA4):

| Metric | Current |
|---|---|
| Part-number searches returning no match | ~50% |
| Visitors who search or start a form | ~0.6% |
| /nsn/* SEO page conversion | 1–2% |
| RFQ page / homepage conversion | 62% / 12.6% |
| Desktop share · Organic · AI Assistant | 99.4% · 4.23% · ~15% |

**If you only enforce five:** A1, A2, B3, C1, G4. They address the largest measured losses.

---

## A · Search — the primary conversion surface

**A1 · Never return an empty result.**
Route every zero-match search to a pre-filled RFQ carrying the typed part number. Half of all searches miss, and each one is a buyer who already knew what they wanted.

**A2 · Normalise part numbers before declaring a miss.**
Strip dashes, spaces and suffixes on both input and index, then match on the stem. Aerospace part numbers fan out into dash, plating and revision variants — the miss rate is a matching problem before it is a UI problem.

**A3 · Offer "did you mean" on near matches.**
Compare against the normalised stem and surface the closest catalogue entries rather than nothing.

**A4 · Accept multi-line paste.**
A pasted column from a shortage report must parse into a multi-part search. Most competitors don't do this.

**A5 · Soft-validate, never hard-validate.**
An unrecognised part number must never block submission. We would rather quote a part we have to look up than lose the request.

**A6 · Autosuggest from the live catalogue.**
Ranked results with the matched substring highlighted, plus a useful zero-state of curated browse and quick links.

**A7 · Search is reachable from every page.**
Header search persists site-wide. On the homepage it may defer to the hero and activate on scroll.

**A8 · Every search event carries `results_count`.**
Without it the miss rate is invisible and A1–A3 cannot be proven to work.

## B · Conversion path placement

**B1 · The whole conversion path sits above the fold.**
Measured at 1920×1080 desktop. No scroll should be required to reach a submit control.

**B2 · Every section offers a route forward — but never a duplicate.**
One clear next step per section. Do not add a form where a CTA already sits above it; redundancy is its own friction.

**B3 · Every catalogue and listing row carries its own RFQ control.**
The /nsn/* pages earn real traffic and convert at 1–2% largely because there is nothing to click. Cheapest large win available.

**B4 · The part number stays visible while scrolling.**
Sticky on part detail pages. The user is cross-checking it against their own list.

**B5 · No page terminates.**
Every end state — including a successful submit — offers a next search or a new request.

**B6 · Content pages close with a CTA.**
Blog, quality and about all end in a dual RFQ and contact option. Cheap, and it serves the best-converting channel.

## C · Form integrity

**C1 · Do not remove or soften any RFQ field.**
Required: contact name, company, phone, email, part number, manufacturer, quantity, need-by. This was tested and refused at client level — shortening the form is not available as a lever.

**C2 · Consent is affirmative only.**
No pre-ticked boxes and no consent implied by submission.

**C3 · Terms and conditions gets its own checkbox and link.**
Two tick boxes total on the form.

**C4 · The comments placeholder does work.**
Invite target price, acceptable alternates and condition. It is the field absorbing everything removed from the form.

**C5 · Company-type options must be real.**
Manufacturer, distributor, airline, broker. Inaccurate options produce unusable qualification data.

**C6 · AOG is visible wherever the vertical warrants it.**
Any site carrying aerospace NSN or civil aviation parts. Selecting it sets need-by to immediate. It is the highest-intent request type on the platform.

**C7 · Success returns proof.**
A server-issued reference number and the phone number. Stops the "did it go through?" drop-off and duplicate submits.

**C8 · One source for the phone number.**
Reuse the header value. Never hardcode it a second time.

**C9 · Contact forms collect company and phone as mandatory.**
Any submission containing a part number routes into the RFQ table, not a separate one.

**C10 · Cart icon, "Add to RFQ" wording.**
The icon is universal — DigiKey and Boeing Distribution both use it. Check the empty state uses the same wording as the button.

## D · Trust and proof

**D1 · Repeat the response-time promise at every submit point.**
Not just the homepage. It has to be present where the decision is made.

**D2 · Put the two hesitations at the button.**
Quote turnaround and a data-privacy line, in microcopy adjacent to the control.

**D3 · Certifications link to the certificate.**
Hosted in ASAP's name. In this industry an unverifiable trust claim is worth close to nothing and a verifiable one is worth a great deal.

**D4 · Show current standards only.**
AS9120B, not superseded revisions. Displaying an obsolete standard alongside its replacement reads as carelessness.

**D5 · Testimonials are deliberately partial.**
First name, business function, and the Google review. Never full name, job title or anything that identifies the customer — full attribution makes a client trivial to poach.

**D6 · Trust density next to the ask.**
Certifications, manufacturer count and named OEM logos adjacent to the form, not in a separate section.

**D7 · Manufacturer logos uniform and legible at rest.**
One colour treatment, consistent sizing, readable without hovering.

## E · Copy

**E1 · Never draft site copy.**
Use legacy wording verbatim; additions come from the content team. This is a standing client instruction, not a preference.

**E2 · No claim that narrows the business model.**
"Sourced exclusively from authorised distributors" excludes new surplus product and is factually wrong. Check every absolute claim against what the business actually does.

**E3 · Use language that means something.**
48 CFR 252.246-7007 and 7008, the NDAA, the 32-point inspection. Specificity signals competence; adjectives signal the opposite.

**E4 · Keep indexed page content intact.**
The content is what holds the ranking. Improve the layout around it — never replace it.

**E5 · Refresh update dates on indexed articles within three months.**
Older content stops being weighted by LLMs, and that is the best-converting channel.

## F · Imagery

**F1 · Nothing fabricated.**
No invented people, buildings or addresses. A missing asset is an empty frame with a TODO, never a plausible substitute.

**F2 · Staff photography on the flagship only.**
Funnel and distribution sites use parts, planes and vertical-appropriate imagery. "Powered by ASAP" carries the trust instead.

**F3 · Product shots show single isolated units.**
Co-mingled parts in bins imply a lot-traceability failure. This is compliance-adjacent, not aesthetic.

**F4 · Warehouse imagery reads modern and automated.**
Racking, handling equipment, clean floors. A general-purpose B2C warehouse actively damages the positioning.

**F5 · Hero imagery matches what the site sells.**
A components site shows components, not airframes. Never place a search or RFQ bar over busy image detail.

## G · Measurement

**G1 · Fire the typed funnel.**
`search → view_item → rfq_start → rfq_form_start → generate_lead`. Micro-conversions make every drop-off diagnosable.

**G2 · `generate_lead` is the single north star.**
Broken down by method and source, so the redesign is compared like-for-like against legacy rather than credited for having more buttons.

**G3 · Carry the lead lifecycle downstream.**
Qualify, working, close. A metric that stops at form submit will eventually optimise toward junk leads.

**G4 · Monitor delivery, not just submission.**
An undelivered RFQ costs more than most optimisations gain. Alerting, not reporting.

**G5 · Track captcha-shown against RFQ-submitted per session.**
This audience runs older machines and locked-down corporate browsers — exactly where fingerprinting misfires.

**G6 · Group multiple requests from one sender to one rep.**
Four part numbers entered minutes apart should not produce four separate reps contacting the same buyer.

## H · Hard limits — these override everything above

**H1 · Never change IA for CRO.**
Nav grouping, routes, metadata titles and sitemap output are locked. Indexing loss flows straight to RFQ volume, which is the metric all of this serves.

**H2 · Do not simplify for the non-technical buyer.**
The audience is engineers, procurement professionals and technicians. If conversion is down, look for friction affecting competent users — not missing hand-holding.

**H3 · Do not build category browsing as a discovery path.**
Buyers arrive with a part number because they cannot find the site otherwise, and the variant space is too large to navigate. Related-part recommendation after a request is a different question.

**H4 · Desktop first.**
99.4% of usage. Responsive afterwards, never at desktop's expense.

**H5 · WCAG 2.1 AA contrast is a gate.**
Every changed surface, every review. Record the result per site.

---

## Not to be proposed

Each of these assumes a browsing buyer who does not exist here.

| Proposal | Why not |
|---|---|
| Image or visual-similarity search | Buyers arrive with a part number in hand |
| Voice search | Alphanumeric part numbers handle badly by voice |
| Multi-attribute filters — material, MOQ, industry | Assumes browsing; variant space is unnavigable |
| Product compare, commonly-bought-together | Same assumption |
| WhatsApp as a quote channel | Export-control and traceability risk on an unlogged channel |
| Meta retargeting | Wrong channel for aerospace procurement |
| Browser push notifications | Transactional, infrequent audience |
