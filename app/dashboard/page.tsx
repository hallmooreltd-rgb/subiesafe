import { createServerSupabaseClient } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import {
  HardHat,
  FileText,
  Plus,
  LogOut,
  Crown,
  TrendingUp,
} from 'lucide-react'

const DOC_TYPE_LABELS: Record<string, string> = {
  'variation-order': 'Variation Order',
  'delay-notice': 'Delay Notice',
  'payment-notice': 'Payment Notice',
  'pay-less-notice': 'Pay Less Notice',
  'daywork-sheet': 'Daywork Sheet',
  'site-instruction-record': 'Site Instruction Record',
}

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const serviceClient = createServiceClient()

  // Get this month's document count
  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const { data: docs, count } = await serviceClient
    .from('subiesafe_documents')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: monthCount } = await serviceClient
    .from('subiesafe_documents')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('created_at', startOfMonth.toISOString())

  // Check if pro
  const { data: profile } = await serviceClient
    .from('subiesafe_profiles')
    .select('plan, stripe_customer_id')
    .eq('id', user.id)
    .single()

  const isPro = profile?.plan === 'pro'
  const docsThisMonth = monthCount || 0
  const freeLimit = 3

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-400" />
            <span className="font-bold text-white">SubieSafe</span>
          </Link>
          <div className="flex items-center gap-4">
            {isPro && (
              <span className="flex items-center gap-1 text-amber-400 text-sm font-medium">
                <Crown className="w-4 h-4" /> Pro
              </span>
            )}
            <span className="text-slate-400 text-sm">{user.email}</span>
            <form action="/api/auth/logout" method="POST">
              <button className="text-slate-400 hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Docs this month</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {docsThisMonth}
              {!isPro && <span className="text-slate-500 text-lg font-normal"> / {freeLimit}</span>}
            </div>
            {!isPro && docsThisMonth >= freeLimit && (
              <Link
                href="/pricing"
                className="mt-3 inline-block text-amber-400 text-sm hover:text-amber-300"
              >
                Upgrade for unlimited →
              </Link>
            )}
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Total documents</span>
            </div>
            <div className="text-3xl font-bold text-white">{count || 0}</div>
          </div>
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="text-slate-400 text-sm">Plan</span>
            </div>
            <div className="text-2xl font-bold text-white">
              {isPro ? 'Pro' : 'Free'}
            </div>
            {!isPro && (
              <Link href="/pricing" className="mt-2 inline-block text-amber-400 text-sm hover:text-amber-300">
                Upgrade to Pro →
              </Link>
            )}
          </div>
        </div>

        {/* Quick action */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Recent documents</h2>
          <Link
            href={!isPro && docsThisMonth >= freeLimit ? '/pricing' : '/create'}
            className="btn-amber text-sm"
          >
            <Plus className="w-4 h-4" />
            {!isPro && docsThisMonth >= freeLimit ? 'Upgrade to create' : 'New document'}
          </Link>
        </div>

        {/* Recent docs */}
        {docs && docs.length > 0 ? (
          <div className="space-y-3">
            {docs.map((doc: Record<string, unknown>) => (
              <div
                key={doc.id as string}
                className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-400/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {DOC_TYPE_LABELS[doc.type as string] || doc.type as string}
                    </div>
                    <div className="text-slate-400 text-sm">
                      {new Date(doc.created_at as string).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {(doc.emailed_to as string) && (
                        <span className="ml-3 text-green-400">✓ Emailed to {doc.emailed_to as string}</span>
                      )}
                    </div>
                  </div>
                </div>
                <Link
                  href={`/documents`}
                  className="text-amber-400 text-sm hover:text-amber-300 font-medium"
                >
                  View all →
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-white font-bold text-lg mb-2">No documents yet</h3>
            <p className="text-slate-400 mb-6">
              Create your first document to start building your paper trail
            </p>
            <Link href="/create" className="btn-amber">
              <Plus className="w-4 h-4" />
              Create first document
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
