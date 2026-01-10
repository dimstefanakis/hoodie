# PRD: High-Fidelity Validation Flow ("The Cloak")

## 1. Project Overview

**Goal:** Validate high-intent demand for "The Cloak" at a €149 price point using a "Fake Door" strategy.
**Mechanism:** Users experience a fully functional e-commerce flow (Product Page → Add to Cart → Checkout). The checkout process is interrupted by a "Batch Allocated" modal, pivoting the user to a €1 reservation via a Stripe Link.
**Primary Metric:** `InitiateCheckout` events (clicks on the "Checkout" button in the cart drawer).

## 2. Tech Stack & Dependencies

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (Sheet, Dialog, Button, Badge, Skeleton, Separator)
- **Icons:** Lucide React
- **State Management:** Zustand
- **Analytics:** Facebook Pixel (Meta CAPI optional but recommended)
- **Payments:** Stripe Payment Link (External)

## 3. Global State (Zustand Store)

Create a store `useStore` with the following slices:

### A. Cart State

- `items`: Array of objects `{ id, name, size, price, image }`.
- `addItem(item)`: Adds item to array, opens Cart Drawer.
- `removeItem(id)`: Removes item.
- `cartTotal`: Derived value (always €149 for this MVP).

### B. UI State

- `isCartOpen`: Boolean (Controls shadcn Sheet).
- `isModalOpen`: Boolean (Controls shadcn Dialog).
- `isLoadingCheckout`: Boolean (For the spinner effect).
- `setCartOpen(bool)`: Toggles drawer.
- `setModalOpen(bool)`: Toggles modal.

### C. Social Proof State

- `activeShoppers`: Number.
- `fetchShoppers()`: GET request to API.
- `incrementShoppers()`: POST request to API.

## 4. Backend Logic (The "Live" Counter)

**File:** `src/data/cart-stats.json`
**Content:** `{ "count": 12 }`

**API Route:** `/api/stats`

1. **GET:** Reads `cart-stats.json` and returns the count.
2. **POST:**
   - Reads the file.
   - Increments count by 1.
   - **Logic:** If count > 25, reset to 12 (to maintain realism and prevent inflation).
   - Writes to file.
   - Returns new count.

## 5. Page Architecture & User Flow

### A. Product Page (`/`)

**Layout:**

- **Mobile:** Image Carousel (Swipeable) → Details → Sticky "Add to Cart" Bar.
- **Desktop:** Split view. Left side = 2x2 Grid of images. Right side = Sticky Product Details.

**Key Elements:**

1. **Header:** Minimal logo (Left), Cart Icon with `items.length` Badge (Right).
2. **Live Counter:** Text component: "🔥 `{activeShoppers}` people have this in their cart." (Fetches on mount).
3. **Images:** 3-4 high-quality placeholders showing texture/drape.
4. **Size Selector:**
   - Radio Group: [S/M] [L/XL].
   - **Validation:** "Add to Cart" is disabled or shakes if no size selected.
5. **"Add to Cart" Button:**
   - **Action:**
     - Triggers FB Pixel: `AddToCart`.
     - Calls `incrementShoppers()` (API).
     - Adds item to Zustand store.
     - Opens **Cart Drawer**.

### B. Cart Drawer (The "Fake" Checkout)

**Component:** `Sheet` (from shadcn).
**Content:**

- Header: "Shopping Cart".
- Item Row: Image thumbnail, "The Cloak", Size, Price (€149).
- Footer:
  - Subtotal: €149
  - Shipping: "Calculated at next step" (or "Free").
  - **CTA Button:** "Checkout" (Black, full width).

**Logic (The Trap):**

- **On Click "Checkout":**
  1. Fire FB Pixel: `InitiateCheckout` (Crucial).
  2. Set `isLoadingCheckout` to true (show spinner on button).
  3. Wait 800ms.
  4. Set `setCartOpen(false)`.
  5. Set `setModalOpen(true)`.

### C. The "Stock Alert" Modal

**Component:** `Dialog` (from shadcn).
**Trigger:** Automatically opens after Cart Drawer closes.
**Content:**

- **Title:** "Secure Early Access" / "Batch Allocated"
- **Body:** "The Cloak launches soon at **€149**. Avoid the public waitlist and secure your allocation now for just **€1 (refundable)**."
- **CTA Button:** "Reserve Spot for €1".
- **Action:** Redirects to Stripe Payment Link.
- **Tracking:** Fire `Lead` event here (optional, to double verify).

## 6. Analytics & Events Strategy

We will use a custom hook or utility `trackEvent` to handle Pixel firing.

| User Action | Event Name | Data Payload |
| --- | --- | --- |
| Page Load | `ViewContent` | `{ content_name: 'The Cloak', value: 149, currency: 'EUR' }` |
| Select Size | `CustomizeProduct` | `{ variant: 'L/XL' }` |
| Click "Add to Cart" | `AddToCart` | `{ value: 149, currency: 'EUR' }` |
| **Click "Checkout"** | **`InitiateCheckout`** | **`{ value: 149, currency: 'EUR' }` (Primary KPI)** |
| Click "Reserve €1" | `Lead` | `{ value: 1, currency: 'EUR' }` |

## 7. Implementation Steps

1. **Scaffold:** `npx create-next-app@latest` (TS, Tailwind, App Router).
2. **Install:** `npx shadcn@latest init` → add `sheet`, `dialog`, `button`, `radio-group`.
3. **Setup Zustand:** Create `src/store/index.ts`.
4. **Backend:** Create `src/app/api/stats/route.ts` and `src/data/cart-stats.json`.
5. **Components:** Build `ProductGallery`, `ProductInfo`, `CartDrawer`, `ReservationModal`.
6. **Integration:** Wire up the "Add to Cart" → "Drawer" → "Modal" flow.
7. **Analytics:** Add `<Script>` for FB Pixel in `layout.tsx`.

## 8. Copy Reference (Context)

**Product Title:** The Cloak
**Price:** €149
**Description:**

> "Not a blanket. A garment. Engineered from 450gsm heavyweight French Terry. The Cloak drapes with intention, providing the warmth of a duvet with the silhouette of modern streetwear. Deep pitch black. Anti-lint interior."

**Stock Alert Message:**

> "Batch 1 is strictly limited. The Cloak launches soon at €149. Avoid the public waitlist and secure your allocation now for just €1 (refundable)."
