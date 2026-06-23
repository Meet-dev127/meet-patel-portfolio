# Handoff: Meet Patel Portfolio — Full Site

## Overview
This is the complete design handoff for Meet Patel's personal portfolio website. The site is a multi-page portfolio for a cloud-certified web developer and data analyst based in Saint John, New Brunswick, Canada.

The design is fully built-out in HTML with a custom design system (CSS variables, components, layout patterns). The developer's job is to **recreate these HTML designs in a production codebase** using the framework of their choice (recommended: Next.js 14 with App Router, or plain HTML/CSS deployed on Azure Static Web Apps).

---

## Fidelity
**High-fidelity.** These are pixel-complete design references with:
- Final colors (all as CSS variables — see Design Tokens section)
- Final typography (Geist + Geist Mono from Google Fonts)
- Final spacing, border-radius, shadows
- All copy, headings, and microcopy finalized
- Hover/active/focus states defined in CSS
- Scroll-reveal animations defined
- Mobile responsive breakpoints at 720px and 1024px
- All structured data (JSON-LD) written and ready to copy

**Do NOT ship the HTML files directly.** They are design references. Recreate them in the production framework using existing patterns and libraries.

---

## Site Map

| Page | File | Route |
|---|---|---|
| Home | `Portfolio Animated v2.html` | `/` |
| About | `about.html` | `/about` |
| Contact | `contact.html` | `/contact` |
| Projects Index | `projects/index.html` | `/projects` |
| ResumeATS Case Study | `projects/resumeats.html` | `/projects/resumeats` |
| SBA 504 Dashboard | `projects/sba-504-dashboard.html` | `/projects/sba-504-dashboard` |
| ContentOS | `projects/contentos.html` | `/projects/contentos` |
| PodcastBrain | `projects/podcastbrain.html` | `/projects/podcastbrain` |
| AutoShare Plugin | `projects/autoshare.html` | `/projects/autoshare` |
| Blog Index | `blog/index.html` | `/blog` |
| Blog: SEO Podcast Platform | `blog/podcast-review-platform-seo.html` | `/blog/podcast-review-platform-seo` |
| Blog: ATS Resume with GPT-4 | `blog/ats-resume-optimizer-gpt4.html` | `/blog/ats-resume-optimizer-gpt4` |
| Blog: Power BI Financial Dashboard | `blog/power-bi-financial-dashboard.html` | `/blog/power-bi-financial-dashboard` |

---

## Shared CSS Files

| File | Purpose |
|---|---|
| `styles.css` | **Primary design system** — all CSS variables, typography, layout, component classes |
| `enhancements.css` | Hero v2 upgrades, illustration styles, additional section polish |
| `scroll-fx.css` | Scroll-reveal animation states (`.reveal` / `.reveal.in`) |
| `scroll-fx.js` | IntersectionObserver that adds `.in` to `.reveal` elements on scroll |
| `partials.js` | Injects shared nav, footer CTA, and footer HTML into pages that use `id="site-nav"`, `id="site-cta"`, `id="site-footer"` |

---

## Design Tokens

All color, spacing, and type tokens live in `:root {}` in `styles.css`. Copy this block verbatim into your global CSS or Tailwind config.

### Colors

```css
--cloud-white:    #FFFFFF;   /* page background */
--cloud-surface:  #FFFFFF;   /* card backgrounds */
--cloud-mist:     #F3F6F3;   /* alt section bg, tags, input fields */
--cloud-fog:      #E4EAE4;   /* hairlines, borders */
--card-border:    #E2E9E2;   /* card edges */
--cloud-shadow:   #C7CFC7;   /* subtle shadows */
--cloud-dusk:     #6F7670;   /* muted / secondary text */
--cloud-slate:    #3B423C;   /* body text */
--cloud-ink:      #16201A;   /* headings, near-black green */

/* Accent — emerald. Use for actions, links, highlights ONLY */
--accent:         #0E8A6B;
--accent-strong:  #0A6E55;
--accent-soft:    rgba(14,138,107,0.10);
--accent-line:    rgba(14,138,107,0.22);
--on-accent:      #FFFFFF;

/* Dark feature band */
--feature-bg:     #0C1F18;   /* deep emerald-black */
--feature-fg:     #ECF4EF;   /* light text on dark band */
--feature-muted:  #A4BBAE;   /* secondary text on dark band */
--feature-accent: #34D399;   /* light mint mark ON dark band only */
```

### Typography

```
Font Display: "Geist" — headings, brand name, large text
Font Sans:    "Geist" — body, labels, buttons
Font Mono:    "Geist Mono" — eyebrows, tags, code, metadata, numbers
```

Google Fonts import:
```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Spacing Scale (sections)
```css
.section        { padding: 96px 0; }
.section.tight  { padding: 80px 0; }
.section.mist   { background: var(--cloud-mist); }
.section.feature{ background: var(--feature-bg); }  /* dark band */
```

### Border Radius
```css
--radius-card:  16px;
--radius-md:    12px;
--radius-sm:    8px;
```

### Shadows
```css
--shadow-cloud:       0 1px 2px rgba(16,32,26,0.05), 0 6px 16px rgba(16,32,26,0.06), 0 14px 36px rgba(16,32,26,0.07);
--shadow-cloud-hover: 0 2px 6px rgba(16,32,26,0.08), 0 12px 28px rgba(16,32,26,0.10), 0 24px 52px rgba(16,32,26,0.12);
```

### Easing
```css
--ease-cloud: cubic-bezier(0.22, 0.61, 0.36, 1);
```

### Container
```css
--container: 1200px;
--gutter:    32px;   /* 22px at ≤720px */
```

---

## Pages — Detailed Specs

---

### 1. Home (`/`)
**File:** `Portfolio Animated v2.html`

#### Sections (top to bottom)
1. **Navbar** — fixed, transparent on load, frosted glass (`backdrop-filter: blur(16px)`) when scrolled. Logo left (wordmark "Meet Patel" + mono role tag). Nav links center-right. CTA button "Let's Talk" far right. Mobile: hamburger at ≤720px, full-screen overlay nav.

2. **Hero** — min-height 100vh. Two-column grid (55/45). Left: badge ("Open to work" pulsing dot) → h1 → lede → cert chips (AZ-900, DP-900, AI-900, AZ-305) → CTA buttons ("View My Work" primary + "See All Projects" outline) → stats bar (7+ Years · 6 Certs · 500K Records). Right: hero illustration (dashboard card floating + skill pillars + journey SVG arc).

3. **Trust Strip** — mist background. Mono eyebrow. Tech stack items separated by 3px dots: Python · SQL · Power BI · Tableau · PHP · Azure · WordPress · Scikit-Learn.

4. **Value Band** — white background. Three-column feature grid (Web Dev / Data & BI / Cloud & Automation). Each item: icon, heading, body, tag row.

5. **About** — two-column grid. Left: h2 + body paragraphs. Right: 2×2 stat cards (7+, 6, 500K+, 4).

6. **Skills** — mist section. 3-column card grid. Cards: icon (44px, emerald bg) + h3 + body + tag row. Bottom accent bar on hover.

7. **Education & Certs** — feature (dark) band. Two columns: education timeline left, certifications right.

8. **Projects** — white section. Featured card (60/40 split) + 2-column project card grid below.

9. **Services** — feature (dark) band. 3-column svc-card grid. Ghost cards with mint top border.

10. **Process** — mist section. Vertical process-row list (number / divider / body). 5 steps.

11. **FAQ** — white section. Accordion-style (details/summary or JS toggle). 6 questions.

12. **Contact CTA** — feature (dark) band. Centered h2 + lede + two buttons. Blob decorations.

13. **Footer** — feature (dark) band. CTA strip at top → rule → 3-column grid (brand/nav/certs) → bottom bar.

---

### 2. About (`/about`)
**File:** `about.html`

#### Sections
1. **Navbar** (shared partial)
2. **About Hero** — two-column grid (1fr / 420px). Left: eyebrow + h1 + lede + CTA buttons. Right: sticky quick-facts card (location, education, email, availability pill).
3. **Story** — two-column grid. Left: prose paragraphs. Right: vertical journey timeline (numbered circles, connector lines, city/date labels).
4. **Experience Timeline** — full-width timeline list. Each entry: date badge + role + company + bullet points.
5. **Education + Certs** — two-column grid. Education cards left, cert badges right.
6. **Skills Deep Dive** — mist section. 3-column skill category grid with tag clouds.
7. **Contact CTA** (shared partial)
8. **Footer** (shared partial)

---

### 3. Contact (`/contact`)
**File:** `contact.html`

#### Sections
1. **Navbar** (shared partial)
2. **Contact Hero** — full-width hero. h1 ("Let's Build Something") + lede. No image.
3. **Contact Body** — two-column grid (1fr / 400px). Left: form card (name/email fields in a 2-col row, subject dropdown, message textarea, submit button + "Responds within 24h" note). Right: sidebar with info cards (direct email, LinkedIn, location, availability).
4. **Footer** (shared partial)

**Form fields:**
- First Name (text, required)
- Last Name (text, required)
- Email (email, required)
- Subject (select: Web Development · Data Analytics · Azure Cloud · General Enquiry · Other)
- Message (textarea, min-height 148px, required)
- Submit: "Send Message" btn-primary + "Responds within 24h" mono note

**Form success state:** hidden div shown after submit with green checkmark icon, "Message sent!" heading, and "I'll be in touch within 24 hours on weekdays." body.

---

### 4. Projects Index (`/projects`)
**File:** `projects/index.html`

#### Layout
- Page hero (breadcrumb + h1 + lede)
- Listing toolbar: count badge ("12 projects") + filter pills (All / Web / AI / Data / WordPress)
- 2-column listing grid of `proj-card` components
- JavaScript filter: clicking a pill hides/shows cards by `data-cat` attribute

#### Cards

| # | Title | Category | Status |
|---|---|---|---|
| 01 | ResumeATS: AI Resume Optimizer | ai web | Case Study link |
| 02 | SBA 504 Power BI Dashboard | data | Case Study link |
| 03 | ContentOS AI Dashboard | ai web | Case Study link |
| 04 | PodcastBrain AI Generator | ai | Case Study link |
| 05 | AutoShare WP Plugin | wp | Case Study link |
| 06 | RevenueRadar: SaaS MRR Dashboard | data | Coming Soon |
| 07 | LegalGPT: Contract Review | web | Coming Soon |
| 08 | BriefBot: Editorial Outline AI | ai | Coming Soon |
| 09 | SEOPress Recipe Schema | wp | Coming Soon |
| 10 | NomadStack: Remote Worker Directory | web | Coming Soon |
| 11 | InventoryIQ: Retail Stock Dashboard | data | Coming Soon |
| 12 | SiteSentinel: Uptime + SEO Monitor | ai web | Coming Soon |

---

### 5. Project Case Studies

Each case study uses the same page template:
- **Page hero** (breadcrumb + badge + h1 + lede + meta-row: type / industry / timeline + action buttons)
- **CS Meta bar** — 4-column grid: Role · Timeline · Stack · Status
- **Prose body** — max-width 760px centered article with h2, h3, ul, blockquote, code, callout boxes
- **Results strip** — mist background, 4 result cards (big number + label)
- **Stack grid** — pill grid of technologies used
- **Next project** card — full-width link to next case study

---

### 6. Blog Index (`/blog`)
**File:** `blog/index.html`

#### Layout
- Page header (breadcrumb + h1 + lede + meta strip: post count · latest date · avg read time)
- Two-column layout: main column (1fr) + sidebar (320px)
- Main: featured dark card (latest post) + post list below
- Sidebar: About card (photo + bio) + Topics tags + Newsletter CTA card

#### Blog Posts (3 live)

| # | Title | Slug | Category | Date | Read time |
|---|---|---|---|---|---|
| 1 | How I Built an SEO-Optimized Podcast Review Platform | podcast-review-platform-seo | SEO | May 12, 2026 | 8 min |
| 2 | ATS Resume Optimization: How I Automated It with GPT-4 | ats-resume-optimizer-gpt4 | AI | Apr 28, 2026 | 6 min |
| 3 | How to Build a Power BI Dashboard for Financial Data | power-bi-financial-dashboard | BI | Apr 9, 2026 | 10 min |

---

## Components

### Navbar (shared)
```
height: 72px | fixed | z-index: 50
transparent → frosted glass on scroll (adds .scrolled class via JS)
Logo: brand-mark SVG (emerald) + "Meet Patel" wordmark + "Web Dev · Data · Cloud" role tag
Nav links: Work · About · Blog · Services · Contact (with underline-slide hover)
CTA: "Let's Talk" — border button, fills emerald on hover
Mobile (≤720px): hamburger → full-screen overlay
```

### Footer (shared)
```
background: var(--feature-bg)  [#0C1F18]
Top strip: CTA headline + "Start a Project →" pill button
Grid: Brand column (wordmark + location + social links + availability) | Nav column | Credentials column
Bottom bar: copyright + "Hand-coded · Hosted on Azure"
```

### Buttons

| Class | Style |
|---|---|
| `.btn-primary` | Emerald fill, white text, hover scale(1.02) + deeper shadow |
| `.btn-outline` | Transparent, fog border, ink text; hover emerald border + text |
| `.btn-sky-outline` | Emerald border + text; hover fills emerald |
| `.btn-light` | Same as primary (used on dark bands) |
| `.btn-ghost-light` | White surface, fog border; hover emerald |

### Cards

| Class | Usage |
|---|---|
| `.skill-card` | Skills section — hover lifts 8px + emerald bottom bar |
| `.proj-card` | Projects grid — emerald 3px top bar, hover lifts 6px |
| `.featured-card` | 60/40 grid card for flagship project |
| `.svc-card` | Dark band service cards — mint top border, ghost bg |
| `.blog-card` | Blog index cards — badge + thumb + title + arrow link |
| `.stat-card` | About stats — big number + muted label |

### Tags
```
.tag — mono 10.5px, mist bg, fog border, 100px border-radius, 5px 10px padding
```

### Eyebrow
```
.eyebrow — mono 11px, 0.08em letter-spacing, uppercase, dusk color
On dark band: color = var(--feature-accent) [#34D399]
```

---

## Interactions and Animations

### Scroll Reveal
All sections and cards carry `.reveal` class. `scroll-fx.js` uses `IntersectionObserver` (threshold: 0.12) to add `.in` class when in view.
```css
.reveal     { opacity: 0; transform: translateY(24px); transition: opacity 700ms ease, transform 700ms ease; }
.reveal.in  { opacity: 1; transform: none; }
```
Staggered: siblings get `transition-delay` incremented by 80ms via `scroll-fx.js`.

### Navbar Scroll Effect
JS listens to `window.scroll`, adds `.scrolled` to `.navbar` at scroll > 20px.

### Card Hovers
All cards: `transform: translateY(-6px to -8px)` + deeper shadow on hover. Transition: 300ms `--ease-cloud`.

### Hero Illustration
- Dashboard card: `animation: hi-float-db 9s ease-in-out infinite` (vertical float ±7px)
- Rings: `animation: hi-pulse-r 2.5s ease-in-out infinite` (scale + opacity pulse)
- Available badge dot: `animation: pulse-dot 2.4s ease-in-out infinite` (box-shadow pulse)

### Footer pulse dot
Green availability dot: `animation: pulse 2s infinite ease-out` (scale 1 → 2.4 + opacity 0.7 → 0).

### Hero Badge
Pulsing dot: `animation: pulse-dot 2.4s ease-in-out infinite`.

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| ≤1024px | Hero: single column. About: single column. Skills: 2-col. Blog: 1-col. Footer: 2-col. |
| ≤720px | Nav links hidden, hamburger shown. Gutter: 22px. Featured card: stacked. Stat grid: 2-col. |

---

## Structured Data (SEO / JSON-LD)

The home page includes three JSON-LD blocks — copy into production `<head>`:
1. `@type: Person` — full entity (name, email, certs, education, skills, location)
2. `@type: WebSite` — site-level metadata
3. `@type: FAQPage` — 6 FAQ entries mirroring the visible FAQ section

Blog index and blog posts each have:
- `@type: BreadcrumbList`
- `@type: Blog` with `blogPost[]` array
- Individual `@type: BlogPosting` per article

---

## Content: Profile Source of Truth

See `profile.md` for all factual data about Meet Patel:
- Real email: `patelmeet20112000@gmail.com`
- Location: Saint John, New Brunswick, Canada
- LinkedIn: `linkedin.com/in/meet-patel-a483501b4`
- Certifications: AZ-305 · AI-900 · DP-900 · AZ-900 · IBM Cloud Essentials · GitHub for Data Scientists
- Education: NBCC (Apr 2026) · Tamwood · East-West University · Gujarat Technological University
- Stats: 7+ years · 6 certs · 500,000+ records · Apr 2026 graduation

---

## Assets

| Asset | Path | Usage |
|---|---|---|
| Meet's photo | `assets/meet-photo.jpg` | About page hero, blog sidebar author card |
| Fonts | Google Fonts CDN | Geist 400/500/600/700 + Geist Mono 400/500/600 |

All icons are inline SVGs (no icon library dependency).

---

## Files in This Handoff

```
design_handoff_portfolio/
├── README.md                        ← This file
├── profile.md                       ← Content source of truth
├── styles.css                       ← Full design system
├── enhancements.css                 ← Hero v2 + polish
├── scroll-fx.css                    ← Reveal animation CSS
├── scroll-fx.js                     ← Reveal IntersectionObserver
├── partials.js                      ← Shared nav/footer injection
├── Portfolio Animated v2.html       ← HOME page
├── about.html                       ← ABOUT page
├── contact.html                     ← CONTACT page
├── projects/
│   ├── index.html                   ← Projects listing
│   ├── resumeats.html               ← Case study: ResumeATS
│   ├── sba-504-dashboard.html       ← Case study: SBA 504
│   ├── contentos.html               ← Case study: ContentOS
│   ├── podcastbrain.html            ← Case study: PodcastBrain
│   └── autoshare.html               ← Case study: AutoShare
└── blog/
    ├── index.html                   ← Blog listing
    ├── podcast-review-platform-seo.html
    ├── ats-resume-optimizer-gpt4.html
    └── power-bi-financial-dashboard.html
```

---

## Recommended Production Stack

| Layer | Recommendation |
|---|---|
| Framework | Next.js 14 (App Router) or plain HTML/CSS |
| Hosting | Azure Static Web Apps (fits the brand) |
| Fonts | Google Fonts CDN (already wired) |
| Forms | Azure Functions (contact form backend) or Formspree |
| Analytics | Google Analytics 4 (GA4) |
| SEO | Next.js Metadata API or hand-coded JSON-LD (already written) |

---

## Writing Style Rules (from CLAUDE.md)

1. **No em-dashes anywhere.** Use commas, periods, colons, or mid-dots (·) instead.
2. **No AI-content tells:** no "elevate", "leverage", "seamless", "game-changing", "tapestry"
3. **Email:** always `patelmeet20112000@gmail.com` — never placeholder emails
4. **Accent color:** only `#0E8A6B` (emerald) — no new accent hues
5. **Fonts:** Geist + Geist Mono only — no Inter, Roboto, Arial, Fraunces

---

*Handoff prepared June 15, 2026. All designs are high-fidelity and production-ready for developer implementation.*
