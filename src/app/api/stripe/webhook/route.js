import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabaseAdmin } from '../../../../lib/supabaseAdmin'

export const dynamic = 'force-dynamic'

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = req.headers.get('stripe-signature')

  if (!webhookSecret) {
    return NextResponse.json({ error: 'Missing STRIPE_WEBHOOK_SECRET' }, { status: 400 })
  }

  let event
  try {
    const payload = await req.text()
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret)
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    try {
      // Retrieve full session with line items
      const full = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items']
      })

      const email = full.customer_details?.email
      if (email) {
        // Upsert into Subbase
        try {
          await supabaseAdmin
            .from('customers')
            .upsert({ email, source: 'checkout' }, { onConflict: 'email' })
        } catch {}

        // Send order confirmation with Resend
        try {
          const resend = new Resend(process.env.RESEND_API_KEY)
          const from = process.env.RESEND_FROM_EMAIL || 'orders@natureswaysoil.com'

          const itemsHtml = (full.line_items?.data || [])
            .map(li => `<li>${li.quantity} × ${li.description} — $${(li.amount_total/100).toFixed(2)}</li>`)
            .join('')

          const total = (full.amount_total / 100).toFixed(2)

          await resend.emails.send({
            from,
            to: email,
            subject: `Your Nature's Way Soil order #${full.id}`,
            html: `
              <div style="font-family:system-ui,Segoe UI,Roboto,sans-serif">
                <h2>Thanks for your order!</h2>
                <p>We received your order and will let you know when it ships.</p>
                <h3>Order summary</h3>
                <ul>${itemsHtml}</ul>
                <p><strong>Total: $${total}</strong></p>
              </div>
            `
          })
        } catch {}
      }
    } catch (e) {
      // swallow errors but return 200 to avoid Stripe retries storm
    }
  }

  return NextResponse.json({ received: true })
}
