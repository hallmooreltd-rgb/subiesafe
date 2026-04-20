import { createServerSupabaseClient, createServiceClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { HardHat, FileText, Plus, ArrowLeft, Mail } from 'lucide-react'

const DOC_TYPE_LABELS: Record<string, string> = {
  'variation-order': 'Variation Order',
  'delay-notice': 'Delay Notice',
  'payment-notice': 'Payment Notice',
  'pay-less-notice': 'Pay Less Notice',
  'daywork-sheet': 'Daywork Sheet',
  'site-instruction-record': 'Site Instruction Record',
}

const DOC_TYPE_COLOURS: Record<string, string> = {
  'variation-order': 'text-amber-400 bg-amber-400/10 border-amber-400/30',
  'delay-notice': 'text-orange-400 bg-orange-400/10 border-orange-400/30',
  'payment-notice': 'text-green-400 bg-green-400/10 border-green-400/30',
  'pay-less-notice': 'text-red-400 bg-red-400/10 border-red-400/30',
  'daywork-sheet': 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  'site-instruction-record': 'text-purple-400 bg-purple-400/10 border-purple-400/30',
}

export default async function DocumentsPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = createServiceClient()

  const { data: docs } = await serviceClient
    .from('subiesafe_documents')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-400" />
            <span className="font-bold text-white">SubieSafe</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">All documents</h1>
            <p className="text-slate-400 mt-1">Your complete audit trail</p>
          </div>
          <Link href="/create" className="btn-amber text-sm">
            <Plus className="w-4 h-4" /> New document
          </Link>
        </div>

        {docs && docs.length > 0 ? (
          <div className="space-y-3">
            {docs.map((doc) => {
              const colour = DOC_TYPE_COLOURS[doc.type] || DOC_TYPE_COLOURS['site-instruction-record']
              return (
                <div
                  key={doc.id}
                  className="bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors rounded-xl p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colour}`}>
                            {DOC_TYPE_LABELS[doc.type] || doc.type}
                          </span>
                        </div>
                        {doc.generated_content && (
                          <p className="text-white font-medium text-sm">
                            {(doc.generated_content as Record<string, unknown>).documentNumber as string || ''}
                            {((doc.generated_content as Record<string, unknown>).project as string) && (
                              <span className="text-slate-400 font-normal ml-2">
                                — {(doc.generated_content as Record<string, unknown>).project as string}
                              </span>
                            )}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span>
                            {new Date(doc.created_at).toLocaleDateString('en-GB', {
                              weekday: 'short',
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          {doc.emailed_to && (
                            <span className="flex items-center gap-1 text-green-400">
                              <Mail className="w-3 h-3" />
                              Emailed to {doc.emailed_to}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {doc.raw_input && (
                    <div className="mt-3 ml-14 bg-slate-900 rounded-lg px-4 py-2 border border-slate-700">
                      <p className="text-slate-500 text-xs">Original message:</p>
                      <p className="text-slate-400 text-sm truncate mt-0.5">{doc.raw_input}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">No documents yet</h3>
            <p className="text-slate-400 mb-6">
              Create your first document to start building your audit trail
            </p>
            <Link href="/create" className="btn-amber">
              <Plus className="w-4 h-4" /> Create first document
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
