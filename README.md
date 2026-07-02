# Precision Plaster Linings

Production-ready website for Precision Plaster Linings — a professional Australian plastering company.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Lucide React** (icons)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy — no extra configuration needed

## Configuration

Edit business details in **`src/lib/site-config.ts`**:

- Location & service area
- Phone, email, address
- Social media links
- SEO keywords

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home with hero, services, quote form, gallery, testimonials, FAQ |
| `/about` | Company story and values |
| `/services` | All services overview |
| `/services/[slug]` | Individual service detail |
| `/gallery` | Masonry image gallery with filters |
| `/projects` | Before/after project case studies |
| `/testimonials` | Client reviews |
| `/faq` | Frequently asked questions |
| `/contact` | Contact information |
| `/quote` | Dedicated quote request form |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Quote Form Integration

The quote form posts to `/api/quote`. To send emails in production, integrate a service like [Resend](https://resend.com) or [SendGrid](https://sendgrid.com) in `src/app/api/quote/route.ts`.

## SEO

- Metadata on every page (title, description, Open Graph, Twitter Cards)
- JSON-LD structured data (LocalBusiness, FAQ, Breadcrumbs)
- Auto-generated sitemap and robots.txt
- Semantic HTML and ARIA labels

## Quote Assistant

A rule-based conversational widget (not an LLM) appears on every page via the floating **Get a Quote** button.

### Architecture

```
src/lib/quote-assistant/
├── types.ts      # Answer types, step definitions
├── flow.ts       # Decision tree — resolveFlow() builds step order from answers
├── summary.ts    # Professional quote summary (text + HTML)
└── email.ts      # Resend integration with console fallback

src/hooks/useQuoteAssistant.ts   # State machine (messages, answers, step progression)
src/components/quote-assistant/  # Chat UI widget
src/app/api/quote-assistant/     # FormData endpoint → email delivery
```

### Conditional follow-ups

| Answer | Additional questions |
|--------|---------------------|
| Patch Repair | Hole size (small / medium / large) |
| Commercial work type | Business name, floor count, site access |
| Residential (non-repair) | New home or renovation |
| Water damage = Yes | Damage description |
| Commercial property | Business name, floors, access hours |

### Email setup

Copy `.env.example` to `.env.local` and add your Resend API key:

```
RESEND_API_KEY=re_xxxxxxxx
QUOTE_EMAIL_TO=info@precisionplasterlinings.com.au
QUOTE_EMAIL_FROM=quotes@precisionplasterlinings.com.au
```

Without `RESEND_API_KEY`, submissions log to the server console (no fake delivery). Photos are attached when email is configured.

## Lead Scoring & Dashboard

Every enquiry from the quote form or quote assistant is automatically scored (0–100) using a transparent rule-based system — not fake AI.

### Scoring factors (100 points total)

| Factor | Max | What it measures |
|--------|-----|------------------|
| Budget | 20 | Stated budget range |
| Urgency | 20 | Timeline / start date |
| Project Value | 15 | Size + square metres |
| Commercial Size | 15 | Floor count (commercial only) |
| Location | 10 | Suburb / service area |
| Complexity | 10 | Job type, water damage, detail |
| Property Type | 10 | Residential vs commercial |

### Priority tiers

- **Hot (80+)** — Contact immediately
- **High (60–79)** — Follow up within 2 hours
- **Medium (40–59)** — Follow up within 24 hours
- **Low (<40)** — Standard queue

### Owner dashboard

Visit **`/dashboard`** and sign in with `DASHBOARD_PASSWORD` (set in `.env.local`).

Features:
- Hot lead alerts with score rings
- Filter by priority
- Full score breakdown per enquiry
- Update lead status (new → contacted → quoted → won/lost)
- Stats: hot count, new today, average score

Leads are stored in `data/leads.json` locally. For Vercel production, migrate to a database (Supabase, PlanetScale, etc.).

## License

Private — Precision Plaster Linings
