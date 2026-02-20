# UI/UX Assessment — md-dex

**Assessment Date:** 2026-02-20
**Frontend:** React 18 + Vite + Ant Design (dark theme)
**Viewport:** 1440×900

---

## Screenshots Summary

| Page | Route | Status |
|------|-------|--------|
| Swap (Home) | `/swap` | Renders correctly |
| Liquidity | `/liquidity` | Renders correctly |
| Pool | `/pool` | Renders with API errors |
| Portfolio | `/portfolio` | Renders (wallet-gated) |
| History | `/history` | Renders (wallet-gated) |
| Farms | `/farms` | Renders with API errors |
| My Farms | `/farms/me` | Renders (wallet-gated) |
| Orders | `/orders` | **Blank page — route not registered** |
| Trading | `/trading` | **White blank — route not registered** |

Screenshots are in the `screenshots/` directory.

---

## Critical Bugs

### 1. Orders & Trading pages are unreachable

`App.tsx` never registers `/orders` or `/trading` routes. The component files exist under
`src/pages/Orders/` and `src/pages/Trading/` but are dead code. Visiting the URLs renders nothing
(Orders shows a dark empty layout; Trading renders a completely white blank).

### 2. HTTP 500 errors displayed as toast spam

Pool and Farms pages fire multiple simultaneous API requests to the backend analytics service, all
of which fail with HTTP 500 (backend not running / database not configured). Ant Design's `message`
or notification API fires three separate error toasts that stack on screen with no auto-dismiss
grouping or retry affordance. Users see raw error strings like `"Request failed with status code 500"`
— not a friendly degraded state.

### 3. Farms page shows duplicate error

`"加载挖矿池失败"` (Failed to load mining pool) appears both as a toast notification and as inline
text on the page simultaneously — duplicating the error signal for the same root cause.

---

## Language / Localisation Issues

### 4. Mixed Chinese / English throughout

The nav bar labels are in English (`Swap`, `Liquidity`, `Pool`, `Farms`, `History`, `Portfolio`).
Page headers, form labels, and CTA buttons are entirely in Chinese (`代币交换`, `你支付`, `选择代币`,
`连接钱包以开始交易`). The Orders page (if routed) uses full English. The Farms guide section
mixes both.

**Recommendation:** Pick one language and apply it everywhere. If the target audience is Chinese,
localise the nav. If it's international, translate the page content.

---

## Design & Visual Issues

### 5. Swap header stats display `$-` instead of `$0`

The 24h volume and liquidity stats in the green banner show a raw `$-` placeholder. Should display
`$0.00` or `—` with a tooltip explaining data is unavailable.

### 6. Portfolio and History — excessive dead space

When the wallet is not connected, both pages render only a tiny centred card/message in the upper
portion, leaving ~70% of the page completely empty. A proper empty state should fill the viewport
better, with a CTA to connect a wallet or an illustration and short description of what the page offers.

### 7. My Farms empty state is too minimal

Shows only an icon + two lines of text. No CTA to navigate to Farms to start staking, no explanation
of what yield farming is.

### 8. Pool page info block is very dense

The "What is a liquidity pool" section uses a bulleted list of raw formulas (`x × y = k`) without
visual hierarchy. For a general user audience this is intimidating. Consider collapsing it behind a
disclosure or adding visual aids.

### 9. Liquidity page layout issue

The `+` icon between the two token selectors floats to the right of the first token selector rather
than being centered between both inputs, making the layout look misaligned.

### 10. Farms has no filter controls

Only a sort-by APR dropdown exists. Common DEX farms UX includes filters for: active/inactive,
my farms, token pair. The single search field is the only discovery affordance.

---

## Navigation & Information Architecture

### 11. Orders and Trading have no nav links

Even if the routes were registered, neither page appears in the nav bar. Users would have no way
to discover them. The nav should include these entries or consolidate them under a "Trade" dropdown.

### 12. No active route highlighting on sub-paths

The "Farms" nav item does not highlight when on `/farms/me`, only on `/farms`. Active-state logic
does not account for child routes.

### 13. No 404 / catch-all route

Unregistered paths (e.g., `/orders`, `/trading`, `/xyz`) render the Layout shell with a completely
empty dark body. There is no 404 page or redirect.

### 14. DEX logo is not a home link

The top-left logo does not navigate to `/` or `/swap` on click — a standard web convention that
is missing.

---

## Positive Observations

- Dark theme is well-executed: navy background, green primary accent (`#00b96b`), consistent.
- Swap card has good visual hierarchy: amount field, direction toggle, receive field, slippage control.
- Slippage setting (0.5%) is surfaced inline — good discoverability.
- History page empty state uses a nice custom illustration icon.
- Farms page includes a "How to participate" guide — good for onboarding.
- "Connect Wallet" button is always visible top-right with high contrast.
- Ant Design dark algorithm provides a polished, consistent component styling baseline.

---

## Priority Fix List

| Priority | Issue |
|----------|-------|
| P0 | Register `/orders` and `/trading` routes in `App.tsx` |
| P0 | Add nav links for Orders and Trading |
| P0 | Handle backend API failures gracefully (single consolidated error state + retry) |
| P1 | Unify language to either full Chinese or full English |
| P1 | Add a 404 catch-all route |
| P1 | Fix `$-` placeholder in Swap header stats |
| P2 | Improve empty states for Portfolio, History, My Farms with CTAs |
| P2 | Fix active nav highlighting for child routes (`/farms/me`) |
| P2 | Make DEX logo link to home |
| P3 | Add filters to Farms search |
| P3 | Improve Pool info section readability |
