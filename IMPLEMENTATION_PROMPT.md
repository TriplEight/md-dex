# Fix & Redesign Prompt for Claude Sonnet 4.6

You are working on a DEX (Decentralised Exchange) frontend located at
`/home/user/md-dex/frontend/web-app/`. The app is built with React 18 + TypeScript + Vite +
Ant Design 6 dark theme + Wagmi 3 + React Router 7.

Your task has two parts: **fix all functional bugs** and **replace the visual design** with
something distinctive and non-generic.

Develop all changes on branch `claude/test-ui-ux-assessment-oHWs7`, commit, and push when done.

---

## PART 1 — Bug Fixes

Work through each fix in order. Commit after each logical group.

---

### Fix 1 — Register missing routes and add nav links

**File:** `frontend/web-app/src/App.tsx`

The component files `src/pages/Orders/index.tsx` and `src/pages/Trading/index.tsx` exist but are
never imported or routed. Add them:

```tsx
import OrdersPage from './pages/Orders'
import TradingPage from './pages/Trading'
```

Add routes inside `<Routes>`:
```tsx
<Route path="/orders" element={<OrdersPage />} />
<Route path="/trading" element={<TradingPage />} />
```

**File:** `frontend/web-app/src/components/Layout/index.tsx`

Add two new nav items to `menuItems` (import `LineChartOutlined` and `OrderedListOutlined`
from `@ant-design/icons`):

```tsx
{
  key: '/trading',
  icon: <LineChartOutlined />,
  label: <Link to="/trading">Trade</Link>,
},
{
  key: '/orders',
  icon: <OrderedListOutlined />,
  label: <Link to="/orders">Orders</Link>,
},
```

Insert them between `Swap` and `Liquidity`.

---

### Fix 2 — Fix active nav highlighting for child routes

**File:** `frontend/web-app/src/components/Layout/index.tsx`

Replace the static `selectedKeys={[location.pathname]}` with logic that also matches child paths:

```tsx
const selectedKey = (() => {
  const path = location.pathname
  if (path.startsWith('/farms')) return '/farms'
  if (path.startsWith('/pool')) return '/pool'
  if (path.startsWith('/trading')) return '/trading'
  if (path.startsWith('/orders')) return '/orders'
  return path
})()
```

Then use `selectedKeys={[selectedKey]}`.

---

### Fix 3 — Make the logo a home link

**File:** `frontend/web-app/src/components/Layout/index.tsx`

Wrap the logo `<div>` in a `<Link to="/swap">`:

```tsx
<Link to="/swap" style={{ textDecoration: 'none' }}>
  <div className="logo">
    {/* logo content */}
  </div>
</Link>
```

---

### Fix 4 — Add a 404 catch-all route

**File:** `frontend/web-app/src/App.tsx`

Add as the last `<Route>` inside `<Routes>`:

```tsx
<Route path="*" element={
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', minHeight: '60vh', gap: 16
  }}>
    <span style={{ fontSize: 72, opacity: 0.15 }}>404</span>
    <p style={{ color: 'rgba(255,255,255,0.45)' }}>Page not found</p>
    <a href="/swap">Go to Swap →</a>
  </div>
} />
```

---

### Fix 5 — Fix $- placeholder in Swap header stats

**File:** `frontend/web-app/src/pages/Swap/index.tsx`

Find where `24h 交易量` and `流动性` stats are rendered (the green banner section). Wherever
the value is displayed (typically `${value || '-'}` or similar), change the fallback from
`'-'` to `'0.00'`:

```tsx
// Before (approximate):
${stats?.volume24h ?? '-'}

// After:
{stats?.volume24h != null ? `$${formatNumber(stats.volume24h)}` : '$0.00'}
```

Apply the same pattern to the liquidity stat.

---

### Fix 6 — Consolidate API error handling (Pool and Farms pages)

Both pages fire multiple independent API calls that each individually show a toast on failure,
resulting in 3–4 stacked error toasts.

**File:** `frontend/web-app/src/pages/Pool/index.tsx`

Find every `message.error(...)` or `notification.error(...)` call inside `useEffect` or query
`onError` handlers. Replace all of them with a single shared error signal. Create one
`const [hasError, setHasError] = useState(false)` and set it to `true` in any failed request.
Then render a single inline error banner instead of multiple toasts:

```tsx
{hasError && (
  <Alert
    type="error"
    message="Unable to load pool data — backend service unavailable"
    action={<Button size="small" onClick={handleRetry}>Retry</Button>}
    style={{ marginBottom: 16 }}
    closable
    onClose={() => setHasError(false)}
  />
)}
```

Remove all `message.error` / `notification.error` calls that fired individual toasts.

**File:** `frontend/web-app/src/pages/Farms/index.tsx`

Apply the same pattern. Replace the inline error text that duplicates the toast with the
consolidated `<Alert>` component. The "加载挖矿池失败" string that appears both as a toast
and as inline text should become a single `<Alert>` with a retry button. Remove the toast.

---

### Fix 7 — Improve empty states (Portfolio, History, My Farms)

**File:** `frontend/web-app/src/pages/Portfolio/index.tsx`

The wallet-not-connected state currently shows a tiny centred message. Replace it with:

```tsx
<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', minHeight: '60vh', gap: 24, textAlign: 'center' }}>
  <WalletOutlined style={{ fontSize: 64, opacity: 0.2 }} />
  <div>
    <Title level={3} style={{ margin: 0 }}>Connect your wallet</Title>
    <Text type="secondary">View your token balances, LP positions, and portfolio value</Text>
  </div>
  <ConnectWallet />   {/* re-use the existing ConnectWallet component */}
</div>
```

Import `ConnectWallet` from `../../components/ConnectWallet`.

**File:** `frontend/web-app/src/pages/History/index.tsx`

Same pattern — replace the empty state with a centred layout that includes a ConnectWallet CTA.

**File:** `frontend/web-app/src/pages/MyFarms/index.tsx`

The not-connected state should include a button linking to `/farms`:

```tsx
<Button type="primary" onClick={() => navigate('/farms')}>
  Browse Farms
</Button>
```

---

### Fix 8 — Unify language to English

The page content is currently mixed Chinese/English. Translate all user-visible Chinese strings
to English throughout these files:

- `src/pages/Swap/index.tsx` — translate all Chinese labels, placeholders, button text
- `src/pages/Liquidity/index.tsx`
- `src/pages/Pool/index.tsx`
- `src/pages/Farms/index.tsx`
- `src/pages/MyFarms/index.tsx`
- `src/pages/Portfolio/index.tsx`
- `src/pages/History/index.tsx`
- `src/components/Layout/index.tsx` (if any remain)

Key translations:
| Chinese | English |
|---------|---------|
| 代币交换 | Token Swap |
| 即时交换代币，无需注册 | Instant token exchange, no registration required |
| 你支付 | You pay |
| 你获得 | You receive |
| 选择代币 | Select token |
| 连接钱包以开始交易 | Connect wallet to trade |
| 流动性管理 | Liquidity Management |
| 添加流动性以赚取交易手续费 | Add liquidity to earn trading fees |
| 添加流动性 | Add Liquidity |
| 移除流动性 | Remove Liquidity |
| 代币 A / 代币 B | Token A / Token B |
| 请先连接钱包 | Connect wallet to continue |
| 流动性池 | Liquidity Pools |
| 流动性挖矿 | Liquidity Mining |
| 搜索交易对... | Search pairs... |
| 如何参与挖矿？ | How to participate |
| 24h 交易量 | 24h Volume |
| 流动性 | Liquidity |
| 暂无活动性池 | No active pools |
| 没有找到匹配的挖矿池 | No matching farms found |
| 滑点 | Slippage |
| 请先连接钱包查看交易历史 | Connect wallet to view transaction history |
| 连接钱包后即可查看您的资产 | Connect wallet to view your assets |

---

## PART 2 — Visual Redesign

The current design looks like every other DeFi app: animated purple gradient background,
glassmorphism cards, Uniswap-green (`#00b96b`) with blue (`#1890ff`) accent.

Replace it with a distinctive **dark charcoal + electric indigo + amber** design system.
The target aesthetic is a premium data terminal — clean, precise, with deliberate use of
colour only for signal. Think Bloomberg Terminal meets modern fintech.

---

### Design System

**Color palette** (define as CSS custom properties in `src/index.css`):

```css
:root {
  /* Surfaces */
  --color-bg:        #08080d;   /* near-black, almost no hue */
  --color-surface-1: #0f0f1a;   /* primary card background */
  --color-surface-2: #14141f;   /* elevated card / modal */
  --color-surface-3: #1c1c2e;   /* hover state / input background */
  --color-border:    #1e1e30;   /* subtle dividers */
  --color-border-em: #2d2d4a;   /* emphasised borders (focused inputs, active cards) */

  /* Indigo accent (primary) */
  --color-primary:      #6366f1;  /* indigo-500 */
  --color-primary-hover:#818cf8;  /* indigo-400 */
  --color-primary-dim:  rgba(99, 102, 241, 0.15);

  /* Amber accent (secondary / highlight) */
  --color-amber:        #f59e0b;
  --color-amber-dim:    rgba(245, 158, 11, 0.15);

  /* Semantic */
  --color-success: #10b981;  /* emerald-500 */
  --color-danger:  #ef4444;  /* red-500 */
  --color-warning: #f59e0b;  /* amber = warning too */

  /* Text */
  --color-text-primary:   rgba(255, 255, 255, 0.92);
  --color-text-secondary: rgba(255, 255, 255, 0.50);
  --color-text-muted:     rgba(255, 255, 255, 0.28);

  /* Typography */
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', ui-monospace, monospace;
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}
```

Add to the `<head>` in `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

### Replace App.css

Rewrite `src/App.css` with the new system. Key rules:

**Background**: Replace the animated purple gradient with a static near-black surface with a single
subtle radial glow in the top-left corner (indigo) and a faint one bottom-right (amber). No
animation on the background — it should feel stable and professional:

```css
.app-container {
  min-height: 100vh;
  background-color: var(--color-bg);
  background-image:
    radial-gradient(ellipse 60% 40% at 10% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 70%),
    radial-gradient(ellipse 40% 30% at 90% 100%, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
  background-attachment: fixed;
}
/* Remove the ::before particle animation entirely */
```

**Cards**: Remove glassmorphism. Use flat opaque surfaces with a thin border and a 1px top
highlight to create a sense of elevation:

```css
.ant-card {
  background: var(--color-surface-1);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  box-shadow: none;
  transition: border-color 0.2s;
}
.ant-card:hover {
  border-color: var(--color-border-em);
  box-shadow: none; /* no glow on hover */
}
```

**Buttons**: Primary buttons use solid indigo (not a gradient). CTA buttons (Connect Wallet,
Swap action) use amber to stand out from every other action:

```css
.ant-btn-primary {
  background: var(--color-primary);
  border: none;
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: 0.01em;
  box-shadow: none;
}
.ant-btn-primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: none; /* remove the translateY lift — it feels cheap */
  box-shadow: none;
}
```

Add a new `.btn-cta` class for the Swap button and Connect Wallet:
```css
.btn-cta {
  background: var(--color-amber) !important;
  color: #000 !important;
  border: none !important;
  font-weight: 700 !important;
}
.btn-cta:hover:not(:disabled) {
  background: #fbbf24 !important;
  opacity: 0.95;
}
```

**Inputs**: Flat, opaque, monospace numbers:

```css
.ant-input, .ant-input-number {
  background: var(--color-surface-3);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 500;
}
.ant-input:focus, .ant-input-number-focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-dim);
  background: var(--color-surface-3);
}
```

**Tabs ink bar**: Use indigo, not a gradient:

```css
.ant-tabs-ink-bar {
  background: var(--color-primary);
  height: 2px;
  border-radius: 0;
}
.ant-tabs-tab-active .ant-tabs-tab-btn {
  color: var(--color-primary) !important;
}
```

**Scrollbar**: Simplify:
```css
::-webkit-scrollbar-thumb {
  background: var(--color-border-em);
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-primary);
}
```

**Numbers throughout the app**: Any numeric value (prices, balances, amounts, percentages)
should use `font-family: var(--font-mono)`. Apply this via:
```css
.mono { font-family: var(--font-mono); }
```
Then add `className="mono"` on numeric `<Text>` and `<span>` elements in Swap, Pool, Portfolio,
History, and Farms pages.

---

### Rebrand the header

**File:** `src/components/Layout/index.tsx` and `src/components/Layout/index.css`

Replace the generic `<SwapOutlined /> DEX` logo with a distinctive mark:

```tsx
<div className="logo">
  <div className="logo-mark">N</div>
  <span className="logo-name">NEXUS</span>
  <span className="logo-badge">DEX</span>
</div>
```

```css
/* Layout/index.css */
.logo-mark {
  width: 28px;
  height: 28px;
  background: var(--color-primary);
  color: #fff;
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  margin-right: 10px;
}
.logo-name {
  font-family: var(--font-sans);
  font-weight: 800;
  font-size: 18px;
  letter-spacing: 0.08em;
  color: var(--color-text-primary);
}
.logo-badge {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
  color: var(--color-primary);
  background: var(--color-primary-dim);
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
  letter-spacing: 0.05em;
  align-self: center;
}
```

Also update `document.title` in `index.html` from `DEX - Decentralized Exchange` to
`NEXUS DEX — Decentralized Exchange`.

Update the header background:
```css
.header {
  background: rgba(8, 8, 13, 0.85) !important;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  box-shadow: none;
}
```

Update `colorPrimary` in `App.tsx`'s `<ConfigProvider>` to `'#6366f1'`.

---

### Swap page — make the card distinctive

**File:** `src/pages/Swap/index.tsx` and its CSS

The swap card is the most important screen. Apply these changes:

1. Add a thin indigo top border (`border-top: 2px solid var(--color-primary)`) to the main
   swap card to make it the focal point of the page.

2. The token-select buttons currently look like generic dropdowns. Style them as pill buttons
   with a dark opaque background:
   ```css
   .token-select-btn {
     background: var(--color-surface-3);
     border: 1px solid var(--color-border-em);
     border-radius: 999px;
     padding: 6px 12px 6px 8px;
     display: flex;
     align-items: center;
     gap: 6px;
     cursor: pointer;
     font-weight: 600;
     font-size: 15px;
     transition: border-color 0.2s;
   }
   .token-select-btn:hover {
     border-color: var(--color-primary);
   }
   ```

3. The swap direction toggle (↕ button) should use the amber accent since it's the key action:
   ```css
   .swap-direction-btn {
     background: var(--color-surface-2);
     border: 1px solid var(--color-border-em);
     color: var(--color-amber);
     border-radius: 10px;
     width: 36px; height: 36px;
   }
   .swap-direction-btn:hover {
     border-color: var(--color-amber);
     background: var(--color-amber-dim);
   }
   ```

4. Apply `.btn-cta` class to the main "Swap" / "Connect wallet to trade" button.

5. Price impact: colour code using the semantic palette:
   - < 1%: `var(--color-success)`
   - 1–5%: `var(--color-warning)`
   - > 5%: `var(--color-danger)`

---

### Pool page — data terminal aesthetic

Add a subtle grid/stripe to alternate table rows instead of relying on Ant Design defaults:

```css
.ant-table-tbody > tr:nth-child(even) > td {
  background: rgba(255, 255, 255, 0.015);
}
.ant-table-tbody > tr:hover > td {
  background: var(--color-primary-dim) !important;
}
```

All TVL, volume, and price numbers should use `font-family: var(--font-mono)`.

Add a thin indigo left-border accent to the stats summary cards at the top:
```css
.pool-stat-card {
  border-left: 3px solid var(--color-primary);
  border-radius: 0 12px 12px 0;
}
```

---

### Farms page — make APR values stand out

APR values should be large, amber-coloured, and monospace to draw the eye:
```css
.farm-apr {
  font-family: var(--font-mono);
  font-size: 24px;
  font-weight: 700;
  color: var(--color-amber);
}
```

---

### Connect Wallet button

**File:** `src/components/ConnectWallet/index.tsx` (or wherever it renders)

Apply the `.btn-cta` class so the amber CTA colour replaces the current green. This makes
the most important action on every page immediately distinguishable from all other buttons.

---

## Execution Instructions

1. Make all changes in the order listed above.
2. After Part 1 (bug fixes): `git commit -m "fix: register routes, nav, empty states, errors, i18n"`
3. After Part 2 (redesign): `git commit -m "design: replace generic DeFi theme with NEXUS charcoal/indigo/amber system"`
4. `git push -u origin claude/test-ui-ux-assessment-oHWs7`
5. Restart the Vite dev server (`npm run dev` in `frontend/web-app/`) and verify:
   - `/orders` and `/trading` render their full components (not blank)
   - Pool and Farms show a single Alert instead of stacked toasts
   - All UI text is in English
   - The new colour scheme is visible across all pages
   - The logo says "NEXUS DEX"
   - Numeric values use monospace font
