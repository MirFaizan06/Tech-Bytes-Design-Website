I’ll craft a comprehensive `CLAUDE.md` tailored to your exact answers: free Firebase tier, App Router, no email service, custom Tailwind components, React Icons, GSAP + Framer Motion, auto‑generated sitemap, admin panel with client‑side auth, and a Node.js script for a placeholder logo. The guide will be production‑focused, token‑efficient, and include all resource management, rules, and the final three docs.

---

# CLAUDE.md — Tech Bytes Design Portfolio

This is the master blueprint for building the Tech Bytes Design company portfolio website. Always follow this specification exactly—no deviation unless explicitly asked. All decisions are already made; you are the implementer.

## Project Foundation

- **Company**: Tech Bytes Design  
- **Lead Developer / Founder**: Mir Faizan  
- **Address**: Remote + Wadera Estates, The Bund, Near Amira Kadal, Lalchowk, Srinagar, 190001  
- **Phone**: +91 9596524832  
- **Emails**: mirfaizan8803@gmail.com / techbytesdesign@gmail.com  
- **Business hours**: Mon‑Thu & Sat, 10:00 AM – 4:00 PM IST (closed Fridays & Sundays)  
- **Average delivery**: 3 weeks (testing excluded)  

**Website aim**: Showcase portfolio, accept project requests, display pricing, provide contact info, and an admin panel to manage everything. No payment gateway—deals happen offline.  
**Data**: Projects, Team, Pricing, Legal docs, Contact / Request submissions. No dummy data; handle empty states gracefully.

## Tech Stack (Locked)

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 14 (App Router)** – React Server Components by default |
| Styling | **Tailwind CSS** – custom-written using only utility classes; **NO** shadcn/ui components |
| Icons | **React Icons** (only library) |
| Animation | **GSAP** (ScrollTrigger) for scroll reveal + **Framer Motion** for page transitions & hover effects |
| Backend / DB | **Firebase** (Firestore, Storage, Auth) – **free Spark plan** only, no paid services |
| Auth (admin only) | Firebase Auth (email/password) – client‑side SDK, no server‑side verification for routes |
| Admin panel | Custom dashboard, client‑side rendered, protected by `onAuthStateChanged` |
| Forms (client) | Stored directly to Firestore via client SDK; no email trigger |
| SEO | Next.js Metadata API, `sitemap.xml`, `robots.txt`, JSON‑LD structured data, dynamic OG generation (optional) |
| Hosting | **Vercel** (Hobby plan) |
| Environment vars | Vercel env variables (public + private) |
| Files / Media | Firebase Storage; accepted formats: **images in `.webp`**, PDFs, `.txt` |
| Caching | In‑memory `cache` per server request, static generation where possible, ISR with revalidation |
| Logo placeholder | Node.js script that generates a simple SVG/TEXT logo; stored locally and later replaced |

## Development Mindset & Token Efficiency Rules

**Always work with a production mindset**:
- Write clean, modular, reusable code. No dead code, no console.logs (except for build‑time notes).
- Every page must handle **loading**, **empty**, and **error** states elegantly.
- Mobile‑first responsive design (breakpoints: `sm`, `md`, `lg`).
- Animations must feel lightweight; prefer CSS transitions over heavy JS, use GSAP only where scroll‑triggered effects are needed.
- Never install packages that duplicate built‑in Next.js functionality (e.g., `next-seo`, `next-sitemap`).
- Use **React Server Components (RSC)** by default for pages; mark interactive parts with `'use client'` only where necessary.

**Token management**:
- Describe components tersely using TypeScript interfaces for props.
- Avoid verbose explanations in code comments—only essential clarifications.
- Keep each file focused: one component per file, hooks separated.
- When fetching Firebase data server‑side, use the Firebase Admin SDK; client‑side use the client SDK. Never mix them.
- Reuse queries via custom hooks with in‑memory caching where appropriate.

## Architecture Overview

### Routing (App Router)

```
/
  ├── page.tsx                     (Home)
  ├── about/page.tsx               (About)
  ├── projects/
  │   ├── page.tsx                 (Projects listing)
  │   └── [slug]/page.tsx          (Single project detail – dynamic SEO)
  ├── request-development/
  │   └── page.tsx                 (Service request + pricing table)
  ├── contact/
  │   └── page.tsx                 (Contact form & info)
  ├── admin/
  │   ├── page.tsx                 (Login)
  │   ├── dashboard/
  │   │   ├── layout.tsx           (Admin sidebar layout, auth‑guard)
  │   │   ├── page.tsx             (Overview, quick stats)
  │   │   ├── projects/page.tsx    (CRUD projects)
  │   │   ├── team/page.tsx        (CRUD team)
  │   │   ├── pricing/page.tsx     (CRUD pricing services)
  │   │   ├── legals/page.tsx      (Manage legal docs + upload PDF)
  │   │   ├── submissions/page.tsx (View contact/request submissions)
  │   │   └── site-content/page.tsx (Edit hero text, about intro, etc.)
  ├── sitemap.ts                   (Generated dynamically)
  ├── robots.ts                    (Static)
  └── layout.tsx                   (Root layout: metadata, JSON‑LD)
```

### Data Flow

#### Client‑Side Firestore (public reads, admin writes)
- Collections: `projects`, `team`, `pricing`, `legals`, `siteContent` – world‑readable, write restricted to authenticated admin via Security Rules.
- Collection `submissions` – anyone can create (with `type`, `email`, `message`, `ip`, etc.), only admin can read.

#### Server‑Side Data Fetching (Admin SDK)
- Used **only** for generating `sitemap.xml` and dynamic metadata for project detail pages (so SEO content is available at request time without client‑side waterfall).  
- The Admin SDK is initialized with a service account JSON string stored in `FIREBASE_SERVICE_ACCOUNT` env var.

### Firebase Admin SDK Setup (server‑side only)
- Create `lib/firebaseAdmin.ts`:
```ts
import admin from 'firebase-admin';

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT!);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}
export const db = admin.firestore();
export const storage = admin.storage();
```
- **Important**: This file must not be imported into any client component; keep it in server components / API routes. We won’t use API routes, only server components.

### Firebase Client SDK Setup
- `lib/firebaseClient.ts`:
```ts
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```
- Client components use this for admin panel writes and form submissions.

### IP Tracking for Submissions
- On the client side, before writing a submission, fetch the user’s IP using a free service like `https://api.ipify.org?format=json` (or similar). Then store the IP along with other fields in the Firestore document. This is optional but easy. Implement inside the form submit handler.

## Data Models (Firestore Collections)

### `projects`
- `slug` (string) – URL safe
- `title` (string)
- `description` (string)
- `longDescription` (markdown string, optional)
- `tags` (array of strings)
- `liveUrl` (string, optional)
- `githubUrl` (string, optional)
- `images` (array of strings – full Storage download URLs)
- `completionDate` (Timestamp)
- `featured` (boolean) – for homepage spotlight
- `createdAt` (Timestamp)

### `team`
- `id` (auto)
- `name` (string)
- `role` (string)
- `photo` (string, Storage URL)
- `bio` (string)
- `socialLinks` (map: `{ linkedin, twitter, github }`)

### `pricing`
- `id` (auto)
- `serviceName` (string, e.g., “Simple React Website”)
- `description` (string)
- `startingPrice` (number)
- `upToPrice` (number)
- `benefits` (array of strings)
- `order` (number) for sorting

### `legals`
- `type` (string: `terms`, `privacy`, `refund`, etc.)
- `content` (string – markdown or HTML, for inline rendering)
- `pdfUrl` (string, optional – Storage URL to uploaded PDF)

### `submissions`
- `type` (`contact` or `request-development`)
- `name` (string)
- `email` (string)
- `phone` (string, optional)
- `message` (string)
- `service` (string, optional – captured from pricing selection)
- `ip` (string)
- `userAgent` (string)
- `createdAt` (Timestamp)

### `siteContent` (single doc per key)
- `docId` = `homepage` (other docs like `about`, `hero`)
- `heroTitle`, `heroSubtitle`, `ctaText`, `aboutIntro`, etc.

## Firebase Security Rules (Spark‑Plan Friendly)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access for site content
    match /projects/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /team/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /pricing/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /legals/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /siteContent/{doc} { allow read: if true; allow write: if request.auth != null; }
    // Submissions: anyone can create, only auth can read
    match /submissions/{doc} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Component & State Architecture

### Reusable Primitives
Create `/components/ui`:
- `LoadingSpinner.tsx` (animated spinner)
- `EmptyState.tsx` (icon + title + description, used when no items)
- `ErrorState.tsx` (message + retry button)
- `Toast` system – custom lightweight toast using a context provider and Framer Motion for enter/exit. Define `ToastProvider` and `useToast` hook. Toast types: success, error, info. Do not use any library.

### Custom Hooks
- `useFirestoreCollection(collectionName, queryConstraints?)` – client collection snapshot with loading/error/data states; caches in a ref to avoid unnecessary re‑renders.
- `useAdminAuth()` – returns `user`, `loading`. Listens to Firebase Auth state; used in admin layout to guard routes.
- `useSiteContent(pageKey)` – fetches the `siteContent` doc with in‑memory caching on server (using React `cache` for server components).

### Layouts & Loading States
- **Root layout**: sets global metadata (`metadataBase`, `title`, `description`), open graph, Twitter card, and JSON‑LD for `Organization`. Uses Inter font (from Google Fonts via `next/font`).
- Every page wraps its content in `<Suspense>` with a skeleton/fallback while data loads.
- Admin dashboard uses a sidebar layout with active link highlighting, mobile‑responsive drawer.

## Animations Strategy

**GSAP (with ScrollTrigger) – only on Homepage & maybe About:**
- Reveal sections (Hero tagline, About summary, featured projects, CTA) on scroll using `gsap.from` with `scrollTrigger`. Plugins must be registered. Use `useGSAP` hook (from `@gsap/react`) for safe cleanup in client components.
- Optimise: all GSAP code must be inside `useGSAP` and only run on client. Wrap with dynamic import (no SSR) for the homepage hero animation component.

**Framer Motion:**
- Page transitions – wrap children in `AnimatePresence` + motion.div with opacity/translateX (keep subtle).
- Hover effects on project cards, team member photos (scale + shadow).
- Toast enter/exit.
- **Rule**: No Framer Motion for scroll‑triggered animations; no GSAP for layout‑based transitions.

## SEO Implementation (Free, Maximum Traffic)

### Per‑page Metadata
- Use Next.js `generateMetadata` in each page server component to set `title`, `description`, `openGraph`, `twitter` tags.
- For dynamic project pages (`projects/[slug]`), fetch the project from Firestore inside `generateMetadata` to populate title/description and set a `canonical` URL.

### `sitemap.xml`
- Create `app/sitemap.ts` that exports a default function returning an array of `{url, lastModified, changeFrequency, priority}`.
- Fetch all projects and static pages from Firestore using Admin SDK, then map to entries.
- Static pages: Home (priority 1.0), About, Projects, Contact, Request‑Development (priority 0.9).

### `robots.txt`
- Create `app/robots.ts` returning:
```
User-agent: *
Allow: /
Sitemap: https://www.techbytesdesign.com/sitemap.xml
```

### JSON‑LD Structured Data
- Root layout: inject `<script type="application/ld+json">` with `Organization` schema (name, url, sameAs socials, address, phone, email).
- Project detail pages: add `WebApplication` or `CreativeWork` JSON‑LD dynamically.
- Use `next/script` component with `strategy="beforeInteractive"` only for `organization`. For dynamic data, use `<script>` tag inside the page.

### Open Graph Images (Optional but nice)
- Create a simple dynamic OG image generator route using Vercel’s `@vercel/og` if wanted. Otherwise, use a static branded image. Keep it free; if implementing, use edge runtime and avoid external paid APIs.

## Admin Panel Implementation Details

### Auth Flow
- Admin login page (`/admin`) uses Firebase Auth `signInWithEmailAndPassword`.
- On success, router.push to `/admin/dashboard`.
- Admin dashboard layout checks auth state via `useAdminAuth` in a client component wrapper. If `loading` show spinner; if no user, redirect to `/admin`.
- No registration page; admin users are created manually in Firebase console.
- Logout button clears session.

### CRUD Interfaces
- Each section (Projects, Team, Pricing, Legals, Site Content) has:
  - List view with in‑memory pagination (client‑side after initial fetch).
  - Add / Edit modal (with form fields, image upload via Firebase Storage, preview).
  - Delete with confirmation.
- Image upload: use `storage.ref(...).put(file)` and get download URL; store URL in Firestore.
- Form validation with minimal custom logic; display errors inline.

### Submissions Viewer
- Table listing all submissions, sorted by `createdAt` descending.
- Columns: Date, Name, Email, Type, Message excerpt, IP.
- Each row has a “Mail to” button that opens `mailto:email?subject=...` using the stored email.
- Filter by type (contact/request).

### Site Content Editor
- Simple form with `heroTitle`, `heroSubtitle`, `ctaText`, `aboutIntro` fields.

## Empty States, Error Boundaries, Loading Skeletons

- Create `<PageSkeleton />` component for each page section.
- Empty state example: “No projects yet. Check back soon!” with icon.
- Admin empty states: “No submissions yet” – different message for each collection.
- Error state: “Something went wrong loading the data. Please try again.” with a Retry button that refetches.
- Global error boundary using `error.tsx` files at route levels.

## Mobile Responsiveness & Design Principles

- Use Tailwind’s responsive prefixes. Default to single‑column layout on mobile, expand to grid on `md` and `lg`.
- Navigation: hamburger menu on mobile (Framer Motion slide‑in), horizontal on desktop.
- Typography: clean, large headings, comfortable line‑height. Background: whites/off‑whites with subtle gradients, accent color: `#2563eb` (blue‑600) or a custom brand shade (to be decided). Tech Bytes Design can use a modern purple‑blue gradient accent.
- Cards: subtle borders, shadow on hover.

## Image Handling & Formats
- All project images uploaded to Firebase Storage must be converted to `.webp` before upload (client‑side using `<canvas>` or a simple converter). For now, implement a client‑side conversion if possible; otherwise, accept `.webp` uploads only and instruct admin to upload WebP.
- Display using `next/image` with remote pattern configured in `next.config.js` for Firebase Storage domains.

## Logo Generation Script
- Write a Node.js script `scripts/generate-logo.js` that outputs a simple placeholder logo (`public/logo.svg` or `logo.png`) containing the text “Tech Bytes Design” in a clean futuristic font. This is temporary until a real logo is provided. The script can render an SVG string with the text and save it. The website’s layout should reference `/logo.svg` as the src. Run the script before first commit.

## Environment Variables (`.env.local` + Vercel)
- Public (prefixed `NEXT_PUBLIC_`):
  - `NEXT_PUBLIC_FIREBASE_API_KEY`
  - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
  - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
  - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
  - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
  - `NEXT_PUBLIC_FIREBASE_APP_ID`
- Server‑side only:
  - `FIREBASE_SERVICE_ACCOUNT` (the whole JSON object as a string, use `JSON.stringify`)
  - `NEXT_PUBLIC_SITE_URL` (for sitemap and canonical URLs; on Vercel, use `VERCEL_URL`)

## Caching and Performance
- Admin panel data fetched client‑side with `onSnapshot` for real‑time updates; no caching needed.
- Public data: Server Components fetch directly from Firestore using Admin SDK. Use `React.cache` to deduplicate requests per render. Use `unstable_cache` or `next/cache` where appropriate for static generation with revalidation set to 300 seconds (5 min). Build pages statically where possible, but some pages (like project listing) can use static generation with a revalidation time.
- Image optimization: use Next Image with `sizes` attribute, lazy loading.

## Setup & Deployment Steps

1. Create a new Next.js project with TypeScript and Tailwind, App Router.
2. Install deps: `firebase`, `@gsap/react`, `gsap`, `framer-motion`, `react-icons`.
3. Set up Firebase project, enable Firestore, Storage, Auth (email/password). Add web app config to env.
4. Generate service account key, store JSON in Vercel env as `FIREBASE_SERVICE_ACCOUNT`.
5. Set up Firestore security rules (as above) and Storage rules.
6. Build all pages, components, and admin panel according to this spec.
7. Generate placeholder logo via script, place in `public/`.
8. Add `robots.ts` and `sitemap.ts`.
9. Test all empty states, loading skeletons, error states.
10. Deploy to Vercel, set environment variables, ensure `next.config.js` allows Firebase Storage images.

---

## Final Documentation to Produce (at the end)

### README.md
```markdown
# Tech Bytes Design – Portfolio Website

Official company portfolio for Tech Bytes Design, showcasing custom web development services, projects, team, and an admin panel to manage content.

## Features
- Home, About, Projects, Request Development (with pricing), Contact pages.
- Admin dashboard for CRUD of projects, team, pricing, legal docs, and viewing contact submissions.
- Full SEO with dynamic sitemap, robots.txt, JSON‑LD structured data.
- Animations via GSAP and Framer Motion.
- Fully responsive, modern minimal UI.

## Tech Stack
Next.js 14 (App Router), Tailwind CSS, Firebase (Firestore, Auth, Storage), GSAP, Framer Motion, Vercel hosting.

## Setup
See [SETUP.md](./SETUP.md)

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md)
```

### SETUP.md
```markdown
# Setup Instructions

1. Clone repository and run `npm install`.
2. Create a Firebase project (Spark plan) and enable Firestore, Storage, and Email/Password Auth.
3. Copy your Firebase web app config into `.env.local` (use the .env.example template).
4. Generate a private key for Firebase Admin SDK (Project settings > Service accounts), copy the JSON, stringify it, and add as `FIREBASE_SERVICE_ACCOUNT` in `.env.local` (keep this secret).
5. Set up Firestore security rules and Storage rules from `firebase.rules` file (provided).
6. Install Firebase tools or manually add a user in Authentication for admin login.
7. Run `node scripts/generate-logo.js` to create a temporary logo.
8. Run the development server: `npm run dev`. The site should be live locally.
```

### DEPLOYMENT.md
```markdown
# Deployment (Vercel)

Tech Bytes Design website is configured for seamless Vercel deployment.

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add all environment variables under Settings > Environment Variables (both public and private). Ensure `FIREBASE_SERVICE_ACCOUNT` is pasted as a secret.
4. Set the build command as `next build` and output directory as `.next`.
5. Deploy. The sitemap and SEO will work automatically using the production domain.
6. After deployment, verify that Firebase reads are working and admin panel login functions correctly.
7. (Optional) Set up a custom domain and enforce HTTPS.
```

---

Now proceed to build the entire project according to this exact specification. Start with the project scaffold, then implement pages, components, admin panel, and the script. Remember: no shortcuts, production quality, handle every state, and write performant, cached queries.