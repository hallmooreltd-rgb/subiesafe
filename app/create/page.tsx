'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  HardHat,
  MessageSquare,
  Mic,
  Loader2,
  FileText,
  Download,
  Mail,
  ChevronDown,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react'

const DOC_TYPES = [
  { value: 'auto', label: '✨ Auto-detect (recommended)' },
  { value: 'variation-order', label: 'Variation Order' },
  { value: 'delay-notice', label: 'Delay Notice' },
  { value: 'payment-notice', label: 'Payment Notice' },
  { value: 'pay-less-notice', label: 'Pay Less Notice' },
  { value: 'daywork-sheet', label: 'Daywork Sheet' },
  { value: 'site-instruction-record', label: 'Site Instruction Record' },
]

type Step = 'input' | 'generating' | 'preview'

export default function CreatePage() {
  const [step, setStep] = useState<Step>('input')
  const [inputText, setInputText] = useState('')
  const [docType, setDocType] = useState('auto')
  const [contractorName, setContractorName] = useState('')
  const [projectName, setProjectName] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [generatedDoc, setGeneratedDoc] = useState<Record<string, unknown> | null>(null)
  const [detectedType, setDetectedType] = useState('')
  const [documentId, setDocumentId] = useState('')
  const [error, setError] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailSending, setEmailSending] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleAudioUpload = async (file: File) => {
    setAudioFile(file)
    setTranscribing(true)
    const formData = new FormData()
    formData.append('audio', file)
    try {
      const res = await fetch('/api/transcribe', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.text) setInputText(data.text)
    } catch {
      setError('Transcription failed. Please paste the text manually.')
    }
    setTranscribing(false)
  }

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to generate a document.')
      return
    }
    setError('')
    setStep('generating')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: inputText,
          docType: docType === 'auto' ? null : docType,
          contractorName,
          projectName,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.limitReached) {
          setError('You have reached your free monthly limit. Please upgrade to Pro.')
          setStep('input')
          return
        }
        throw new Error(data.error || 'Generation failed')
      }
      setGeneratedDoc(data.document)
      setDetectedType(data.docType)
      setDocumentId(data.id)
      setStep('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('input')
    }
  }

  const handleDownload = async () => {
    const res = await fetch('/api/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ document: generatedDoc, docType: detectedType }),
    })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${detectedType}-${documentId}.pdf`
    a.click()
  }

  const handleEmail = async () => {
    if (!emailAddress) return
    setEmailSending(true)
    await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: emailAddress,
        documentId,
        document: generatedDoc,
        docType: detectedType,
        senderName: contractorName || 'The Subcontractor',
      }),
    })
    setEmailSent(true)
    setEmailSending(false)
  }

  const DOC_TYPE_LABELS: Record<string, string> = {
    'variation-order': 'Variation Order',
    'delay-notice': 'Delay Notice',
    'payment-notice': 'Payment Notice',
    'pay-less-notice': 'Pay Less Notice',
    'daywork-sheet': 'Daywork Sheet',
    'site-instruction-record': 'Site Instruction Record',
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <header className="border-b border-slate-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HardHat className="w-6 h-6 text-amber-400" />
            <span className="font-bold text-white">SubieSafe</span>
          </Link>
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Step: Input */}
        {step === 'input' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create document</h1>
              <p className="text-slate-400">
                Paste a WhatsApp message, email, or text — or upload a voice note
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mb-6">
                {error}
                {error.includes('limit') && (
                  <Link href="/pricing" className="ml-2 text-amber-400 underline">Upgrade →</Link>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your name / company</label>
                <input
                  type="text"
                  value={contractorName}
                  onChange={(e) => setContractorName(e.target.value)}
                  className="input-dark"
                  placeholder="Dave Smith Electrical"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Project name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="input-dark"
                  placeholder="Unit 7, Birchwood Estate"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">Document type</label>
              <div className="relative">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="input-dark appearance-none pr-10"
                >
                  {DOC_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Audio upload */}
            <div className="mb-4">
              <input
                ref={fileRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleAudioUpload(e.target.files[0])}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={transcribing}
                className="btn-slate mb-4 text-sm"
              >
                {transcribing ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Transcribing voice note...</>
                ) : (
                  <><Mic className="w-4 h-4" /> Upload voice note</>
                )}
              </button>
              {audioFile && !transcribing && (
                <span className="text-slate-400 text-sm ml-3">✓ {audioFile.name} transcribed</span>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1 text-amber-400" />
                Paste the message / communication
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="input-dark min-h-[200px] resize-y"
                placeholder={`Example:
"Mate, can you add the extra 3 sockets in the office on the third floor? The architect changed the layout. Should only take a day."`}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!inputText.trim()}
              className="btn-amber text-base px-8"
            >
              <FileText className="w-5 h-5" />
              Generate document
            </button>
          </div>
        )}

        {/* Step: Generating */}
        {step === 'generating' && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-amber-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-10 h-10 text-amber-400 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Generating your document</h2>
            <p className="text-slate-400">
              AI is analysing the communication and producing a formal legal document...
            </p>
          </div>
        )}

        {/* Step: Preview */}
        {step === 'preview' && generatedDoc && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {DOC_TYPE_LABELS[detectedType] || detectedType}
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                  Generated and saved to your audit trail ·{' '}
                  <span className="text-green-400 font-medium">✓ Saved</span>
                </p>
              </div>
              <div className="flex gap-3">
                <button onClick={handleDownload} className="btn-amber text-sm">
                  <Download className="w-4 h-4" /> Download PDF
                </button>
                <button
                  onClick={() => setStep('input')}
                  className="btn-slate text-sm"
                >
                  New document
                </button>
              </div>
            </div>

            {/* Document preview */}
            <div className="bg-white text-slate-900 rounded-2xl p-8 mb-6 shadow-xl">
              <div className="border-b-2 border-slate-900 pb-6 mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold uppercase tracking-wide">
                      {(generatedDoc.title as string) || DOC_TYPE_LABELS[detectedType]}
                    </h2>
                    {(generatedDoc.documentNumber as string) && (
                      <p className="text-slate-600 mt-1">Ref: {generatedDoc.documentNumber as string}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{generatedDoc.contractor as string}</p>
                    <p className="text-slate-600 text-sm">{generatedDoc.date as string}</p>
                  </div>
                </div>
                {(generatedDoc.project as string) && (
                  <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                    <p className="text-sm text-slate-600">Project:</p>
                    <p className="font-semibold">{generatedDoc.project as string}</p>
                  </div>
                )}
              </div>

              {/* Dynamic content rendering */}
              <div className="space-y-4">
                {Object.entries(generatedDoc).filter(([key]) =>
                  !['title', 'documentNumber', 'contractor', 'date', 'project', 'footer', 'signatoryLine', 'siteManagerSignature', 'acknowledgement'].includes(key)
                ).map(([key, value]) => {
                  const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())
                  if (Array.isArray(value)) {
                    return (
                      <div key={key}>
                        <h3 className="font-bold text-slate-700 mb-2">{label}</h3>
                        {typeof value[0] === 'object' ? (
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="bg-slate-100">
                                {Object.keys(value[0] as Record<string,unknown>).map(k => (
                                  <th key={k} className="text-left p-2 font-semibold border border-slate-200">
                                    {k.charAt(0).toUpperCase() + k.slice(1)}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {value.map((row, i) => (
                                <tr key={i} className="border-b border-slate-100">
                                  {Object.values(row as Record<string,unknown>).map((v, j) => (
                                    <td key={j} className="p-2 border border-slate-200">{v as string}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <ul className="list-disc list-inside space-y-1">
                            {value.map((item: unknown, i: number) => (
                              <li key={i} className="text-slate-700">{item as string}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )
                  }
                  return (
                    <div key={key} className="grid grid-cols-3 gap-2">
                      <div className="text-slate-600 font-medium text-sm">{label}:</div>
                      <div className="col-span-2 text-slate-800">{value as string}</div>
                    </div>
                  )
                })}
              </div>

              {/* Footer elements */}
              {((generatedDoc.signatoryLine as string) || (generatedDoc.siteManagerSignature as string)) && (
                <div className="mt-8 pt-6 border-t border-slate-200">
                  <p className="text-slate-700">{(generatedDoc.signatoryLine || generatedDoc.siteManagerSignature) as string}</p>
                </div>
              )}
              {(generatedDoc.acknowledgement as string) && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 italic">
                  {generatedDoc.acknowledgement as string}
                </div>
              )}
              {(generatedDoc.footer as string) && (
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <p className="text-xs text-slate-500 italic">{generatedDoc.footer as string}</p>
                </div>
              )}
            </div>

            {/* Email section */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-amber-400" />
                Email to site manager
              </h3>
              {emailSent ? (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Email sent to {emailAddress}
                </div>
              ) : (
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="input-dark flex-1"
                    placeholder="sitemanager@contractor.co.uk"
                  />
                  <button
                    onClick={handleEmail}
                    disabled={!emailAddress || emailSending}
                    className="btn-amber text-sm flex-shrink-0"
                  >
                    {emailSending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
