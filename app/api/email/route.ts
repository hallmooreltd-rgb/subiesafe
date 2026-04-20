import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase'
import { resend } from '@/lib/resend'

const DOC_TYPE_LABELS: Record<string, string> = {
  'variation-order': 'Variation Order',
  'delay-notice': 'Delay Notice',
  'payment-notice': 'Payment Notice',
  'pay-less-notice': 'Pay Less Notice',
  'daywork-sheet': 'Daywork Sheet',
  'site-instruction-record': 'Site Instruction Record',
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    // Check pro plan for email feature
    const serviceClient = createServiceClient()
    const { data: profile } = await serviceClient
      .from('subiesafe_profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    if (profile?.plan !== 'pro') {
      return NextResponse.json(
        { error: 'Email sending is a Pro feature. Please upgrade.', requiresPro: true },
        { status: 403 }
      )
    }

    const { to, documentId, document, docType, senderName } = await req.json()

    const docLabel = DOC_TYPE_LABELS[docType] || docType
    const docNumber = (document?.documentNumber as string) || documentId

    // Format document as readable text for email body
    const docText = Object.entries(document as Record<string, unknown>)
      .filter(([key]) => !['footer'].includes(key))
      .map(([key, value]) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
        if (Array.isArray(value)) {
          if (typeof value[0] === 'object') {
            return `${label}:\n${value.map(row =>
              Object.entries(row as Record<string, unknown>).map(([k, v]) => `  ${k}: ${v}`).join('\n')
            ).join('\n')}`
          }
          return `${label}:\n${value.map(v => `  • ${v}`).join('\n')}`
        }
        return `${label}: ${value}`
      })
      .join('\n\n')

    await resend.emails.send({
      from: 'SubieSafe <noreply@subiesafe.com>',
      to,
      subject: `${docLabel} - ${docNumber} from ${senderName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; background: #f8fafc;">
          <div style="background: #0f172a; padding: 24px 32px;">
            <h1 style="color: #f59e0b; margin: 0; font-size: 22px;">SubieSafe</h1>
            <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">AI Paper Trail Engine for UK Subcontractors</p>
          </div>
          <div style="padding: 32px;">
            <h2 style="color: #0f172a; margin-top: 0;">Formal ${docLabel}</h2>
            <p style="color: #475569;">
              <strong>${senderName}</strong> has sent you this formal <strong>${docLabel}</strong>
              (Ref: ${docNumber}) via SubieSafe.
            </p>
            <p style="color: #475569; font-size: 13px; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px; padding: 12px;">
              ⚠️ This document has been formally generated under the Housing Grants, Construction &amp;
              Regeneration Act 1996 (HGCRA) and is part of a legal paper trail. Please respond promptly.
            </p>
            <div style="background: #fff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin: 20px 0;">
              <pre style="font-family: 'Courier New', monospace; font-size: 12px; color: #1e293b; white-space: pre-wrap; margin: 0;">${docText}</pre>
            </div>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">
              Sent via SubieSafe · subiesafe.com · This document is time-stamped and stored securely.
            </p>
          </div>
        </div>
      `,
    })

    // Update document record with emailed_to
    if (documentId) {
      await serviceClient
        .from('subiesafe_documents')
        .update({ emailed_to: to })
        .eq('id', documentId)
        .eq('user_id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
