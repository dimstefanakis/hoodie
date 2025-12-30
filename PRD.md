# PRD — Single‑Product Demand + Price Validation (EU)  
Product: **Comfort Cloak Hoodie** (Eden‑style hoodie‑blanket / cloak)

Owner: Growth  
Audience: EU consumers (DTC)  
Status: Draft (engineer‑ready)  
Last updated: 2025-12-30

---

## 1) Goal
Validate **EU demand** and **price elasticity** for a single hero product *before* building the full commerce stack.

We will run paid ads to a landing page that:
- Shows the product and a price (A/B by variant).
- Uses a strong CTA (“Buy now”) that leads to an **email capture** (no payment).
- After email submission, communicates **truthfully** that the product is not available today and that we’ll notify them at launch/restock.

### Success definition
Within a fixed budget window, we can confidently answer:
- **Is there enough demand at €X?**
- **Which price point maximizes high‑intent leads (quality) vs volume (CPL)?**
- **Which countries/segments respond best?**

---

## 2) Non‑Goals
- Taking payments / processing orders
- Inventory / fulfillment integration
- Complex personalization or multi‑product catalog
- Retargeting that requires non‑essential cookies (we’ll keep tracking minimal)

---

## 4) Hypotheses
H1: The comfort‑cloak concept can achieve **>= 10% lead conversion** on landing page at one of the tested price points.  
H2: There exists a price point where **high‑intent leads** remain strong (little drop in conversion vs cheaper price).  
H3: Certain EU markets (e.g., DE/FR/IT/ES/NL/SE) will show materially better CPL or higher intent.

---

## 5) Experiment Design

### 5.1 Price variants (A/B/C)
Use 3 variants to map elasticity quickly:
- Variant A: **€129**
- Variant B: **€149**
- Variant C: **€169**

> Note: If you’re set on €150, use **€139 / €149 / €159** instead.  
> Engineer: make variants configurable via env or CMS.

### 5.2 Variant assignment (no cookies needed)
**Preferred**: assign price by URL so the ad set determines the variant.
- /p/cloak?price=129&v=A
- /p/cloak?price=149&v=B
- /p/cloak?price=169&v=C

This avoids needing an A/B assignment cookie.

### 5.3 Funnel + events
**Funnel**
1) Ad click → Landing (price variant shown)
2) User clicks **Buy now**
3) Email capture modal/page (plus opt‑in checkbox)
4) Confirmation screen (pre‑launch / restock messaging + next step)
5) Optional: 1‑question “Would you buy at this price?” (post‑submit)

**Track these events (server‑side where possible)**
- `page_view` (variant, country, utm)
- `buy_click` (variant)
- `lead_submit` (variant, email, consent flag)
- `price_intent` (optional: would_buy = yes/no or price threshold choice)

---

## 6) User Stories
- As a visitor, I want to understand what this is in <10 seconds, so I can decide if it’s for me.
- As a visitor, I want to see the price clearly before I “buy.”
- As a visitor, I want to submit my email and immediately know what happens next (no surprises).
- As the business, I want to compare demand across prices and countries reliably.

---

## 7) User Experience Requirements

### 7.1 Landing page (high level)
- Hero section (image/video), headline, 3 benefit bullets
- Price display (from `price` param or variant)
- CTA button: **Buy now**
- Short trust section: materials, warmth, pockets/fit, easy care
- FAQ (shipping timing, sizing, what happens after email)

### 7.2 “Buy now” click behavior
On click:
- Open modal or dedicated step: “Reserve first access”
- Explain: **No payment today** (microcopy)
- Email input + marketing consent checkbox (unticked)
- Submit button: “Notify me when it’s available”

### 7.3 Post‑submit confirmation screen (truthful scarcity framing)
Copy must not be “fake sold out.” Use one of:
- “**First drop is not available today** — we’ll email you when the next batch opens.”
- “**Limited first batch is already allocated** — join the priority list.”

This gives strong intent signal without misleading the user.

---

## 8) Data + Privacy Requirements

### 8.1 Data minimization
Store only what we need for the experiment:
- email
- `consent_marketing` boolean
- `variant` / `price`
- country (from locale selector or server geo; if unavailable, store “unknown”)
- utm_source / utm_campaign / utm_content
- created_at timestamp
- optional: `intent_answer`

---

## 9) Technical Requirements

### 9.1 Stack
- Next.js (App Router)
- DB: Postgres (Supabase or managed)
- Email provider: Resend / Brevo / Mailgun (any; engineer choice)

### 9.2 Endpoints
- `POST /api/leads`
  - body: { email, consent_marketing, variant, price, utm, country, intent_answer? }
  - validate email, normalize lowercase, reject obvious bots
  - respond: { ok: true }
- Optional: `GET /api/stats` (protected) for dashboard

### 9.3 Anti‑spam / abuse
- Honeypot hidden field
- Rate limit by IP (store a short‑lived hash; avoid storing raw IP long‑term)
- Basic bot detection (user agent + time‑to‑submit threshold)

### 9.4 Localization
- Start with English.
- Add language switch later (DE/FR/IT/ES) if ads expand.

---

## 10) Analytics / Reporting
We need a simple view by:
- variant (price)
- country
- ad set / campaign (from UTM)
- device

Core metrics:
- CTR (from ad platform)
- Landing → Buy click rate
- Buy click → Lead submit rate
- Overall lead conversion rate
- CPL (from ad platform spend / leads)

---

## 11) Launch Plan (Experiment)
1) Create 3 ad sets per target country (one per price URL).
2) Run for 7–14 days or until each variant hits a minimum lead count.
3) Declare winner based on:
   - lead conversion rate and CPL
   - intent answer rate (if implemented)
   - qualitative: comments/DM feedback

Stop conditions:
- If CTR < 0.8% across all creatives after iteration → revise creative/offer.
- If lead conversion < 5% consistently → revise landing copy/positioning.
- If highest price performs within 80–90% of lower price conversion → keep higher price.

---

## 12) Open Questions (engineer can proceed with defaults)
- Do we implement the optional post‑submit intent question? No
- Do we implement consent banner now? No
