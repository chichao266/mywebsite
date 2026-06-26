# Avoryne Launch Handoff Report

Date: 2026-06-25
Project: `chichao266/mywebsite`
Vercel project: `mywebsite`
Current production URL: `https://mywebsite-plum-two.vercel.app`

## Summary

The site has been reworked from the earlier agate direction into Avoryne, an international lab-grown diamond and colored gemstone jewelry store. The code is merged to `master`, deployed on Vercel, and connected to a clean production database and a public image storage bucket.

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
- Current production site is available at `https://mywebsite-plum-two.vercel.app`.
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

## Important Current State

The site is not using Shopify for the current deployment. Shopify still matters only if the existing domain `yuanjc.net` is currently connected there.

The production database is clean. It does not contain the old generic demo products. The next step is to add real products through the admin panel.

Payment is not fully open. PayPal and bank transfer were discussed, but real checkout collection should stay disabled or clearly marked until the payment account is ready.

## Known Risks Before Full Public Launch

- Admin password should be stored only in a secure password manager and rotated before handoff to another operator.
- Payment flow is not final.
- Product content is not yet real.
- Legal pages should be reviewed before real sales:
  - Privacy Policy
  - Terms of Service
  - Shipping Policy
  - Return/Refund Policy
  - Contact information
- Domain `yuanjc.net` still needs a final decision:
  - transfer away from Shopify,
  - point DNS to Vercel,
  - or use a new domain.
- Brand/trademark availability was discussed but not legally cleared. A professional trademark search is still recommended before major investment.

## Recommended Next Steps

1. Add 3-5 real test products through the admin panel.
2. For each product, upload real product images and confirm they show on:
   - product list page,
   - product detail page,
   - cart,
   - checkout.
3. Review the checkout page and keep payment disabled or manual-only until PayPal is restored.
4. Replace placeholder policy/contact text with real business information.
5. Test the full buyer journey:
   - browse products,
   - open product detail,
   - add to cart,
   - checkout form,
   - order creation,
   - admin order view.
6. Decide the domain plan for `yuanjc.net`.
7. When product and policy content are ready, connect the final domain to Vercel.

## Useful URLs

- Production site: `https://mywebsite-plum-two.vercel.app`
- Admin login: `https://mywebsite-plum-two.vercel.app/admin/login`
- Vercel project: `mywebsite`
- Neon database: `avoryne-production`
- Blob store: `avoryne-product-images`

## Recent Git Commits

- `cfd978f` - prefer Avoryne database URL
- `3aa05d6` - upload product images to Blob storage

## Handoff Notes For The Next Person

- Do not reconnect the old `neon-cyan-basket` database unless there is a deliberate reason. It contains unrelated demo data.
- Product image upload depends on Vercel Blob and the `BLOB_READ_WRITE_TOKEN` environment variable.
- Product data is stored in the `Product` table in Neon.
- Image URLs are stored in the product `images` field as JSON.
- The admin product form currently supports up to 5 images per product.
- If a deployment does not reflect new environment variables, redeploy the Vercel project.
