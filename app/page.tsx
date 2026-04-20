'use client'
import Link from 'next/link'
import {
  ShieldCheck,
  FileText,
  Zap,
  Lock,
  CheckCircle,
  ArrowRight,
  HardHat,
  MessageSquare,
  Download,
  Mail,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Nav */}
      <nav className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HardHat className="w-7 h-7 text-amber-400" />
            <span className="text-xl font-bold text-white">SubieSafe</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-slate-400 hover:text-white text-sm transition-colors">
              Pricing
            </Link>
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-lg text-sm hover:bg-amber-300 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 rounded-full px-4 py-2 text-amber-400 text-sm font-medium mb-8">
          <ShieldCheck className="w-4 h-4" />
          HGCRA 1996 compliant documents in seconds
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
          Stop losing money on jobs you&apos;ve{' '}
          <span className="text-amber-400">already done</span>
        </h1>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          UK subbies lose thousands every year because verbal instructions never get formalised.
          SubieSafe turns your WhatsApp messages and voice notes into legally valid construction
          documents in under 60 seconds.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="bg-amber-400 text-slate-900 font-bold px-8 py-4 rounded-xl text-lg hover:bg-amber-300 transition-colors flex items-center justify-center gap-2"
          >
            Start for free <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/pricing"
            className="border border-slate-700 text-white font-semibold px-8 py-4 rounded-xl text-lg hover:border-amber-400 transition-colors"
          >
            View pricing
          </Link>
        </div>
        <p className="text-slate-500 text-sm mt-4">Free plan: 3 documents/month. No credit card required.</p>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">How it works</h2>
          <p className="text-slate-400 text-center mb-12 max-w-xl mx-auto">
            From a WhatsApp message to a formal legal document in three steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="w-8 h-8 text-amber-400" />,
                step: '01',
                title: 'Paste or record',
                desc: 'Paste the WhatsApp message, email, or voice note transcript from your site manager.',
              },
              {
                icon: <Zap className="w-8 h-8 text-amber-400" />,
                step: '02',
                title: 'AI generates the document',
                desc: 'Our AI classifies what type of document is needed and generates a formal, legally valid version in seconds.',
              },
              {
                icon: <Download className="w-8 h-8 text-amber-400" />,
                step: '03',
                title: 'Download or email it',
                desc: 'Download as PDF or email it directly to the site manager with one tap. Date-stamped and saved to your audit trail.',
              },
            ].map((step) => (
              <div key={step.step} className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
                <div className="text-slate-600 font-bold text-4xl mb-4">{step.step}</div>
                <div className="mb-4">{step.icon}</div>
                <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
                <p className="text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document types */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Document types</h2>
          <p className="text-slate-400 text-center mb-12">
            Every formal document a UK subcontractor needs
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Variation Order', desc: 'Extra work & scope changes' },
              { name: 'Delay Notice', desc: 'Claim time extensions' },
              { name: 'Payment Notice', desc: 'Section 110A HGCRA 1996' },
              { name: 'Pay Less Notice', desc: 'Section 111 HGCRA 1996' },
              { name: 'Daywork Sheet', desc: 'Time & materials record' },
              { name: 'Site Instruction Record', desc: 'Document verbal orders' },
            ].map((doc) => (
              <div
                key={doc.name}
                className="bg-slate-800 border border-slate-700 hover:border-amber-400/50 transition-colors rounded-xl p-6"
              >
                <FileText className="w-6 h-6 text-amber-400 mb-3" />
                <div className="font-bold text-white mb-1">{doc.name}</div>
                <div className="text-slate-400 text-sm">{doc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof / trust */}
      <section className="px-6 py-20 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Built for UK subcontractors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Lock className="w-6 h-6 text-amber-400" />,
                title: 'HGCRA 1996 compliant',
                desc: 'Every document meets the requirements of the Housing Grants, Construction & Regeneration Act 1996.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-amber-400" />,
                title: 'Secure audit trail',
                desc: 'Every document is date-stamped, stored securely, and retrievable if you ever need to dispute a payment.',
              },
              {
                icon: <Mail className="w-6 h-6 text-amber-400" />,
                title: 'Email directly to site',
                desc: 'Send the formal document directly to the site manager or main contractor from within the app.',
              },
            ].map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-amber-400/10 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote:
                  '"Used to lose thousands because the site manager would verbally agree extra work then deny it. Now I have everything documented the same day."',
                name: 'Dave T.',
                role: 'Electrical subcontractor, Manchester',
              },
              {
                quote:
                  '"Took me 3 minutes to turn a WhatsApp thread into a proper Variation Order. Site manager signed it off same day. Game changer."',
                name: 'Ricky M.',
                role: 'Plumbing subbi, Birmingham',
              },
            ].map((t) => (
              <div key={t.name} className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400">★</span>
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">{t.quote}</p>
                <div>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-slate-500 text-sm">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Start protecting your money today
          </h2>
          <p className="text-slate-400 mb-8">
            3 documents free every month. No credit card. No setup.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {[
              'Free plan — 3 docs/month',
              'Pro — £29/month unlimited',
              'Cancel anytime',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-300 text-sm">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/signup"
            className="bg-amber-400 text-slate-900 font-bold px-10 py-4 rounded-xl text-lg hover:bg-amber-300 transition-colors inline-flex items-center gap-2"
          >
            Create your free account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            <span className="font-bold text-white">SubieSafe</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} SubieSafe. Built for UK subcontractors.
          </p>
          <div className="flex gap-4 text-slate-500 text-sm">
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-white transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
