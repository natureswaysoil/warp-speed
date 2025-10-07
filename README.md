# Nature's Way Soil — E‑commerce (Next.js)

A simple, production-ready starter for natureswaysoil.com built with Next.js (App Router), React, and Stripe Checkout.

## Prereqs
- Node.js 18+
- A Stripe account (for checkout)

## Setup

1) Copy env file and add your keys
- Create `.env.local` in the project root and set at minimum:
  - STRIPE_SECRET_KEY={{STRIPE_SECRET_KEY}}
  - NEXT_PUBLIC_SITE_URL=http://localhost:3000
- Optional and recommended:
  - STRIPE_WEBHOOK_SECRET={{STRIPE_WEBHOOK_SECRET}}
  - RESEND_API_KEY={{RESEND_API_KEY}}
  - RESEND_FROM_EMAIL=orders@natureswaysoil.com
  - NEXT_PUBLIC_SUPABASE_URL={{NEXT_PUBLIC_SUPABASE_URL}}
  - SUPABASE_ANON_KEY={{SUPABASE_ANON_KEY}}
  - SUPABASE_SERVICE_ROLE_KEY={{SUPABASE_SERVICE_ROLE_KEY}} (server-only)
  - PRODUCTS_SOURCE_URL={{RAW_GITHUB_JSON_URL}} (optional; see below)

Note: Replace placeholders in {{UPPER_SNAKE_CASE}} with your actual secrets. Do not echo secrets in the terminal.

2) Install dependencies
- In PowerShell:
  - `cd .\natureswaysoil`
  - `npm install`

3) Run the app
- `npm run dev`
- Visit http://localhost:3000

## Stripe Checkout
- The Checkout button creates a session server-side using your `STRIPE_SECRET_KEY`.
- Success and cancel pages are pre-wired at `/checkout/success` and `/checkout/cancel`.
- A Stripe webhook is available at `/api/stripe/webhook` to capture completed checkouts, upsert the customer email into Subbase, and send a confirmation email with Resend.

### Configure the Stripe webhook
1) In Stripe Dashboard > Developers > Webhooks, add an endpoint pointing to:
   - Local: http://localhost:3000/api/stripe/webhook
   - Production: https://your-domain.com/api/stripe/webhook
2) Subscribe to the `checkout.session.completed` event.
3) Copy the signing secret and set STRIPE_WEBHOOK_SECRET in `.env.local`.

## Project Structure
- `src/app` — App Router pages and API routes
- `src/components` — UI components
- `src/lib/products.js` — Default product catalog data (fallback)
- `src/lib/catalog.js` — Catalog loader (supports remote PRODUCTS_SOURCE_URL)
- `src/app/api/products/route.js` — Exposes the product list to the client (used by Cart)
- `src/app/api/checkout/route.js` — Stripe Checkout session creation
- `src/app/api/stripe/webhook/route.js` — Stripe webhook handler (emails + Subbase)
- `src/app/api/subscribe/route.js` — Newsletter/lead capture into Subbase

## Customizing Products
- Easiest: Edit `src/lib/products.js` to change product names, prices (in cents), descriptions, and images.
- From GitHub: Set `PRODUCTS_SOURCE_URL` to a raw JSON URL (either an array of products or `{ products: [...] }`). Example:
  - `PRODUCTS_SOURCE_URL=https://raw.githubusercontent.com/your-org/your-repo/main/products.json`

## Subbase schema
Create a `customers` table with at least:
- `email` text PRIMARY KEY or unique
- `source` text
- `created_at` timestamp with time zone default now()

Example SQL:
```sql path=null start=null
create table if not exists public.customers (
  email text primary key,
  source text,
  created_at timestamptz default now()
);
```

Give the service role key server-only access. Do not expose it to the client.

## Resend sender
Verify your sending domain and set `RESEND_FROM_EMAIL` (e.g., orders@natureswaysoil.com).
