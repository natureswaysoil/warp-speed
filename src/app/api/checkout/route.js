import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { products } from '../../../lib/products'

export async function POST(req) {
  const { items } = await req.json()
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    return NextResponse.json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY.' }, { status: 400 })
  }
  const stripe = new Stripe(key)

  const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get('origin') || 'http://localhost:3000'

  const line_items = (items || []).map(i => {
    const p = products.find(x => x.id === i.id)
    if (!p) return null
    return {
      price_data: {
        currency: 'usd',
        product_data: { name: p.name },
        unit_amount: p.price
      },
      quantity: Math.max(1, Number(i.quantity) || 1),
      adjustable_quantity: { enabled: true, minimum: 1, maximum: 99 }
    }
  }).filter(Boolean)

  if (line_items.length === 0) {
    return NextResponse.json({ error: 'No valid items' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items,
    success_url: `${origin}/checkout/success`,
    cancel_url: `${origin}/checkout/cancel`,
    shipping_address_collection: { allowed_countries: ['US', 'CA'] },
    allow_promotion_codes: true,
    customer_creation: 'always'
  })

  return NextResponse.json({ url: session.url })
}
