'use client'
import { useState } from 'react'
import Link from 'next/link'
import { HardHat, CheckCircle, Zap, Crown, ArrowRight, Loader2 } from 'lucide-react'

export default function PricingPage() {
  const [loading, setLoading] = useState(false)

  const handleUpgrade = async () => {
    setLoading(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else if (data.error === 'not_logged_in') {
      window.location.href = '/signup'
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-400" />
            <span className="font-bold text-white">SubieSafe</span>
          </Link>
          <div className="flex gap-4">
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Sign in</Link>
            <Link href="/signup" className="bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm hover:bg-amber-300 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">Simple, honest pricing</h1>
          <p className="text-slate-400 text-lg">Start free. Upgrade when you&apos;re ready.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free */}
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-slate-400" />
              <span className="font-bold text-white text-lg">Free</span>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-white">£0</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-slate-400 mb-8">Perfect for trying it out. No card required.</p>

            <ul className="space-y-3 mb-8">
              {[
                '3 documents per month',
                'All 6 document types',
                'PDF download',
                'Secure storage',
                'Audit trail',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="block w-full text-center border border-slate-600 text-white font-semibold py-3 rounded-xl hover:border-amber-400 transition-colors"
            >
              Start for free
            </Link>
          </div>

          {/* Pro */}
          <div className="bg-gradient-to-b from-amber-400/10 to-slate-800 border border-amber-400/50 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-amber-400 text-slate-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                Most popular
              </span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-white text-lg">Pro</span>
            </div>
            <div className="mb-6">
              <span className="text-5xl font-extrabold text-white">£29</span>
              <span className="text-slate-400">/month</span>
            </div>
            <p className="text-slate-400 mb-8">Unlimited documents, email sending, full audit trail.</p>

            <ul className="space-y-3 mb-8">
              {[
                'Unlimited documents',
                'All 6 document types',
                'PDF download',
                'Email direct to site manager',
                'Full audit trail',
                'Voice note transcription',
                'Priority support',
                'Cancel anytime',
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="btn-amber w-full justify-center text-base py-3"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Upgrade to Pro <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'Are SubieSafe documents legally valid?',
                a: 'SubieSafe generates documents that comply with the Housing Grants, Construction & Regeneration Act 1996 (HGCRA). However, they should be reviewed for your specific situation. SubieSafe is not a substitute for legal advice.',
              },
              {
                q: 'What document types can I create?',
                a: 'Variation Orders, Delay Notices, Payment Notices, Pay Less Notices, Daywork Sheets, and Site Instruction Records.',
              },
              {
                q: 'Can I cancel my Pro subscription?',
                a: 'Yes, at any time. No questions asked. You\'ll keep access until the end of your billing period.',
              },
              {
                q: 'Is my data secure?',
                a: 'All documents are encrypted and stored securely on Supabase with row-level security. Only you can access your documents.',
              },
            ].map((faq) => (
              <div key={faq.q} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
                <h3 className="font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
