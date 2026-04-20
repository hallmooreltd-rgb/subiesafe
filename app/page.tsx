'use client'
import Link from 'next/link'
import {
  ShieldCheck,
  FileText,
  Zap,
  CheckCircle,
  ArrowRight,
  HardHat,
  MessageSquare,
  Download,
  AlertTriangle,
  Clock,
  PoundSterling,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SubieSafe</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Pricing
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              How it works
            </Link>
            <Link href="#documents" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Documents
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-5 py-2.5 rounded-lg text-sm transition-colors"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-20 pb-16 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 text-amber-700 text-sm font-semibold mb-8">
              <ShieldCheck className="w-4 h-4" />
              Built for UK subcontractors
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 leading-[1.1] tracking-tight">
              Stop losing money on work you&apos;ve{' '}
              <span className="text-amber-500">already done</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Site manager texted you to do extras? Agreed something verbally on site?
              Turn it into a legally valid variation order, payment notice or delay notice
              in under 60 seconds — before the argument starts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/signup"
                className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
              >
                Try it free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-xl text-lg transition-colors text-center"
              >
                See how it works
              </Link>
            </div>
            <p className="text-gray-400 text-sm">3 documents free every month. No card required.</p>
          </div>

          {/* Demo card */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400 ml-2 font-mono">subiesafe.co.uk/create</span>
            </div>

            {/* WhatsApp message */}
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">WhatsApp from site manager</p>
              <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-600 italic">
                &quot;Mate can you run another 20 metres of first fix cable to the new office extension? Need it done before Thursday.&quot;
              </div>
            </div>

            <div className="flex items-center gap-2 my-4">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <Zap className="w-3 h-3" />
                AI generating document...
              </div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Generated document preview */}
            <div className="bg-white border-2 border-amber-400 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Variation Order</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">VO-2026-0041</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Issued</p>
                  <p className="text-xs font-semibold text-gray-700">20 Apr 2026 14:22</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3 border-t border-gray-100 pt-3">
                <strong>Variation:</strong> Supply and install 20 metres additional first fix electrical cable to new office extension as instructed by site manager on 20/04/2026.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 bg-amber-400 text-gray-900 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                  <Download className="w-3 h-3" /> Download PDF
                </button>
                <button className="flex-1 border border-gray-200 text-gray-600 text-xs font-semibold py-2 rounded-lg">
                  Email to site
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pain points banner */}
      <section className="bg-gray-900 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-400 text-sm font-semibold uppercase tracking-widest mb-8">Sound familiar?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <AlertTriangle className="w-5 h-5 text-red-400" />,
                title: '"I did the extra work but they won\'t pay for it"',
                desc: 'No written instruction = no legal entitlement. The main contractor wins every time.',
              },
              {
                icon: <Clock className="w-5 h-5 text-red-400" />,
                title: '"We agreed it on site but now they\'re denying it"',
                desc: 'Verbal agreements are worth nothing in construction disputes without a contemporaneous record.',
              },
              {
                icon: <PoundSterling className="w-5 h-5 text-red-400" />,
                title: '"I\'ve written off thousands because it\'s not worth the hassle"',
                desc: 'UK subbies lose an estimated £300m+ per year to disputed variations and unpaid extras.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">{item.icon}</div>
                <div>
                  <p className="font-semibold text-white mb-2 text-sm">{item.title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">From WhatsApp to legal document in 60 seconds</h2>
            <p className="text-gray-500 max-w-xl mx-auto">No legal knowledge needed. No forms to fill in. Just paste the message and let SubieSafe do the rest.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6 text-amber-500" />,
                step: '1',
                title: 'Paste the message',
                desc: 'Copy the WhatsApp text, email, or type out what was said on site. You can also upload a voice note.',
              },
              {
                icon: <Zap className="w-6 h-6 text-amber-500" />,
                step: '2',
                title: 'AI creates the document',
                desc: 'SubieSafe identifies what type of document is needed and generates a formally worded, HGCRA-compliant version.',
              },
              {
                icon: <Download className="w-6 h-6 text-amber-500" />,
                step: '3',
                title: 'Send it immediately',
                desc: 'Download as PDF or email directly to the site manager. Date-stamped and saved to your audit trail.',
              },
            ].map((step) => (
              <div key={step.step} className="relative">
                <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-600 mb-5 text-lg">
                  {step.step}
                </div>
                <div className="mb-3">{step.icon}</div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Document types */}
      <section id="documents" className="px-6 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Every document a subcontractor needs</h2>
            <p className="text-gray-500">All generated under the Housing Grants, Construction & Regeneration Act 1996</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: 'Variation Order', desc: 'Extra works & scope changes', tag: 'Most used' },
              { name: 'Payment Notice', desc: 'Section 110A HGCRA 1996', tag: '' },
              { name: 'Delay Notice', desc: 'Time extension claims', tag: '' },
              { name: 'Pay Less Notice', desc: 'Section 111 HGCRA 1996', tag: '' },
              { name: 'Daywork Sheet', desc: 'Time & materials records', tag: '' },
              { name: 'Site Instruction Record', desc: 'Document verbal orders', tag: '' },
            ].map((doc) => (
              <div
                key={doc.name}
                className="bg-white border border-gray-200 hover:border-amber-400 hover:shadow-sm transition-all rounded-xl p-5 relative"
              >
                {doc.tag && (
                  <span className="absolute top-3 right-3 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    {doc.tag}
                  </span>
                )}
                <FileText className="w-5 h-5 text-amber-500 mb-3" />
                <div className="font-bold text-gray-900 mb-1 text-sm">{doc.name}</div>
                <div className="text-gray-400 text-xs">{doc.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">What subcontractors say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                quote: 'Used to write off thousands because the site manager would verbally agree extra work then deny it come invoice time. Now I have everything documented on the day.',
                name: 'Dave T.',
                role: 'Electrical subcontractor, Manchester',
                initials: 'DT',
              },
              {
                quote: 'Took me 3 minutes to turn a WhatsApp thread into a proper Variation Order. Site manager signed it off same day. Should have had this years ago.',
                name: 'Ricky M.',
                role: 'Plumbing contractor, Birmingham',
                initials: 'RM',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-amber-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700 text-sm">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="px-6 py-20 bg-amber-400">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
            Start protecting your money today
          </h2>
          <p className="text-gray-800 mb-8 text-lg">
            3 documents free every month. Pro is £29/month for unlimited documents, email sending, and full audit trail.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {['Free plan included', 'No credit card', 'Cancel anytime'].map((item) => (
              <div key={item} className="flex items-center gap-2 text-gray-800 text-sm font-semibold justify-center">
                <CheckCircle className="w-4 h-4" />
                {item}
              </div>
            ))}
          </div>
          <Link
            href="/signup"
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors inline-flex items-center gap-2"
          >
            Create your free account <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-8 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-400 rounded flex items-center justify-center">
              <HardHat className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">SubieSafe</span>
          </div>
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} SubieSafe. Built for UK subcontractors. HGCRA 1996 compliant documents.
          </p>
          <div className="flex gap-6 text-gray-400 text-sm">
            <Link href="/pricing" className="hover:text-gray-700 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-gray-700 transition-colors">Sign in</Link>
            <Link href="/signup" className="hover:text-gray-700 transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
