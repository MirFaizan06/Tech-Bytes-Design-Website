# Tech Bytes Design — Portfolio Website

Official company portfolio for **Tech Bytes Design**, showcasing custom web development services, projects, team, and a full-featured admin panel.

## Features

- **Public Pages**: Home, About, Projects (with filterable gallery + lightbox), Services & Pricing, Contact
- **Dynamic Project Pages**: SEO-optimised with per-project metadata, JSON-LD, and image gallery
- **Legal Pages**: Terms of Service, Privacy Policy, Refund Policy — Markdown content + optional PDF
- **Admin Panel** (`/admin`): Auth-guarded dashboard with full CRUD for:
  - Projects (images via Firebase Storage)
  - Team members (photo upload)
  - Pricing plans
  - Legal documents (Markdown + PDF)
  - Contact / project request submissions viewer
  - Site content editor (hero text, about intro, CTA)
- **SEO**: Dynamic `sitemap.xml`, `robots.txt`, JSON-LD Organisation & CreativeWork schema, Open Graph, Twitter Cards
- **Animations**: GSAP ScrollTrigger for hero/scroll reveals, Framer Motion for page transitions, hover effects, toast notifications
- **Mobile-first**: Fully responsive with hamburger nav and admin sidebar drawer
- **Toast system**: Custom lightweight toast provider (success / error / info)
- **Loading, empty & error states** on every data-dependent view

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 14+ (App Router, RSC by default) |
| Styling | Tailwind CSS v4 (utility-only, no shadcn/ui) |
| Icons | React Icons |
| Animations | GSAP + @gsap/react, Framer Motion |
| Backend/DB | Firebase Firestore, Storage, Auth (Spark plan) |
| Hosting | Vercel (Hobby plan) |

## Quick Start

```bash
npm install
cp .env.example .env.local
# fill in Firebase config in .env.local
node scripts/generate-logo.js
npm run dev
```

See [SETUP.md](./SETUP.md) for full setup instructions.

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md).

## Admin Access

Visit `/admin` and sign in with credentials created manually in the Firebase Console.

## Company Info

- **Lead Developer**: Mir Faizan
- **Email**: techbytesdesign@gmail.com
- **Location**: Srinagar, J&K, India
- **Hours**: Mon–Thu & Sat, 10:00 AM – 4:00 PM IST
