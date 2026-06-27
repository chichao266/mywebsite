# Avoryne Launch Handoff Report

Date: 2026-06-27
Project: `chichao266/mywebsite`
Vercel project: `mywebsite`
Production URL: `https://www.avoryne.net`
Main branch: `master`

## Summary

Avoryne is now a working independent jewelry e-commerce site for lab-grown diamonds and colored gemstone jewelry. The site is connected to the `avoryne.net` domain, using Vercel deployment, Neon database, Vercel Blob product image storage, and Resend email notifications.

The latest work focused on brand positioning, storefront navigation, product classification, admin product entry, Resend domain verification, homepage hero image, and mobile navigation.

## Current Brand Direction

- Brand: Avoryne
- Audience: young, fashion-conscious international shoppers
- Positioning: modern light luxury jewelry
- Core materials:
  - 925 sterling silver
  - lab-grown diamonds
  - lab-grown sapphires
  - lab-grown emeralds
  - lab-grown rubies
  - other gemstones
- Style reference discussed: Mejuri-like clean fashion/luxury e-commerce, with more visual impact and less text-heavy presentation.

## Completed Since The Previous Handoff

### Resend email setup

- Resend API key was added to Vercel.
- Resend domain `avoryne.net` was added and verified.
- GoDaddy DNS records for Resend were added successfully.
- DKIM, SPF/MX sending records show verified in Resend.
- Current sender variable:
  - `ADMIN_NOTIFICATION_FROM=Avoryne <notify@avoryne.net>`
- Current recipient variable:
  - `ADMIN_NOTIFICATION_EMAIL=1324773061@qq.com,chichao266@gmail.com`
- Support ticket notification and order notification tests were completed.
- Gmail and QQ email notifications were both confirmed working after domain verification.

### Product classification and navigation

- Navigation was changed from the earlier simple structure to:
  - `New In`
  - `Rings`
  - `Necklaces`
  - `Earrings`
  - `Bracelets`
  - `Diamonds`
  - `Color`
  - `About`
- Product filtering now supports product use/type and gemstone category separately.
- `productType` was added to the `Product` model.
- User ran the required production database SQL successfully:

```sql
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "productType" TEXT;
```

- Admin product creation/edit form now includes product type selection.
- Gemstone category includes:
  - `Lab Diamonds`
  - `Lab Sapphires`
  - `Lab Emeralds`
  - `Lab Rubies`
  - `Other Gemstones`

### Homepage hero image and copy

- Homepage hero image was updated to the user-selected Midjourney image:
  - Local source: `C:/Users/惠普/Desktop/电商上架图/0_1.png`
  - Project path: `public/images/avoryne-home-hero.png`
- Homepage headline was updated to:
  - `Wear color like a signature.`
- The production homepage was checked after deployment:
  - HTTP status returned `200`
  - headline was present
  - hero image path was present

### Mobile navigation and hero layout

- Mobile header previously did not show the updated product categories.
- A mobile menu button was added to the header.
- Mobile menu now reuses the same navigation data as desktop, so future nav updates remain synchronized.
- Mobile hero layout was lightly optimized:
  - shorter mobile hero height
  - improved image object position
  - stronger mobile overlay so text remains readable
- Local production build passed after the mobile changes.
- Latest mobile/navigation commit was pushed to GitHub.

## Current Technical State

### Deployment

- GitHub repository: `chichao266/mywebsite`
- Production branch: `master`
- Vercel should auto-deploy from GitHub pushes.
- Latest pushed commit:
  - `1df9fbb Improve mobile navigation and hero layout`

### Database

- Production database: `avoryne-production`
- Product table now expects the additional optional column:
  - `productType`
- Product images are stored as JSON strings in the product `images` field.

### Product images

- Product images upload through the admin panel.
- Vercel Blob store is used for uploaded image hosting.
- The first uploaded product image is used as the main/default product image in listings and featured sections.

### Admin

- Admin product creation page supports:
  - product title
  - price
  - stock
  - product type
  - gemstone category
  - featured/homepage recommendation
  - up to 5 product images
- The homepage recommendation checkbox determines whether a product can appear in the featured product section.

## Important URLs

- Production site: `https://www.avoryne.net`
- Apex domain: `https://avoryne.net`
- Admin login: `https://www.avoryne.net/admin/login`
- Admin products: `https://www.avoryne.net/admin/products`
- New product page: `https://www.avoryne.net/admin/products/new`
- Resend dashboard: `https://resend.com`
- GoDaddy DNS management: `https://dcc.godaddy.com/control/dnsmanagement?domainName=avoryne.net`

## Recent Git Commits

- `1df9fbb` - Improve mobile navigation and hero layout
- `0ce62cd` - Update homepage hero image and headline
- `8d0eb1d` - Add other gemstones category
- `56b99ca` - Update Avoryne navigation and product filters
- `b2dd811` - Update Avoryne launch handoff
- `232083d` - Ignore Vercel project metadata
- `76e37cc` - Add admin email notifications
- `5d42ec8` - Improve mobile admin order and ticket views

## Known Risks And Notes

- Payment interface is not ready yet, so full checkout payment testing cannot be completed.
- Product catalog is still being built manually through the admin panel.
- Homepage visuals are still in progress. The current hero image is selected, but more visual content is needed across the homepage to reduce the text-heavy feeling.
- Mobile menu code has passed build, but should still be checked on a real phone after Vercel finishes deploying.
- Resend receiving is not enabled, but sending notifications is working. This is acceptable for current admin notification needs.
- A real public mailbox such as `support@avoryne.net` or `hello@avoryne.net` has not been confirmed as active. Avoid displaying those email addresses until mailbox service is actually configured.
- Do not expose API keys, database URLs, or admin passwords in documentation.

## Recommended Next Steps

1. Wait for the latest Vercel deployment to finish, then test the mobile homepage on a real phone.
2. Confirm the mobile menu shows:
   `New In / Rings / Necklaces / Earrings / Bracelets / Diamonds / Color / About`.
3. Continue adding real products in the admin panel.
4. For each product, upload clean product images and check:
   - product list page
   - product detail page
   - cart page
   - checkout page
5. Improve homepage visual structure after the hero:
   - add stronger image-led category sections
   - reduce long explanatory copy
   - create a more fashion editorial layout
6. Keep payment disabled or clearly unfinished until PayPal/payment flow is ready.
7. After payment is ready, test the full buyer journey:
   - browse product
   - add to cart
   - checkout
   - payment
   - order creation
   - admin order notification email
8. Review legal and policy pages before real public sales.

## Handoff Notes For The Next Person

- The user prefers discussing design direction first. Do not replace images or make visual decisions until the user explicitly says to start changing them.
- Product classification should keep product type and gemstone type separate. A lab diamond ring can appear under both `Rings` and `Diamonds`.
- `Color` is the public navigation label for colored gemstones.
- `Other Gemstones` exists to avoid needing to list every gemstone type individually.
- The site direction is young, fashionable, light luxury, and visually rich. Avoid making the homepage too text-heavy.
- The current priority is storefront polish and product content, not payment testing.
