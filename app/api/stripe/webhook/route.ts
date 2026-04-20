import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const serviceClient = createServiceClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      if (session.metadata?.app !== 'subiesafe') break
      const userId = session.metadata?.user_id
      if (userId) {
        await serviceClient
          .from('subiesafe_profiles')
          .upsert({ id: userId, plan: 'pro', stripe_customer_id: session.customer as string })
      }
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object
      // Find user by customer ID
      const { data: profiles } = await serviceClient
        .from('subiesafe_profiles')
        .select('id')
        .eq('stripe_customer_id', subscription.customer as string)

      if (profiles && profiles.length > 0) {
        await serviceClient
          .from('subiesafe_profiles')
          .update({ plan: 'free' })
          .eq('stripe_customer_id', subscription.customer as string)
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object
      console.log('Payment failed for customer:', invoice.customer)
      break
    }
  }

  return NextResponse.json({ received: true })
}
