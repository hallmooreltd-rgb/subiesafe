import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase'
import { classifyDocument, generateDocument, DocumentType } from '@/lib/openai'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    }

    const serviceClient = createServiceClient()

    // Check plan and monthly usage
    const { data: profile } = await serviceClient
      .from('subiesafe_profiles')
      .select('plan')
      .eq('id', user.id)
      .single()

    const isPro = profile?.plan === 'pro'

    if (!isPro) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count } = await serviceClient
        .from('subiesafe_documents')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      if ((count || 0) >= 3) {
        return NextResponse.json(
          { error: 'Monthly limit reached. Please upgrade to Pro.', limitReached: true },
          { status: 403 }
        )
      }
    }

    const { input, docType, contractorName, projectName } = await req.json()

    if (!input || typeof input !== 'string') {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 })
    }

    // Classify if auto
    const resolvedType: DocumentType = docType
      ? (docType as DocumentType)
      : await classifyDocument(input)

    // Generate document
    const document = await generateDocument(
      input,
      resolvedType,
      contractorName || user.email?.split('@')[0] || 'The Subcontractor',
      projectName || 'The Project'
    )

    // Save to database
    const { data: saved, error: saveError } = await serviceClient
      .from('subiesafe_documents')
      .insert({
        user_id: user.id,
        type: resolvedType,
        raw_input: input,
        generated_content: document,
      })
      .select('id')
      .single()

    if (saveError) {
      console.error('Save error:', saveError)
    }

    return NextResponse.json({
      document,
      docType: resolvedType,
      id: saved?.id || 'unknown',
    })
  } catch (error) {
    console.error('Generate error:', error)
    return NextResponse.json(
      { error: 'Failed to generate document' },
      { status: 500 }
    )
  }
}
