# SubieSafe — Build Complete ✅

**Built:** 2026-04-20  
**Status:** LIVE  
**URL:** https://subiesafe.vercel.app  
**GitHub:** https://github.com/hallmooreltd-rgb/subiesafe  
**Vercel Project ID:** prj_WNRLTj01VCy9c9RXAYhneqDWXx80  

---

## What Was Built

SubieSafe is a complete MVP SaaS — an AI paper trail engine for UK subcontractors. It converts informal WhatsApp messages, voice notes, and emails into legally valid UK construction documents under HGCRA 1996.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16.2.4 (App Router, Turbopack) |
| Auth | Supabase (email/password) |
| Database | Supabase Postgres (RLS enabled) |
| AI | OpenAI GPT-4o (doc generation), Whisper (voice transcription) |
| Payments | Stripe (live mode, £29/month Pro) |
| Email | Resend |
| Hosting | Vercel (team: team_jxkvQ6vW8uXRw8Ftwbrgb4mu) |
| PDF | HTML → browser print-to-PDF |

---

## Pages Built

| Route | Description |
|---|---|
| `/` | Landing page — dark slate/amber construction theme |
| `/signup` | Email/password registration |
| `/login` | Auth |
| `/dashboard` | Authenticated home — doc stats, recent docs |
| `/create` | Main tool — paste text or upload voice note, AI generates doc |
| `/documents` | Full audit trail with all documents |
| `/pricing` | Free vs Pro comparison |
| `/api/generate` | GPT-4o document classification + generation |
| `/api/transcribe` | Whisper voice-to-text |
| `/api/email` | Resend email to site manager (Pro only) |
| `/api/pdf` | HTML PDF generation |
| `/api/stripe/checkout` | Stripe checkout session creation |
| `/api/stripe/webhook` | Stripe subscription lifecycle |
| `/api/auth/logout` | Sign out |

---

## Document Types

1. **Variation Order** — Extra work, scope changes
2. **Delay Notice** — Section 110A / HGCRA delay claims
3. **Payment Notice** — Section 110A payment applications
4. **Pay Less Notice** — Section 111 payment disputes
5. **Daywork Sheet** — Time and materials record
6. **Site Instruction Record** — Verbal instruction documentation

---

## Pricing

| Plan | Price | Limits |
|---|---|---|
| Free | £0/month | 3 documents/month |
| Pro | £29/month | Unlimited + email sending |

**Stripe Price ID (Pro):** `price_1TOHfmAbDiKuXuQPVFpj2LG9`  
**Stripe Product ID:** `prod_UN1juGnIcYvhbF`  

---

## Database Tables Created

```sql
-- subiesafe_documents
id uuid, user_id uuid, type text, raw_input text,
generated_content jsonb, pdf_url text, emailed_to text, created_at timestamptz

-- subiesafe_profiles  
id uuid, plan text (free|pro), stripe_customer_id text, created_at, updated_at
```

- Row Level Security enabled on both tables
- Auto-trigger creates profile on user signup

---

## Environment Variables (Vercel)

All 10 env vars set on production/preview/development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRO_PRICE_ID`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SITE_URL`

---

## Post-Launch Checklist

- [ ] Add Stripe webhook endpoint in Stripe dashboard → `https://subiesafe.vercel.app/api/stripe/webhook` (events: checkout.session.completed, customer.subscription.deleted, invoice.payment_failed)
- [ ] Verify Resend domain for `subiesafe.com` or update email from address
- [ ] Add `subiesafe.com` domain in Vercel project settings
- [ ] Test full flow: signup → create doc → download PDF → upgrade to Pro → email doc
- [ ] Add Google Analytics / Posthog for tracking

---

## Build Notes

- `npm run build` passes cleanly — 17 routes, 0 errors
- Used `proxy.ts` instead of `middleware.ts` (Next.js 16 convention)
- Supabase client/server split into separate lib files to avoid SSR conflicts
- PDF generation uses HTML template served as text/html (browser prints to PDF) — avoids @react-pdf/renderer SSR issues
- Voice transcription uploads audio to Whisper API via FormData

---

*Built by Jarvis (OpenClaw AI) for Dan Hall / Hallmoor Ltd*
