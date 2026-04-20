import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SubieSafe — Stop Losing Money on Jobs You\'ve Already Done',
  description:
    'Convert WhatsApp messages and verbal agreements into legally valid UK construction documents. Variation Orders, Payment Notices, Delay Notices — instant paper trail under HGCRA 1996.',
  keywords: 'subcontractor, construction, variation order, payment notice, HGCRA, UK, paper trail',
  openGraph: {
    title: 'SubieSafe — AI Paper Trail for UK Subcontractors',
    description: 'Stop losing money on jobs you\'ve already done. Turn informal messages into formal legal documents in seconds.',
    url: 'https://subiesafe.co.uk',
    siteName: 'SubieSafe',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
