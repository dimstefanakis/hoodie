# Hoodie - Demand Validation Project

## Project Overview
This project is a **Single-Product Demand & Price Validation** landing page for the "Comfort Cloak Hoodie" (EU market). 
The goal is to validate demand and price elasticity before building a full commerce stack. 

**Status:** Draft (Engineer-ready)
**Tech Stack:**
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Library:** shadcn/ui (`new-york` style)
- **Icons:** Lucide React
- **Package Manager:** Bun

## Key Objectives (from PRD)
1.  **Validate Demand:** Measure conversion rate on "Buy Now" clicks.
2.  **Price Testing:** Test 3 price variants (€129, €149, €169) via URL parameters (e.g., `?price=129`).
3.  **Lead Capture:** "Buy Now" triggers an email capture modal (no payment processing).
4.  **Transparency:** Post-submit message must clarify that the product is not yet available.

## Architecture & Structure
The project follows a standard Next.js App Router structure with shadcn/ui conventions.

- `src/app/`: App Router pages and layouts.
- `src/components/`: React components (UI and custom).
- `src/lib/utils.ts`: Utility functions (contains `cn` class merger).
- `public/`: Static assets.

### Aliases
- `@/components` -> `src/components`
- `@/lib` -> `src/lib`
- `@/utils` -> `src/lib/utils`
- `@/hooks` -> `src/hooks`

## Building and Running

This project uses **Bun**.

### Install Dependencies
```bash
bun install
```

### Development Server
```bash
bun dev
```
Access at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
bun run build
bun start
```

### Linting
```bash
bun run lint
```

## Configuration Files
- **`PRD.md`**: Product Requirements Document. Contains logic for price variants, funnel flow, and data requirements.
- **`COPY.md`**: Approved copy for the landing page (headlines, benefits, FAQ).
- **`DESIGN.md`**: Design philosophy and aesthetic direction.
- **`components.json`**: shadcn/ui configuration.
- **`tailwind.config.ts`**: Tailwind CSS configuration (merged with Next.js config).

## Development Conventions
- **Styling:** Use Tailwind CSS utility classes. Use `cn()` from `@/lib/utils` to merge classes conditionally.
- **Components:** favor small, composable components. Place reusable UI components in `src/components/ui`.
- **State:** Keep state local where possible.
- **Data:** This is a frontend-heavy validation prototype. Backend interaction is limited to lead capture (`POST /api/leads`).

## Experiment Details (Price Variants)
Price is determined by the URL parameter `price`.
- **Variant A:** `?price=129`
- **Variant B:** `?price=149`
- **Variant C:** `?price=169`

*Refer to `PRD.md` for full experiment logic.*
