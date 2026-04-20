import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase'
import { stripe, PRO_PRICE_ID } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'not_logged_in' }, { status: 401 })
    }

    const serviceClient = createServiceClient()

    // Get or create Stripe customer
    let { data: profile } = await serviceClient
      .from('subiesafe_profiles')
      .select('stripe_customer_id, plan')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email!,
        metadata: { supabase_user_id: user.id, app: 'subiesafe' },
      })
      customerId = customer.id

      await serviceClient
        .from('subiesafe_profiles')
        .upsert({ id: user.id, stripe_customer_id: customerId })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://subiesafe.vercel.app'

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
      success_url: `${siteUrl}/dashboard?upgraded=true`,
      cancel_url: `${siteUrl}/pricing`,
      metadata: { user_id: user.id, app: 'subiesafe' },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 })
  }
}
