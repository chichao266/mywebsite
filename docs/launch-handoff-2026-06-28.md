# Avoryne Launch Handoff Report

Date: 2026-06-28
Project: `chichao266/mywebsite`
Production URL: `https://www.avoryne.net`
Main branch: `master`

## Summary

Today's work shifted the storefront direction clearly toward mobile-first shopping. The user clarified that most traffic will come from social media and ads on mobile, so the site should feel like a phone-native fashion jewelry shopping experience rather than a desktop site scaled down.

The main completed work focused on:

- mobile homepage hero image and transparent overlay header
- simplified product navigation by jewelry use/type
- homepage `New In` product row
- mobile shopping flow improvements
- more subtle homepage hero CTA styling

All completed changes listed below were pushed to `master`.

## Current Mobile-First Direction

- Mobile is the primary browsing and shopping experience.
- Desktop should remain functional and polished, but should not drive design decisions.
- Homepage should be visual, direct, and light on explanatory copy.
- Main shopping entries should be simple:
  - `New In`
  - `Rings`
  - `Necklaces`
  - `Earrings`
  - `Bracelets`
  - `About`
- Product gemstone categories still exist in the backend, but are no longer primary storefront navigation entries.

## Completed Today

### Mobile homepage hero

- A new vertical mobile hero image was generated and added:
  - `public/images/avoryne-mobile-hero.png`
- The desktop homepage still uses:
  - `public/images/avoryne-home-hero.png`
- The homepage now serves different hero assets by viewport:
  - mobile: vertical cinematic jewelry portrait
  - desktop/tablet: original horizontal hero image
- Mobile hero is full-screen using `100svh`.
- Hero copy remains minimal:
  - `Lab-grown fine jewelry`
  - `Wear color like a signature.`
  - `Shop the Collection`

### Mobile transparent header over hero

- On the mobile homepage, the header overlays the hero image at the top.
- Header starts transparent on the homepage.
- Header changes back to white after scrolling.
- Logo and icons become white while over the image for readability.
- Desktop header behavior remains the normal white sticky header.

### Homepage CTA styling

- `Shop the Collection` was changed from a stark white button to a softer glass-style button:
  - semi-transparent white background
  - white border
  - white text
  - slight backdrop blur
- Mobile button width is capped at `18rem` so it feels intentional without becoming full-width.

### Navigation simplification

Top navigation was simplified from:

```text
New In / Rings / Necklaces / Earrings / Bracelets / Diamonds / Color / About
```

to:

```text
New In / Rings / Necklaces / Earrings / Bracelets / About
```

Removed from visible storefront navigation:

- `Diamonds`
- `Color`

Backend gemstone categories were not removed.

### Product listing filters

The `/products` page filter chips were simplified to:

```text
All / New In / Rings / Necklaces / Earrings / Bracelets
```

The product listing intro copy was changed to:

```text
Shop new arrivals and everyday jewelry by piece type.
```

Old stone-based URL filters are still supported by code, but no longer shown as visible primary entry points.

### Homepage `New In` row

A new `New In` section was added between the hero and `Shop the edit`.

Current behavior:

- `New In` is based on product creation date.
- Product listing `New In` takes the latest 24 products.
- Homepage `New In` shows the first 4 latest products.
- Mobile layout is horizontal scroll.
- Desktop layout is a 4-column row.

There is currently no admin toggle for `New In`.

### Homepage `Shop the edit`

Homepage category entry changed from:

```text
Rings / Necklaces / Earrings / Color
```

to:

```text
Rings / Necklaces / Earrings / Bracelets
```

This keeps homepage category entry focused on jewelry use/type.

### Mobile shopping flow improvements

Earlier today, the mobile shopping experience was also improved:

- Product listing mobile grid changed to 2 columns.
- Product listing filter bar became sticky on mobile.
- Product detail page gained a mobile bottom purchase bar.
- Cart page gained a mobile bottom checkout bar.
- Homepage explanatory copy was reduced.

## Current Product Display Logic

### New In

- Source: latest products by `createdAt desc`.
- `/products?collection=new`: latest 24 products.
- Homepage `New In`: latest 4 products.
- No manual `New In` checkbox exists yet.

### Featured Pieces

- Source: products with `featured: true`.
- Homepage currently calls `getFeaturedProducts(8)`.
- This means up to 8 featured products can render.
- User asked whether this should be only 4; not changed yet.

Recommended next decision:

- If the homepage should stay cleaner and consistent with `New In`, change featured homepage count from 8 to 4:

```ts
const products = await getFeaturedProducts(4);
```

## Recent Git Commits

- `ddc8443` - fix: harden admin authorization
- `22ad6f2` - style: refine homepage hero cta
- `ed3340e` - feat: simplify storefront navigation
- `f5ab5e4` - feat: add mobile hero image and overlay header
- `ef64125` - feat: improve mobile shopping experience
- `d75e749` - Add launch handoff report for 2026-06-27
- `1df9fbb` - Improve mobile navigation and hero layout
- `0ce62cd` - Update homepage hero image and headline
- `8d0eb1d` - Add other gemstones category

## Important Current Files

- Homepage:
  - `src/app/page.tsx`
- Header/navigation:
  - `src/components/layout/header.tsx`
  - `src/components/header-styles.tsx`
- Product listing:
  - `src/app/products/page.tsx`
- Product data helpers:
  - `src/lib/product-data.ts`
- Mobile homepage hero:
  - `public/images/avoryne-mobile-hero.png`
- Desktop homepage hero:
  - `public/images/avoryne-home-hero.png`

## Known Notes And Risks

- The new mobile hero image is AI-generated and approved directionally by the user.
- Header over image uses white logo/icons on mobile homepage before scroll; verify contrast on real phones after Vercel deployment.
- `New In` is automatic by creation date. If the catalog grows, a manual admin toggle may be better.
- `Featured Pieces` still allows up to 8 homepage products. User may want this simplified to 4.
- Backend gemstone categories remain useful for admin/product details, but should not be reintroduced as top-level navigation unless the user asks.
- Payment flow is still not the priority.

## Security Review And First Hardening Pass

Date: 2026-06-30

The user requested an adversarial project review using the locally configured GLM-5.2 cross-review skill and a sub-agent review with the same dimensions:

- code security
- authentication and authorization
- admin route/API protection
- file upload and external services
- checkout/order stability
- input validation and privacy
- runtime stability and error handling
- maintainability and architecture
- production performance risks

### Review outcome

Important correction:

- GLM-5.2 initially flagged `src/proxy.ts` as completely broken because it expected `middleware.ts`.
- This was cross-checked against Next.js 16 documentation. In this project, `proxy.ts` / `export function proxy` is valid for Next.js 16, so that specific Critical finding was not accepted as proven.

Accepted high-priority findings:

- Admin API routes and Server Actions needed defense-in-depth authorization, not just top-level proxy protection.
- Admin tokens needed server-side expiry and role checks.
- Product image upload needed real file-content validation, not only client-provided MIME type and extension.
- Checkout still has remaining issues around pending orders, stock decrement, idempotency, and payment confirmation.
- In-memory rate limiting is not production-strong on Vercel serverless.
- Regex-based HTML sanitization is not strong enough for long-term safety.

### Completed first hardening pass

Pushed commit:

```text
ddc8443 fix: harden admin authorization
```

Files added:

- `src/lib/admin-token.ts`
- `src/lib/admin-auth.ts`

Main changes:

- Added signed admin tokens with:
  - `iat`
  - `exp`
  - `role: "admin"`
- Replaced duplicated token verification logic in `src/proxy.ts` with shared `verifyAdminToken`.
- Added `requireAdmin()` for Server Actions.
- Added `requireAdminRequest()` for admin API routes.
- `requireAdmin` now checks:
  - admin token exists
  - token signature is valid
  - token is not expired
  - token role is `admin`
  - user still exists in the database
  - user email still matches token payload
  - user role is still `admin`
- Added internal admin checks to admin API routes:
  - `src/app/api/admin/products/route.ts`
  - `src/app/api/admin/products/[id]/route.ts`
  - `src/app/api/admin/settings/route.ts`
  - `src/app/api/admin/upload/route.ts`
- Added internal admin checks to admin Server Actions:
  - `src/app/admin/products/actions.ts`
  - `src/app/admin/orders/actions.ts`
  - `src/app/admin/customers/actions.ts`
  - `src/app/admin/content/actions.ts`
  - `src/app/admin/settings/actions.ts`
  - `src/app/admin/tickets/actions.ts`
  - `src/app/admin/reports/actions.ts`
- Strengthened product image upload:
  - still limits to JPG/PNG/WebP extensions
  - now reads file bytes and validates magic bytes for JPG, PNG, and WebP
  - sets Blob `contentType` from detected file type instead of trusting client MIME

Verification:

```text
npm run build
```

passed before commit and push.

Expected side effect:

- Existing admin login cookies will be invalidated because the admin token payload format changed.
- Admin user should log in again after deployment.

### Remaining security work

Recommended next security pass:

1. Checkout/order hardening:
   - add checkout request rate limiting
   - add idempotency key
   - create a clearer pending-payment lifecycle
   - decrement stock transactionally
   - handle payment failure/expiry and stock release
2. Production-grade rate limiting:
   - replace in-memory `Map` with Redis/Upstash/Vercel KV or similar shared storage
3. HTML sanitization:
   - replace regex sanitizer with a real HTML sanitizer or move admin content to Markdown/plain-text whitelist rendering
4. Product/admin input validation:
   - schema-validate product fields
   - enforce non-negative price/stock
   - limit text lengths
   - validate role/status enum values
5. User token expiry:
   - add server-side `exp` validation for user auth tokens, similar to admin token
6. Performance/scale:
   - add pagination for public product listing and admin orders
   - consider cart persistence
   - gradually replace key `<img>` tags with `next/image`

## Recommended Next Steps

1. Check the live mobile homepage after Vercel deployment.
2. Decide whether `Featured Pieces` should be capped at 4.
3. Review whether `New In` section should use product cards exactly like product listing, or remain a lighter visual row.
4. After the security deployment, log out and log back into the admin panel because old admin cookies are invalid.
5. Continue adding real products through the admin panel.
6. After enough products are added, review homepage product order:
   - `New In`
   - `Shop the edit`
   - `Featured Pieces`
7. Keep navigation simple unless there is a strong merchandising reason to add another entry.
8. Plan the second security pass around checkout, rate limiting, and HTML sanitization.

## Security Review Second Hardening Pass

Date: 2026-06-30

Status: implemented locally, not yet committed or pushed.

Focus:

- checkout duplicate-submission protection
- checkout request throttling
- transactional stock reservation
- order cancellation stock release
- safer order status updates

Files changed:

- `prisma/schema.prisma`
- `src/app/api/checkout/route.ts`
- `src/app/checkout/page.tsx`
- `src/app/admin/orders/actions.ts`

Main changes:

- Added `Order.checkoutKey` as a unique optional field for checkout idempotency.
- Checkout page now generates one checkout key per attempted order and sends it to `/api/checkout`.
- Checkout API rejects missing or invalid checkout keys.
- Checkout API rate-limits by client IP: 8 checkout attempts per 10 minutes.
- Checkout API normalizes duplicate cart lines into one quantity per product.
- Checkout API rejects unusually large carts and item quantities.
- Checkout API validates email server-side.
- Order creation now runs inside a Prisma transaction.
- Product stock is decremented atomically with `stock >= requested quantity`.
- If the same checkout key is reused, the existing order is returned instead of creating a duplicate.
- Admin order status changes now validate allowed statuses.
- Setting an order to `cancelled` returns reserved stock.
- Reopening a cancelled order attempts to reserve stock again and fails if stock is insufficient.

Verification:

- `npm run build` passed.
- `npm run lint` passed with existing warnings only.
- `npx prisma validate` passed using a temporary local PostgreSQL URL because `.env.local` does not contain `DATABASE_URL`.

Important deployment note:

- Because `Order.checkoutKey` was added to Prisma schema, the production database schema must be synced before or with deployment, for example via the existing database push workflow. If code is deployed before the database has this column, checkout can fail at runtime.

## Handoff Notes For Next Person

- The user wants discussion before design-heavy changes.
- Do not replace homepage images without user approval.
- For mobile, prioritize simple shopping paths and strong visuals.
- Do not remove backend gemstone categories; only storefront entry points were simplified.
- Keep desktop stable while optimizing mobile.
- The current brand direction is young, fashionable, light luxury, and visually rich.
