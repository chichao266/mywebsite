# Avoryne Launch Handoff Report

Date: 2026-06-26
Project: `chichao266/mywebsite`
Vercel project: `mywebsite`
Current production URL: `https://www.avoryne.net`

## Summary

The site has been reworked from the earlier agate direction into Avoryne, an international lab-grown diamond and colored gemstone jewelry store. The code is merged to `master`, deployed on Vercel, connected to a clean production database, connected to the `avoryne.net` domain, and using a public image storage bucket.

The site is ready for real product setup and storefront testing. Payment collection is intentionally not fully open yet.

## Current Brand Direction

- Brand name: Avoryne
- Product direction: lab-grown diamond jewelry and colored gemstone jewelry
- Audience: international market outside mainland China, especially Europe and North America
- Style direction: cleaner international luxury/e-commerce look, not agate or jade themed

## Completed Work

### Code and deployment

- Merged the Avoryne launch preview PR into `master`.
- Production branch is `master`.
- Vercel is deploying from GitHub automatically.
- Current production site is available at `https://www.avoryne.net`.
- Apex domain `https://avoryne.net` redirects to `https://www.avoryne.net`.
- Local code has been pushed to GitHub.

### Database

- Created a new clean Neon database named `avoryne-production`.
- Connected it to the Vercel project for Production and Preview.
- Avoided using the older `neon-cyan-basket` database because it contained unrelated demo products such as headphones, shirts, and bags.
- Created the required application tables:
  - `User`
  - `Product`
  - `Order`
  - `OrderItem`
  - `SupportTicket`
  - `SiteSetting`

### Admin access

- Created one admin user for setup:
  - Email: `admin@avoryne.com`
  - Password: changed after setup; do not store plaintext passwords in this handoff document.
- The email is a placeholder login value, not a real mailbox unless separately created.
- Store the current password only in a secure password manager.
- Admin URL: `https://www.avoryne.net/admin/login`
- Mobile admin access is supported for order and support ticket monitoring.

### Environment variables

- Added production-safe secret handling for the app.
- The app now prefers the Avoryne database variable first:
  - `AVORYNE_DATABASE_URL`
  - fallback: `DATABASE_URL`
- Added required auth/admin secrets in Vercel.
- Added demo-data control variable so old demo data does not appear again.

### Product image upload

- Created a public Vercel Blob store named `avoryne-product-images`.
- Added image upload support in the admin product form.
- Product images are now uploaded to Vercel Blob instead of being saved into the local project folder.
- Verified the upload endpoint on production:
  - Admin login works.
  - Upload API works after login.
  - Uploaded image URL is public and returns `200 OK`.
  - Upload API rejects unauthenticated users.

### Admin email notifications

- New checkout orders and support form tickets can send email alerts to the store operator.
- The notification code is safe when email is not configured: orders and tickets still save normally.
- Notification recipients are configured in Vercel through `ADMIN_NOTIFICATION_EMAIL`.
- Current notification recipients:
  - `1324773061@qq.com`
  - `chichao266@gmail.com`
- `ADMIN_NOTIFICATION_EMAIL` has been added for both Production and Preview.
- `RESEND_API_KEY` is still missing. Email alerts will not actually send until Resend is installed/configured and this key is added in Vercel.
- Required Vercel environment variables for working email alerts:
  - `RESEND_API_KEY`
  - `ADMIN_NOTIFICATION_EMAIL`
- Optional Vercel environment variable:
  - `ADMIN_NOTIFICATION_FROM`
- `ADMIN_NOTIFICATION_EMAIL` may contain more than one recipient, separated by commas.
- Recommended next setup:
  1. Add/install Resend for the Vercel project.
  2. Add `RESEND_API_KEY` to Production and Preview.
  3. Redeploy the Vercel project so the new variable is available.
  4. Submit one support form test and one checkout/order test.
  5. Confirm both emails arrive on the QQ and Gmail mobile inboxes.

### Storefront copy and policy pages

- Frontend storefront pages should display English only. Admin screens may use Chinese.
- Legal/support pages are now database-backed and dynamic:
  - About
  - Contact
  - Shipping & Delivery
  - Returns & Exchanges
  - Privacy Policy
  - Terms of Service
- Public contact copy uses the support form instead of an unconfigured mailbox.
- Shipping copy is written for small jewelry parcels shipped by air:
  - processing: 2-3 business days
  - air delivery after dispatch: usually 5-7 business days
  - no ocean/sea shipping language
- If the production site shows old policy text, first check Vercel deployment status and page cache before rerunning SQL. Do not rerun old SQL if the live site already shows the corrected copy.

### Domain and GoDaddy

- Final domain purchased through GoDaddy: `avoryne.net`.
- DNS is configured to point the site to Vercel.
- GoDaddy Full Domain Protection was purchased. It protects the domain registration and ownership changes, but it is not an email mailbox service.
- A real mailbox such as `hello@avoryne.net` or `support@avoryne.net` has not been confirmed as active. Do not show those email addresses on the storefront until a mailbox is actually working.

## Important Current State

The site is not using Shopify for the current deployment.

The production database is clean. It does not contain the old generic demo products. The next step is to add real products through the admin panel.

Payment is not fully open. PayPal and bank transfer were discussed, but real checkout collection should stay disabled or clearly marked until the payment account is ready.

## Known Risks Before Full Public Launch

- Admin password should be stored only in a secure password manager and rotated before handoff to another operator.
- Payment flow is not final.
- Admin email alerts are coded but not fully active until `RESEND_API_KEY` is added.
- Product content is not yet real.
- Legal pages should be reviewed before real sales:
  - Privacy Policy
  - Terms of Service
  - Shipping Policy
  - Return/Refund Policy
  - Contact information
- Domain `avoryne.net` is connected, but DNS/domain changes can still take time to propagate globally.
- Brand/trademark availability was discussed but not legally cleared. A professional trademark search is still recommended before major investment.

## Recommended Next Steps

1. Configure Resend and add `RESEND_API_KEY` in Vercel so order and support ticket email alerts actually send.
2. Submit one support form test and confirm the ticket appears in `/admin/tickets` and both notification inboxes.
3. Submit one checkout/order test and confirm the order appears in `/admin/orders` and both notification inboxes.
4. Add 3-5 real test products through the admin panel.
5. For each product, upload real product images and confirm they show on:
   - product list page,
   - product detail page,
   - cart,
   - checkout.
6. Review the checkout page and keep payment disabled or manual-only until PayPal is restored.
7. Test the full buyer journey:
   - browse products,
   - open product detail,
   - add to cart,
   - checkout form,
   - order creation,
   - admin order view.
8. Test admin order and ticket views on a phone.

## Useful URLs

- Production site: `https://www.avoryne.net`
- Apex redirect: `https://avoryne.net`
- Admin login: `https://www.avoryne.net/admin/login`
- Vercel fallback URL: `https://mywebsite-plum-two.vercel.app`
- Vercel project: `mywebsite`
- Neon database: `avoryne-production`
- Blob store: `avoryne-product-images`

## Recent Git Commits

- `76e37cc` - add admin email notifications
- `232083d` - ignore Vercel project metadata
- `5d42ec8` - improve mobile admin order and ticket views
- `1293942` - show brand name on mobile header

## Handoff Notes For The Next Person

- Do not reconnect the old `neon-cyan-basket` database unless there is a deliberate reason. It contains unrelated demo data.
- Product image upload depends on Vercel Blob and the `BLOB_READ_WRITE_TOKEN` environment variable.
- Product data is stored in the `Product` table in Neon.
- Image URLs are stored in the product `images` field as JSON.
- The admin product form currently supports up to 5 images per product.
- If a deployment does not reflect new environment variables, redeploy the Vercel project.
- `.vercel/` and `.env.local` are local-only and should not be committed.
