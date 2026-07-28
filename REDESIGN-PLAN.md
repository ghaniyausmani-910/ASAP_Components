# ASAP Components — Website Redesign: Structure & Sitemap

## Context

We are redesigning the existing **ASAP Components** website — an aerospace / aviation
parts distribution business operating on an **RFQ / lead-gen** model (customers browse
parts by category and by manufacturer, then Request a Quote; no public pricing or
checkout). The final deliverable will be a **coded website built on Next.js + React**.

Before any design or build work, we are mapping the **complete information architecture**
of the site: every page, the sections within each page, and how the pages connect into an
overall sitemap. This document is the agreed skeleton. Once locked, we generate a complete
baseline from it and enhance afterward.

**Working method (page by page):** The user provides each page (link and/or screenshots).
For every page we record its **sections** (each block top to bottom), its **architecture**
(layout & hierarchy / flow), and a **blueprint** (structured wireframe-in-words). After all
pages are covered, we assemble the **whole-site sitemap**.

**This is a REDESIGN, not a clone.** For every page we also apply an **enhancement lens**:
alongside the baseline capture, we note (a) **issues** with the current design/UX and
(b) **enhancement opportunities** for the redesign. The goal is to fix problems and improve
the overall experience — not merely reproduce the existing site.

**★ CORE PRODUCT PRIORITIES (govern the entire redesign):** The site has **two primary
features**, and every page's design must make both effortless:
1. **Part Search** — the instant a user arrives, they can search for any part (by Part
   Number, NSN, etc.). Search must be front-and-center, unmissable, and available site-wide.
2. **RFQ / Instant Quoting** — requesting a quote must be one obvious action away from
   anywhere on the site.
These two are the site's reason for existing; all other content is secondary and should
funnel toward them. (This directly resolves the Home-page "competing CTAs" issue: search +
RFQ are THE primary paths; everything else is subordinate.)

**Available assets** (on the user's Desktop): `AeroImages/` (~70 aviation stock photos),
`Electrochemicals/` (~50 images), `HardenerFastners/` (~27 images), and `LOGOS/`
(manufacturer logos — Boeing, Lockheed Martin, GE Aviation, Honeywell, Goodrich, Parker,
Eaton, etc. — plus certification badges including ITAR).

---

## Page Blueprints

_Each entry: Sections → Architecture → Blueprint → Issues & enhancements._

### Page 1 — Home  (`https://www.asap-components.com/`)

**Global Header** (persists site-wide)
- Logo: "ASAP Components — An ASAP Semiconductor website" (top-left)
- Universal parts search: input "Enter Part Number, NSN…" + a "Part Number" type dropdown + SEARCH button
- Contact strip: email `sales@asap-components.com`, phone `+1-714-705-4780`
- Primary nav: Home · About Us · Board Level Components · NSN Parts · Aviation Parts · Standard Parts · Electrical Connectors · Featured Parts · Blog · Contact Us
- Prominent red **INSTANT RFQ** button (far right)

**Sections (top → bottom):**
1. **Hero** — full-bleed sky/aircraft background; headline "PROUDLY SUPPORTING / THE USA AND HER ALLIES."
2. **Quick-Quote bar** — "Submit A Quote And We'll Get Back To You Shortly" + trust line "Guaranteed Quotes Back Within 15 Minutes, 24/7 X 365"; inline fields Part Number / Quantity / Email + **GET A QUOTE** button.
3. **Feature/benefit icon row** — 4 icons (value props / how-it-works cues).
4. **Featured Aviation Parts** — heading + 4 image cards: Featured Aircraft Components · Aircraft Windows Parts · Aircraft Engine Parts · Aircraft Instruments & Avionic Parts.
5. **"A Global Supplier of Civil Aviation and Military Aviation Components"** — 2-column: descriptive company paragraph (left, jet-engine image) + blue value-prop box "Utilize ASAP-Components…" with bullets (15-min quotes 24/7×365 · AS9120B & ISO 9001:2015 · FAA AC 00-56B · No China Sourcing Pledge · same-day delivery).
6. **Recently Ordered Parts** — heading + row of clickable part numbers (00-13443-01, 152244-0110-GB, SJ3401LOOPBLK330, SJ5832) + 4 product cards (BAV / MS / AS / NAS Standard Parts) + **VIEW MORE** button.
7. **Our Top Aerospace Part Categories** — blue label panel (airplane image) + 3 link-list columns: **Top Trending FSCs** · **Top Demanding NSN** · **Hot Stock Part Numbers of the Week**, each with its own VIEW MORE.
8. **Top Aerospace Manufacturers** — heading + logo grid (Airbus, APM, Avery, Cisco, Dell, Boeing, Orion Pharma, Saft, Xybion, …) + **VIEW ALL** button.
9. **Certifications & Memberships** — "ASAP Semiconductor's Certifications And Memberships" badge row (ISO, ASA, NBAA, ITAR, NIST 800-171, etc.).
10. **Trust / Pledge banner** — Intrepid Fallen Heroes Fund support statement (left) + "No China Sourcing Pledge" badge (right).

**Global Footer** (persists site-wide)
- **Get In Touch**: address (1341 South Sunkist Street, Anaheim CA 92806), phone, fax, email.
- **How Are We Doing?** customer-satisfaction survey + TAKE A SURVEY NOW button.
- **Company Information**: Home · About Us · Quality · Contact Us · Blogs · Sitemap.
- **Policies**: Privacy · Cookie · Conflict Minerals · Combating Human Trafficking.
- **Terms & Conditions**: Customer T&C · Supplier T&C.
- **Quick Links**: FAR & DFARS Flow Downs · Consignment Options.
- **Payments**: Visa · Mastercard · Discover · Amex.
- **Connect With Us**: social icons + Download Browser Extension.
- Compliance ribbon: "All Orders Fulfilled in the U.S.A." · "All shipments must comply with U.S.A. export laws." · "No exceptions." + legal disclaimer + © 2026 ASAP Semiconductor LLC.

**Global overlays (persist site-wide):**
- **Cookie consent banner** — bottom-pinned bar ("We use cookies… / YES, I ACCEPT COOKIES").
- **Live chat widget** — floating blue chat bubble, bottom-right.
- **Dropdown structure confirmed** (Aviation Parts example): category label opens a dropdown listing its item-pages (Aviation Part Types · Bearings · Fastener · Manufacturers).

**Redesign notes for overlays:** cookie banner should be privacy-respecting (decline non-essential); keep live chat as a low-friction alternate path to Search/RFQ assistance, but ensure it doesn't obscure the RFQ button or content on mobile.

**Architecture / flow:** Search + Instant-RFQ are the two conversion anchors, repeated top (hero quick-quote) and via the persistent red button. Page funnels: emotional hook (hero) → immediate quote capture → credibility (features, certs, pledge) → catalog entry points (featured parts, categories, manufacturers) → conversion. Single-column stacked sections with alternating 2-column feature blocks; heavy use of card grids and link lists as catalog gateways.

**Issues & enhancement opportunities (redesign):**
- **Hero says nothing about the business.** Purely emotional ("Proudly Supporting…") with no plain-language statement of *what ASAP Components does* or a clear primary CTA. → Redesign hero to pair the message with a concise value proposition + one dominant action (search or RFQ).
- **Competing CTAs / unclear hierarchy.** Universal search, hero quick-quote bar, and persistent Instant-RFQ all fight for attention. → Establish one clear primary path; keep others secondary.
- **Off-brand manufacturer logos.** The "Top Aerospace Manufacturers" grid mixes in non-aerospace names (Dell, Cisco, Avery, Orion Pharma). → Curate to genuine aerospace/defense OEMs; use real logos from `LOGOS/Manufacturers/`.
- **Dense, cluttered SEO link-lists** (FSCs / NSN / part numbers) are visually heavy and low-value to first-time visitors. → Keep for SEO but redesign into cleaner, scannable modules; de-emphasize above the fold.
- **Trust signals buried low.** → Surface a compact trust bar higher up.
- **Likely dated visual language** — needs a modern, credible, aerospace-grade look.
- **Unverified:** mobile responsiveness, accessibility/contrast, and nav mega-menu behavior.

**Shared-element note (applies site-wide):** Primary nav items *Board Level Components, NSN Parts, Aviation Parts, Standard Parts, Electrical Connectors, Featured Parts* carry dropdown carets → they are **mega-menus / dropdowns**. The **Certifications & Memberships badge block** and the **Intrepid Fallen Heroes Fund + No China Sourcing pledge banner** are **reusable modules** repeated across interior pages. Interior pages carry a **breadcrumb** directly under the header.

**★ NAV / CATEGORY STRUCTURE (confirmed):** Each header nav item is a **top-level CATEGORY** that opens a **dropdown menu**; the dropdown entries are **individual, unique pages**. Model: **Category (header dropdown) → dropdown items = the real pages.** Clicking a category label **only opens its dropdown** — categories have **no landing page** on the current site.

Category → dropdown-item pages:
- **Board Level Components** → Electronic (Part Type), Manufacturers.
- **NSN Parts** → Parts By NIIN, Parts By FSC, Parts By NSN, Manufacturers, Cage Code, Part Types.
- **Aviation Parts** → Aviation Part Types, Bearings, Fastener, Manufacturers.
- **Standard Parts** → BAC Standard, MS Standard, AS Standard, NAS Standard.
- **Electrical Connectors** → Connectors Manufacturers, Connector Types.
- **Featured Parts** → Aircraft Windows Parts, Aircraft Engine Parts, Aircraft Instruments & Avionic Parts.

### Page 2 — About Us  (`/about-us/`)

**Unique to this page** (header, breadcrumb, certs, pledge, footer are shared):
1. **Breadcrumb** — Home / About Us.
2. **Two-column body:**
   - **Main (left):** "Who We Are" intro · "You can rely on the ASAP method to:" 5-bullet list (cross-reference by NSN/NIIN/CAGE/part type/manufacturer/aircraft type/ATA/FAA; hard-to-find & long-lead NSN; custom solutions & instant quoting; AOG expedited; MRO/FBO network) · "Our Keystone Principles" quality/compliance paragraphs (AS9120B, ISO 9001:2015, FAA AC 0056B, PPIRS/DOD, No China Sourcing, 100% supplier rating, Intrepid Fallen Heroes Fund) + "strategic purchasing partner" close.
   - **Sidebar (right):** "Send Instant RFQ" card (Part No. / Qty / Email → Get a Quote) · "Why Choose Us" card (On-time Delivery · User-friendly Database · 5,100+ Manufacturers · Complete Purchasing Solutions).
3. **Certifications & Memberships** (shared, fuller set). 4. **Trust / Pledge banner** (shared).

**Architecture / flow:** Classic 2-column interior template — narrative left, sticky conversion sidebar right, then shared credibility modules.

**Issues & enhancements:** Wall of text → scannable blocks/subheads/stats/visuals · **Live bug: stray `}` at end of body copy → remove** · No visual storytelling → add stats/imagery/timeline · Abrupt opening (no page header) → add interior hero · Decorative-only cert badges → make explainable · **Keep** the sticky RFQ + "Why Choose Us" sidebar pattern.

### Page 3 — Blog (listing)  (`/blog/`)

**Unique:** 1. Breadcrumb (Home / Blog). 2. Two-column: **Main** = title + count ("Page 1 of 6") + pagination + **12 post cards** (3×4; category tag · title · date · author Tony Adams · excerpt · Learn More) + bottom pagination; **Sidebar** = Blog Search · Categories tag cloud · Recent Blogs (5) · Recent Twitter Posts. 3. Certs (shared). 4. Pledge (shared).

**Architecture / flow:** Standard blog-index — paginated card grid + discovery sidebar. Secondary to Search+RFQ. Implies child template (Blog Post).

**Issues & enhancements:** **Search button label "FIND PARTS" here vs "SEARCH" elsewhere → standardize one search UI** · Text-only cards → add thumbnails + uniform heights · Abrupt excerpts → read-time/hierarchy · Dated Twitter embed → replace/remove · No Search/RFQ funnel in blog → add contextual callout · **Keep** blog search, categories, recent posts.

### Page 4 — Contact Us  (`/contact-us/`)

**Unique:** 1. Breadcrumb. 2. Page header ("Contact Asap Components" + intro). 3. Two-column: **Left** = facility photo + dark-blue Address panel (address · 24/7 phone · email `sales@asap-partservices.com`); **Right** = Contact form (First Name* · Last Name* · City* · Country* · Email* · Phone* · Postal Code* · Address · Comments + T&C checkbox → Submit). 4. Google Map embed. 5. Certs. 6. Pledge.

**Architecture / flow:** Header → intro → info-card + form (2-col) → map → shared modules. General contact channel, distinct from RFQ.

**Issues & enhancements:** **Email mismatch (`asap-partservices` vs `asap-components`) → reconcile** · High-friction 7 required fields → trim to Name/Email/Message · Placeholder-as-label → persistent labels (a11y) · Odd logic (Postal Code required, Address optional) → fix · No RFQ cross-link → add "Need a quote? → Instant RFQ" · **Keep** facility photo, address panel, map.

### Page 5 — Instant RFQ / Straight RFQ Form  (`/straightrfq/`)  ★ CORE FEATURE

The single-part quote engine; destination for the sitewide Instant-RFQ button and inline quick-quote mini-forms.

**Unique:** 1. Breadcrumb (Home / Straight RFQ Form). 2. Page header ("Request Instant Quote…" + intro: 10M+ parts, 5,000 manufacturers, 15-min response, email BOM; "We won't share your info"). 3. **RFQ form** — Left "part details" (Mfg Part No.* · Manufacturer* · Quantity* · Need Parts By* · Target Price); Right "Contact Information" (Contact Name* · Company Name* · Company Type* · Phone* · Email* · Comments); Consent block (T&C checkbox + bullets + disclaimer, CAGE 6RE77) → Submit. 4. **BOM upload banner** (multi-part path). 5. Sidebar (military flag panel · Browse by Categories · Why Choose Us). 6. Certs. 7. Pledge.

**Architecture / flow:** Two tracks — single-part RFQ (form) + multi-part BOM upload (banner). The conversion endpoint the whole site funnels toward.

**Issues & enhancements:** **UI glitch: stray red 👎 icon by Part Number field → remove** · **Empty "Browse by Categories" panel → populate/remove** · ~9 required fields on the most important page → streamline / two-step · Placeholder-as-label → persistent labels · Heavy legal wall → condense/collapsible · **No success state → add "we'll respond in 15 min" confirmation + reference #** · BOM upload buried → elevate single vs. BOM as equal entry points · Unify inline quick-quotes with full RFQ · **Keep** 15-min promise, "won't share info", military/trust sidebar.

### Page 6 — Blog Post (single article)  (`/blog/{slug}/`)

Child of Blog listing. **Unique:** 1. Breadcrumb (Home / Blog / Title). 2. Two-column: **Main** = H1 title · meta (date · author) · long-form body (H2/H3 subheads, bold bullet lead-ins, inline links back to inventory) · closing CTA · share buttons (FB/X/LinkedIn) · "Related Blogs"; **Sidebar** = same as listing. 3. Certs. 4. Pledge.

**Architecture / flow:** Long-form article + discovery sidebar. Copy links back to inventory (SEO → core actions).

**Issues & enhancements:** **"Related Blogs" appears empty → populate/remove** · "FIND PARTS" label again → reinforces one-search-label fix · No hero image / reading aids → add featured image, read-time, TOC · No author bio; dated X icon → add author block, refresh icons · Only text-link CTAs → add distinct Search/RFQ callout inside article · **Keep** clean content structure + inventory-linking CTA.

### Page 7 — Category: Board Level Components (Directory templates)  (`/electronic/…`)

Category exposes **two directory axes** — By Part Type + By Manufacturer — each an A–Z index.

**7a — Part Type directory:** intro + SEO copy + A–Z range bar (0-9/A-E/F-J/K-O/P-T/U-Z + View All) + per-letter header blocks with multi-column part-type links + sidebar (Send Instant RFQ · Browse by Categories · Top Searched Electronic Manufacturers · Mostly Purchased Electronic Components · Why Choose Us).
**7b — Manufacturer directory:** intro + "Search by Manufacturer Name" box + A–Z pills + per-letter manufacturer link grid + same sidebar.

**Architecture / flow:** Category → axis (Part Type | Manufacturer) → A–Z index → parts listing → part detail → RFQ. Directories are SEO surfaces AND navigation.

**Issues & enhancements:** Overwhelming A–Z link walls → search-first (typeahead, collapsed/lazy sections) · Inconsistent search (manufacturer dir has box, part-type doesn't) → add to both · "Browse by Categories" populated here but empty on RFQ page → standardize · Mobile pain with dense grids → responsive · A11y (sea of low-contrast links) → contrast/focus · **Keep** dual axes, sidebar RFQ, Top Searched/Mostly Purchased panels.

### Page 8 — Category: NSN Parts (6 directory axes)  (`/nsn/…`)

Largest hub — **six** directory sub-pages, all reusing the directory-template family + shared RFQ sidebar (Top Searched NSN Manufacturers / Mostly Purchased NSN Components):
1. **Parts By NIIN** — numeric index 0–9 → "NIIN start by N" blocks. 2. **Parts By FSC** — dense FSG/FSC code table (code · desc · count). 3. **Parts By NSN** — numeric index 1–9 → "NSN start by N" blocks. 4. **Manufacturers** — A–Z directory + search. 5. **Cage Code** — paginated table (CAGE · Manufacturer), ~548 pages. 6. **Part Types** — A–Z directory.

**Architecture / flow:** Hub → 1 of 6 axes → index/search → listing → part detail → RFQ. Primarily SEO surfaces (millions of permutations).

**Issues & enhancements:** Extreme SEO number/link walls → **Search primary**, keep as secondary SEO (search-first, collapsed/lazy, in-table filtering) · 6 near-identical pages → guided chooser → one searchable results view · Heavy tables (FSC/CAGE) → modern data-table (sort/filter/sticky/responsive) · Mobile reflow · Unify with directory family into ONE template system · **Keep** rich multi-axis IA + RFQ sidebar.

### Page 9 — Category: Aviation Parts (4 axes, incl. product-family sub-catalogs)  (`/aviation/…`)

Adds **curated product-family sub-catalogs** (Bearing, Fasteners) — A–Z part-type directories pre-scoped to a family — alongside generic Part Types + Manufacturers:
1. **Aviation Part Types** (A–Z). 2. **Bearings** (A–Z, family-scoped). 3. **Fastener** (A–Z, family-scoped; intro offers online RFQ + contact routes). 4. **Manufacturers** (A–Z + search).

**Contextual sidebar:** "Top Searched Aviation Manufacturers" + "Mostly Purchased … Components" adapt by category/family (e.g., "Mostly Purchased Bearings Components").

**Issues & enhancements:** Same directory-family issues (resolved by unified template) · Product-family sub-catalogs are a strong idea buried as plain A–Z lists → elevate as visual browsable entry points · **Keep & systematize** contextual sidebar panels + dual quote routes.

### Page 10 — Category: Standard Parts (items are DIRECT LISTING pages) + Parts-Listing template

**Variation:** Standard Parts' dropdown items are **direct parts-listing (results table) pages**, not directories. First look at the **Parts-Listing template** — the results view the catalog funnels into.
Items (each a listing): **BAC Standard** (~2,597 pp) · **MS Standard** (~11,743 pp) · **AS Standard** (~1,302 pp) · **NAS Standard** (~4,083 pp).

**★ Parts-Listing (results table) template:** intro + pagination (top & bottom) + results table [**Part No.** (link) · **Manufacturer** · **QTY** ("Avl") · **RFQ** (per-row red button)] + sidebar (Send Instant RFQ + Why Choose Us) + shared certs/pledge/footer. **Per-row RFQ button = the direct browse→quote bridge.**

**Issues & enhancements:** **Possible duplication bug (BAC page renders intro+table twice) → verify/fix** · Massive pagination, no filter/sort → search-first + in-table filter/sort/sticky/lazy · "QTY=Avl" always → show real availability · Many "Others" manufacturers (data quality) · Sidebar inconsistency (listing vs directory) → standardize · Mobile → responsive cards · Enhance per-row RFQ → multi-select → batch/BOM RFQ · **Keep** table shape + per-row RFQ.

### Page 11 — Category: Electrical Connectors (2 axes — directory template)  (`/connector/…`)

Clean repeat of the directory template: 1. **Connectors Manufacturers** (A–Z + search). 2. **Connector Types** (A–Z). Contextual sidebar (Top Searched Connector Manufacturers / Mostly Purchased Connector Components). No new patterns; same directory-family issues/enhancements.

### Page 12 — Category: Featured Parts (ENHANCED LISTING pages)

Direct listings (like Standard Parts) with an **enhanced table** (Description + context column). = the Home page's "Featured Aviation Parts" cards:
1. **Aircraft Windows Parts** — Part No · Manufacturer · **Description** · Aircraft Model · QTY · RFQ.
2. **Aircraft Engine Parts** — Part No · Manufacturer · **Description** · Engine No · QTY · RFQ.
3. **Aircraft Instruments & Avionic Parts** — Part No · Manufacturer · **Description** · QTY · RFQ.
Fuller sidebar than Standard Parts listings.

**Issues & enhancements:** Listing variants inconsistent (bare vs enhanced, simple vs fuller sidebar) → **ONE unified, configurable listing template** · Description + context column is a clear win → make it the standard listing shape · Same core listing issues (Page 10) · **Keep** enhanced table + per-row RFQ.

### Page 13 — "Search results" = pre-filled RFQ  (`/rfq/searchrfq?partno=…`)  ★ CORE FEATURE INSIGHT

**Major finding:** the header search does **NOT** return a results list — searching a part number routes **directly to a pre-filled RFQ form** for that part. **Search + RFQ are fused** into one flow.
Template = Instant RFQ form (Page 5) with Part Number pre-populated; breadcrumb Home / Search RFQ Form / {P/N}; heading "Searched Part Number {P/N} – Get a Quote Online" + "Alternate P/N:" line; same form + BOM banner + sidebar + shared modules.

**Issues & enhancements:** Search-to-RFQ fusion skips discovery → consider optional lightweight results/alternates step ("did you mean / alternate P/Ns") without adding friction · Same RFQ-form issues as Page 5 (fix once in unified RFQ component) · **Keep** the instant search→quote flow — this IS the product; make it fast, trustworthy, mobile-first.

### Page 14 — Part Detail page  (`/{category}/quote/{manufacturer}/{part-no}/`)

What a Part No. link opens (e.g., `/aviation/quote/the-boeing-company/bac-c50c-19a/`). A **part-specific quote landing**; **no RFQ sidebar** (full-width):
1. Breadcrumb (Home / Category / Manufacturer / Part No.). 2. Part header ("… Part number {P/N} by {Manufacturer} | Submit a Quote" · Part Number · Alternate P/N · Manufacturer link · Last Updated · stock-status sentence). 3. **Compact 4-field RFQ form** (Mfg Part No.* prefilled · Manufacturer* prefilled · Contact Name* · Email* → Submit). 4. BOM upload banner. 5. Descriptive paragraph. 6. **"Related {Category} Parts Of {P/N}"** cross-link grid (Part No · Description · NSN · Manufacturer/CAGE). 7. Certs/pledge/footer.

**Issues & enhancements:** **Data bug: stock-status sentence shows wrong part number ("DS0-5-49") + empty part type (unrendered template variable) → fix binding** · **Literal "CAGE Code NULL" / "NO DESCRIPTION AVAILABLE" shown → suppress NULLs** · Three different RFQ-form lengths sitewide → unify into ONE component with context-appropriate field sets · Thin part data → enrich (specs/NSN/CAGE/alternates/availability) · **Keep** Last-Updated, Alternate P/N, manufacturer link, Related Parts grid, compact prefilled form.

---

## Whole-Site Sitemap

### A. Global shell (every page)
- **Header:** logo · universal **Search** (Part No./NSN + type dropdown) · contact (email/phone) · **category dropdown nav** · **INSTANT RFQ** button.
- **Breadcrumb** (interior pages).
- **Footer:** Get In Touch · "How Are We Doing?" survey · Company Information · Policies · Terms & Conditions · Quick Links · Payments · Social · Download Browser Extension · U.S.A. compliance ribbon · legal disclaimer.
- **Reusable modules:** Certifications & Memberships · No China Sourcing / Fallen Heroes pledge · RFQ sidebar (contextual "Top Searched / Mostly Purchased" panels + "Why Choose Us").
- **Overlays:** cookie consent banner · live chat widget.

### B. Top-level pages
```
Home (/)
├─ About Us (/about-us/)
├─ Contact Us (/contact-us/)              [form + address + map]
├─ Blog (/blog/)                          [listing → paginated]
│   └─ Blog Post (/blog/{slug}/)          [single article + related + share]
└─ Instant RFQ (/straightrfq/)  ★ CORE    [single-part RFQ + BOM upload]
```

### C. Catalog categories (header dropdowns — NO category landing page; items are the pages)
```
Board Level Components ▾
├─ Electronic — Part Types      [Directory: A–Z index]
└─ Manufacturers                [Directory: A–Z index + search]

NSN Parts ▾
├─ Parts By NIIN                [Directory: numeric index 0–9]
├─ Parts By FSC                 [Table: FSG/FSC codes]
├─ Parts By NSN                 [Directory: numeric index 1–9]
├─ Manufacturers                [Directory: A–Z + search]
├─ Cage Code                    [Table: CAGE → Manufacturer, paginated]
└─ Part Types                   [Directory: A–Z index]

Aviation Parts ▾
├─ Aviation Part Types          [Directory: A–Z index]
├─ Bearings                     [Directory: A–Z, product-family-scoped]
├─ Fastener                     [Directory: A–Z, product-family-scoped]
└─ Manufacturers                [Directory: A–Z + search]

Standard Parts ▾   (items = direct LISTING tables)
├─ BAC Standard  ├─ MS Standard  ├─ AS Standard  └─ NAS Standard

Electrical Connectors ▾
├─ Connectors Manufacturers     [Directory: A–Z + search]
└─ Connector Types              [Directory: A–Z index]

Featured Parts ▾   (items = ENHANCED LISTING tables; mirrored on Home)
├─ Aircraft Windows Parts  ├─ Aircraft Engine Parts  └─ Aircraft Instruments & Avionic Parts
```

### D. Core catalog + conversion flows
```
Directory (A–Z index)  ──►  Parts-Listing (results table)  ──►  Part Detail (/{cat}/quote/{mfr}/{p-n}/)  ──►  RFQ submit
Header Search (any page)  ─────────────────────────────────►  Pre-filled RFQ (/rfq/searchrfq?partno=…)   ──►  RFQ submit
INSTANT RFQ button  ───────────────────────────────────────►  Instant RFQ (/straightrfq/) + BOM upload   ──►  RFQ submit
```
Search and RFQ are **fused**: searching a part → a pre-filled quote form (no separate results list). RFQ is reachable from every page (button, sidebar form, inline quick-quote, per-row RFQ, part-detail form).

### E. Footer / utility pages (linked sitewide; not individually blueprinted)
Quality · Sitemap (+ XML) · Privacy Policy · Cookie Policy · Conflict Minerals Policy · Combating Human Trafficking Policy · Customer Terms & Conditions · Supplier Terms & Conditions · FAR & DFARS Flow Downs · Consignment Options · Customer Survey.

### F. Reusable template inventory (what we actually build)
1. **Global shell** (header + breadcrumb + footer + overlays).
2. **Home**.
3. **Content page** (About Us; also fits utility/legal pages).
4. **Contact** (form + address + map).
5. **Blog listing** + **Blog post** (with discovery sidebar).
6. **Directory (A–Z / numeric index)** — one configurable template (link-grid + big-table variants: NIIN/NSN/FSC/CAGE).
7. **Parts-Listing (results table)** — one configurable template (bare + enhanced/Description variants; configurable columns + sidebar).
8. **Part Detail** (metadata + compact RFQ + related parts).
9. **RFQ form** — ONE unified component with variants: full (Instant RFQ) · pre-filled (search) · compact (part detail) · BOM upload.
10. **Shared modules:** Certifications · Pledge · RFQ sidebar (contextual) · Cookie banner · Chat.

### G. Cross-cutting redesign principles (carry into the build)
- **Search + RFQ are the product** — make both effortless, prominent, consistent, mobile-first on every page.
- **Unify the sprawling templates** (directories, listings, RFQ forms) into the configurable set above.
- **Search-first over A–Z link walls** — keep massive directories/tables for SEO but demote them behind prominent search/filter.
- **Fix the catalogued live bugs:** About-Us stray `}` · Contact email mismatch · search button label ("SEARCH" vs "FIND PARTS") · RFQ stray 👎 icon · empty "Browse by Categories" panel · Standard-Parts duplication · Part-Detail wrong-part-number/empty-type binding · literal "CAGE Code NULL" / "NO DESCRIPTION AVAILABLE".
- **Consistency + a11y + responsiveness** across the system (labels not placeholders, contrast, focus states, table/grid reflow).
- **Consider adding category landing pages** (currently none) to improve browse, SEO, and the Search/RFQ funnel.
- **Modernize the visual language** to an aerospace-grade, credible look using the on-hand asset folders.

---

## Build Decisions (approved)

| Decision | Choice |
|----------|--------|
| **Stack** | Next.js (App Router) + React + **TypeScript** + **Tailwind CSS** |
| **Project location** | `Desktop/ASAP Components/` |
| **Model** | RFQ / lead-gen (no public pricing or checkout) |
| **Build scope** | **All templates at once** — scaffold every page type / template in one pass |
| **Visual direction** | **Modernize existing brand** — keep the red/navy aerospace identity, logo equity, and trust cues; clean, modern, credible UI |
| **Data** | **Mock / sample data** — representative placeholder parts, manufacturers, blog posts; RFQ/contact forms stubbed with a success state; wire real data later |

**Baseline build target:** Next.js + React implementing templates F1–F10 and flows D, wired to the global shell A, using mock data and the modernized brand system.
