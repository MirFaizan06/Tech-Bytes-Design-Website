# Deployment Guide (Vercel)

Tech Bytes Design is configured for seamless Vercel deployment.

## Prerequisites

- GitHub repository with the project pushed
- Vercel account (free Hobby plan is sufficient)
- Firebase project configured (see [SETUP.md](./SETUP.md))

## Steps

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Tech Bytes Design portfolio"
git remote add origin https://github.com/yourusername/tech-bytes-design.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset will auto-detect as **Next.js** — leave defaults

### 3. Add Environment Variables

In Vercel project settings → **Environment Variables**, add all variables from `.env.example`:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase API key | All |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `yourproject.firebaseapp.com` | All |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your project ID | All |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `yourproject.appspot.com` | All |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your sender ID | All |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your app ID | All |
| `FIREBASE_SERVICE_ACCOUNT` | Full JSON string (secret) | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://www.techbytesdesign.com` | Production |

> **Important**: `FIREBASE_SERVICE_ACCOUNT` contains your private key. Add it as a **sensitive** environment variable and never commit it to git.

### 4. Deploy

Click **Deploy**. Vercel will build and deploy the site. The first deployment typically takes 2–3 minutes.

### 5. Custom Domain (Optional)

1. Vercel project → Settings → Domains → Add your domain
2. Update DNS records as instructed by Vercel
3. SSL is automatic via Let's Encrypt

### 6. Update Firebase Authorized Domains

In Firebase Console → Authentication → Settings → Authorized domains:
- Add your production domain (e.g., `www.techbytesdesign.com`)
- Add `techbytesdesign.vercel.app` (your Vercel preview URL)

### 7. Post-Deployment Checks

- [ ] Visit the live site — homepage loads correctly
- [ ] Check `/projects` — grid renders (empty state if no projects yet)
- [ ] Visit `/admin` — login page appears
- [ ] Log in with Firebase admin credentials
- [ ] Add a test project, verify it appears on the public site
- [ ] Submit a contact form — verify it appears in `/admin/dashboard/submissions`
- [ ] Check `/sitemap.xml` — returns valid XML with all pages
- [ ] Check `/robots.txt` — returns correct rules

## Redeployment

Every `git push` to `main` automatically triggers a new Vercel deployment. No manual action needed.

## Environment-Specific URLs

When deploying to staging/preview environments, Vercel automatically provides a unique URL (e.g., `tech-bytes-design-abc123.vercel.app`). The sitemap will use `NEXT_PUBLIC_SITE_URL`, so make sure production has the correct production URL.

## Performance Notes

- Static pages are pre-rendered at build time
- Project listing and detail pages use ISR with 5-minute revalidation
- Images served via Next.js Image Optimization from Firebase Storage
- Fonts loaded via `next/font/google` with `display: swap`
