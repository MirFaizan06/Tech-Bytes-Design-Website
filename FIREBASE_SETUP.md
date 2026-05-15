# Firebase Setup Guide — Tech Bytes Design
## Complete A to Z Setup

This guide walks through every Firebase step needed to make the portfolio website fully functional.
Follow sections in order — don't skip ahead.

---

## Table of Contents

1. [Create a Firebase Project](#1-create-a-firebase-project)
2. [Register the Web App & Get Client Config](#2-register-the-web-app--get-client-config)
3. [Enable Firestore Database](#3-enable-firestore-database)
4. [Set Firestore Security Rules](#4-set-firestore-security-rules)
5. [Create Firestore Indexes](#5-create-firestore-indexes)
6. [Enable Firebase Storage](#6-enable-firebase-storage)
7. [Set Storage Security Rules](#7-set-storage-security-rules)
8. [Enable Authentication](#8-enable-authentication)
9. [Create the Admin User](#9-create-the-admin-user)
10. [Get the Service Account Key (Admin SDK)](#10-get-the-service-account-key-admin-sdk)
11. [Fill in .env.local](#11-fill-in-envlocal)
12. [Verify Everything Works](#12-verify-everything-works)
13. [Firestore Collections Reference](#13-firestore-collections-reference)
14. [Common Errors & Fixes](#14-common-errors--fixes)

---

## 1. Create a Firebase Project

1. Open your browser and go to **https://console.firebase.google.com**
2. Sign in with your Google account (use `techbytesdesign@gmail.com` or any Google account you control)
3. Click **"Add project"** (the large card with a `+` icon)
4. **Project name:** Type `tech-bytes-design` (or any name you like — this is just a label)
5. **Project ID:** Firebase will auto-generate something like `tech-bytes-design-a1b2c`. You can click the pencil icon to customise it (e.g. `techbytesdesign`). The project ID is permanent — choose carefully.
6. Click **Continue**
7. **Google Analytics:** Toggle it **OFF** (not needed, and keeps things simpler on the Spark plan)
8. Click **Create project**
9. Wait ~30 seconds for provisioning, then click **Continue**

You are now in the Firebase Console for your project. The URL will look like:
`https://console.firebase.google.com/project/your-project-id/overview`

---

## 2. Register the Web App & Get Client Config

This gives you the public API keys that go in the `NEXT_PUBLIC_*` environment variables.

1. On the project overview page, look for the icons under "Get started by adding Firebase to your app"
2. Click the **`</>`** (Web) icon
3. **App nickname:** Type `Tech Bytes Design Portfolio`
4. **"Also set up Firebase Hosting"**: Leave this **unchecked** (we use Vercel, not Firebase Hosting)
5. Click **"Register app"**
6. You will see a code block like this:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

7. **Copy each value** — you'll need them in Step 11
8. Click **"Continue to console"** (you don't need to install Firebase SDK here; it's already in the project)

> **Where to find this again later:**  
> Project settings (gear icon ⚙️ → Project settings) → scroll to "Your apps" → SDK setup and configuration

---

## 3. Enable Firestore Database

1. In the left sidebar, click **"Build"** to expand it, then click **"Firestore Database"**
2. Click **"Create database"**
3. **Production mode** vs **Test mode:**  
   Select **"Start in production mode"** — we will set proper rules in Step 4.
   (Test mode allows all reads/writes for 30 days, which is a security risk)
4. **Cloud Firestore location:** Choose the region closest to your users.  
   Recommended for Indian traffic: **`asia-south1` (Mumbai)**  
   > ⚠️ This cannot be changed later. Choose wisely.
5. Click **"Create"**
6. Wait ~1 minute for provisioning

You will land on the Firestore Data viewer. It starts empty — that's expected.

---

## 4. Set Firestore Security Rules

This is critical. Without proper rules, anyone on the internet can write anything to your database.

1. In the left sidebar under "Firestore Database", click **"Rules"** tab
2. You'll see a default rule. **Delete all of it** and replace with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Public content — anyone can read, only signed-in admins can write
    match /projects/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /team/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /pricing/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /legals/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    match /siteContent/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    // Submissions — anyone can submit a form, only admin can read
    match /submissions/{doc} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }

    // Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**
4. A confirmation dialog appears — click **"Publish"** again

> **What these rules do:**
> - `projects`, `team`, `pricing`, `legals`, `siteContent` — anyone visiting the public site can read them; only a signed-in admin can create/update/delete
> - `submissions` — anyone (including non-logged-in visitors) can submit a contact form; only admin can read the submissions
> - Everything else is blocked

---

## 5. Create Firestore Indexes

The app uses composite queries (filtering + sorting) that require indexes. Create them now to avoid runtime errors.

1. Still in Firestore, click the **"Indexes"** tab
2. Click **"Add index"**

### Index 1 — Featured projects on homepage
| Field | | Collection | Field path | Order |
|---|---|---|---|---|
| Collection ID | | `projects` | | |
| Field 1 | | | `featured` | Ascending |
| Field 2 | | | `createdAt` | Descending |
| Query scope | | | Collection | |

Click **"Create index"**. It takes 1–2 minutes to build.

### Index 2 — Projects by date
| Collection ID | Field path | Order |
|---|---|---|
| `projects` | `createdAt` | Descending |
| Query scope | Collection | |

This one is a single-field index — Firestore usually creates single-field indexes automatically, but you can add it manually if you get an error.

### Index 3 — Submissions by date
| Collection ID | Field path | Order |
|---|---|---|
| `submissions` | `createdAt` | Descending |
| Query scope | Collection | |

### Index 4 — Pricing by order
| Collection ID | Field path | Order |
|---|---|---|
| `pricing` | `order` | Ascending |

> **Shortcut:** If you skip this step and get a "requires an index" error in the browser console when running the app, the error message includes a **direct link** to create the missing index. Just click it. The link pre-fills everything.

---

## 6. Enable Firebase Storage

This is where project images and team photos will be stored.

1. In the left sidebar under "Build", click **"Storage"**
2. Click **"Get started"**
3. **Security rules:** Select **"Start in production mode"** — we'll set rules in Step 7
4. **Default bucket location:** Choose the same region as Firestore (`asia-south1`)
5. Click **"Done"**

Your storage bucket URL will be shown at the top — it looks like:
`gs://your-project-id.appspot.com`  
or for newer projects:  
`gs://your-project-id.firebasestorage.app`

Copy the bucket name (without `gs://`) — you'll need it for `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`.

---

## 7. Set Storage Security Rules

1. In Storage, click the **"Rules"** tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Public images for projects and team
    match /projects/{filename} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 10 * 1024 * 1024  // 10 MB max
                   && request.resource.contentType.matches('image/.*');
    }

    match /team/{filename} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024   // 5 MB max
                   && request.resource.contentType.matches('image/.*');
    }

    match /legals/{filename} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.resource.size < 20 * 1024 * 1024  // 20 MB max
                   && request.resource.contentType == 'application/pdf';
    }

    // Deny everything else
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click **"Publish"**

> **Why these rules are better than the basic ones in SETUP.md:**
> They add file size limits and content-type checks, so no one can upload arbitrary files or spam huge uploads even if they somehow get auth credentials.

---

## 8. Enable Authentication

1. In the left sidebar under "Build", click **"Authentication"**
2. Click **"Get started"**
3. You land on the "Sign-in method" tab
4. Click **"Email/Password"**
5. Toggle the first switch ("Email/Password") to **Enabled**
6. Leave "Email link (passwordless sign-in)" **disabled**
7. Click **"Save"**

Authentication is now enabled.

### Add your production domain (important for Vercel)

Still in Authentication:
1. Click the **"Settings"** tab
2. Click **"Authorized domains"**
3. You'll see `localhost` and `your-project.firebaseapp.com` already listed
4. Click **"Add domain"**
5. Add your production domain: `www.techbytesdesign.com` (or whatever domain you'll use)
6. Also add: `techbytesdesign.vercel.app` (your Vercel preview URL — change `techbytesdesign` to your actual Vercel project name)
7. Click **"Add"** for each

> If you deploy to Vercel first (before adding the domain), the login page will show an "unauthorized domain" error. Adding the domain here fixes it.

---

## 9. Create the Admin User

You cannot register through the website — admin accounts are created manually in the console.

1. Still in Authentication, click the **"Users"** tab
2. Click **"Add user"**
3. **Email:** `techbytesdesign@gmail.com` (or any email you'll use to log into `/admin`)
4. **Password:** Choose a strong password (at least 12 characters, mixed case + symbols)
5. Click **"Add user"**

The user appears in the list. Copy the **User UID** (shown in the table) — you may need it later for advanced security rules.

> ⚠️ There is no "Forgot password" UI on the admin panel. If you lose the password:
> - Firebase Console → Authentication → Users → find user → click the 3-dot menu → "Reset password" → enter a new password directly

---

## 10. Get the Service Account Key (Admin SDK)

The Admin SDK is used server-side for generating the sitemap and rendering project/legal pages at request time. It bypasses security rules entirely, so keep this secret.

1. Click the **gear icon ⚙️** at the top of the left sidebar → **"Project settings"**
2. Click the **"Service accounts"** tab
3. Make sure **"Firebase Admin SDK"** is selected in the top radio buttons
4. Click **"Generate new private key"**
5. A warning dialog appears: "Generating a new key will not invalidate existing keys..." — click **"Generate key"**
6. A JSON file downloads automatically. It looks like this:

```json
{
  "type": "service_account",
  "project_id": "your-project-id",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIE...\n-----END RSA PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxx@your-project.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/..."
}
```

### Converting the JSON for use in .env.local

The entire JSON must go on **one line** as the value of `FIREBASE_SERVICE_ACCOUNT`.

**Option A — Using Node.js (easiest):**

Open a terminal in the folder where the file downloaded (e.g. Downloads), then:

```bash
node -e "const fs=require('fs'); const j=fs.readFileSync('./your-project-firebase-adminsdk-xxxx-abc123.json','utf8'); console.log(JSON.stringify(JSON.parse(j)));"
```

Copy the output — that's your single-line JSON string.

**Option B — Manually:**

Open the downloaded file in any text editor. Select all, copy. Then paste it into a JSON minifier (search "JSON minify online"). Copy the compressed single-line output.

**Option C — PowerShell (Windows):**

```powershell
$json = Get-Content "C:\Users\Faizan\Downloads\your-project-firebase-adminsdk-xxxx.json" | ConvertFrom-Json | ConvertTo-Json -Compress
$json
```

> 🔒 **Security:** Never commit this JSON to git. The `.gitignore` already excludes `.env.local`, but double-check before pushing. Never share this file with anyone.

---

## 11. Fill in .env.local

Open the file `c:\Users\Faizan\Desktop\Tech Bytes Design\.env.local` in VS Code.

Replace every placeholder value with your real credentials:

```env
# ─── Firebase Client (PUBLIC — safe to expose in browser) ─────────────────────
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...            # from Step 2
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef

# ─── Firebase Admin SDK (PRIVATE — never expose this) ────────────────────────
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"your-project-id","private_key_id":"...","private_key":"-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}

# ─── Site URL ─────────────────────────────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000        # change to https://www.techbytesdesign.com after deploy
```

### Important notes about FIREBASE_SERVICE_ACCOUNT

- The entire JSON must be on **one line** — no newlines except inside the private key value (which has `\n` escape sequences, not actual newlines)
- Do NOT add quotes around the value in the .env file — `KEY=value`, not `KEY="value"`
- The `private_key` field contains `\n` for line breaks — make sure these stay as `\n` (two characters: backslash + n), not actual line breaks

**After saving, restart the dev server:**

```bash
# Stop the current server (Ctrl+C in the terminal where npm run dev is running)
npm run dev
```

---

## 12. Verify Everything Works

Run through this checklist after filling in credentials:

### Public site

- [ ] **Homepage loads** at `http://localhost:3000` — hero section, "Available for new projects" badge visible
- [ ] **No red errors** in browser DevTools console (F12 → Console tab)
- [ ] **Projects page** at `/projects` shows the empty state ("No projects yet") — this is correct for a new setup
- [ ] **Contact form** at `/contact` — fill in name/email/message and submit. Should show a green toast "Message sent!"
- [ ] **After submitting contact form** — go to Firebase Console → Firestore → check `submissions` collection has a new document

### Admin panel

- [ ] Visit `http://localhost:3000/admin` — login page appears
- [ ] Enter the email/password from Step 9 — should redirect to `/admin/dashboard`
- [ ] **Dashboard stats** show all zeros (normal for new setup)
- [ ] **Add a project**: Click "Projects" → "Add Project" → fill in title, slug (`my-first-project`), description → click "Save Project". Should show "Project added!" toast.
- [ ] **Check public site**: Visit `/projects` — your new project should appear in the grid
- [ ] **Upload an image**: Edit the project, click "Upload Images", pick a `.jpg` or `.png` file — should upload and appear in preview
- [ ] **Submissions page**: Visit `/admin/dashboard/submissions` — the contact form submission from earlier should appear here

### SEO checks

- [ ] Visit `http://localhost:3000/sitemap.xml` — should return XML listing your pages + the project you added
- [ ] Visit `http://localhost:3000/robots.txt` — should show the allow/disallow rules

---

## 13. Firestore Collections Reference

These collections are created automatically the first time data is written to them.

### `projects`
```
slug          string    "my-first-project"
title         string    "My First Project"
description   string    "Short one-liner description"
longDescription  string  "## Markdown content\n\nFull writeup..."
tags          array     ["React", "Next.js", "Firebase"]
liveUrl       string    "https://example.com"
githubUrl     string    "https://github.com/..."
images        array     ["https://firebasestorage.googleapis.com/..."]
completionDate  timestamp
featured      boolean   true
createdAt     timestamp
```

### `team`
```
name          string    "Mir Faizan"
role          string    "Lead Developer & Founder"
photo         string    "https://firebasestorage.googleapis.com/..."
bio           string    "Short bio paragraph..."
socialLinks   map       { linkedin: "...", twitter: "...", github: "..." }
```

### `pricing`
```
serviceName   string    "Landing Page"
description   string    "Perfect for startups..."
startingPrice number    15000
upToPrice     number    30000
benefits      array     ["Mobile responsive", "SEO setup", "1 month support"]
order         number    1
```

### `legals`
Document IDs should be: `terms`, `privacy`, `refund`
```
type          string    "terms"
content       string    "# Terms of Service\n\n..."  (Markdown)
pdfUrl        string    "https://firebasestorage.googleapis.com/..."
```

### `siteContent`
Single document with ID `homepage`:
```
heroTitle     string    "We Build Digital Experiences That Convert"
heroSubtitle  string    "Tech Bytes Design crafts custom websites..."
ctaText       string    "Start Your Project"
aboutIntro    string    "Tech Bytes Design was founded by..."
```

### `submissions` (auto-created by contact forms)
```
type          string    "contact" | "request-development"
name          string    "John Doe"
email         string    "john@example.com"
phone         string    "+91 ..."
message       string    "I need a website for my business..."
service       string    "Web Application"
ip            string    "123.45.67.89"
userAgent     string    "Mozilla/5.0 ..."
createdAt     timestamp
```

---

## 14. Common Errors & Fixes

### "FirebaseError: Missing or insufficient permissions"
**Cause:** Firestore security rules are blocking the request.  
**Fix:** Recheck Step 4. Make sure you clicked "Publish" on the rules and they saved. You can verify in the Rules tab — the timestamp should show recent.

### "FirebaseError: [auth/invalid-api-key]"
**Cause:** The `NEXT_PUBLIC_FIREBASE_API_KEY` value is wrong or missing.  
**Fix:** Check `.env.local` — make sure the API key exactly matches what's in Firebase Console. Restart the dev server after editing `.env.local`.

### "FirebaseError: [auth/unauthorized-domain]"
**Cause:** The domain you're running on isn't in the authorized domains list.  
**Fix:** Go to Firebase Console → Authentication → Settings → Authorized domains → add the missing domain (for local dev, `localhost` should already be there).

### "Error: Turbopack build failed with 1 errors" on `ssr: false`
**Cause:** Next.js 16 doesn't allow `dynamic({ ssr: false })` in Server Components.  
**Fix:** Already handled — `HeroAnimationClient.tsx` wraps the dynamic import. If you add new dynamic imports with `ssr: false`, do the same: put the `dynamic()` call in a file with `'use client'` at the top.

### "SyntaxError: Unexpected token" on `FIREBASE_SERVICE_ACCOUNT`
**Cause:** The JSON is malformed — likely has real newlines in the private key instead of `\n` escape sequences, or has surrounding quotes.  
**Fix:** Use the Node.js command from Step 10 to properly stringify the JSON. The `private_key` field should contain `\n` characters (backslash-n), not actual line breaks.

### "FirebaseError: [storage/unauthorized]"
**Cause:** Storage security rules are blocking the upload.  
**Fix:** Make sure you're logged in as admin (the upload happens from the admin panel which requires auth). Also verify Storage rules were published in Step 7.

### Submissions show up in Firestore but not in the admin panel
**Cause:** The admin panel user is not authenticated when trying to read submissions.  
**Fix:** Make sure you're logged into `/admin/dashboard` first. The Firestore rules require `request.auth != null` to read submissions.

### The sitemap returns an empty XML or 500 error
**Cause:** `FIREBASE_SERVICE_ACCOUNT` is empty or invalid — the Admin SDK can't query projects.  
**Fix:** Fill in the service account in `.env.local` (Step 11). The sitemap uses the Admin SDK because it's a server-side route.

### "auth/email-already-in-use" when creating admin user
**Cause:** You already have a Firebase user with that email in another Firebase project.  
**Fix:** Use a different email, or go to Firebase Console → Authentication → Users → delete the old entry, then re-add.

---

## Spark Plan Limits (Free Tier)

Be aware of these limits — the site is designed to stay well within them:

| Resource | Free Limit | Expected Usage |
|----------|-----------|----------------|
| Firestore reads | 50,000/day | ~500–2,000/day for portfolio traffic |
| Firestore writes | 20,000/day | Admin writes only, negligible |
| Firestore storage | 1 GiB | Well within for text/metadata |
| Storage | 5 GB total, 1 GB/day download | Fine for a portfolio |
| Auth users | 10,000/month | 1 admin user |
| Cloud Functions | N/A | Not used |

If you ever see "Quota exceeded" errors, check Firebase Console → Usage tab to see which limit was hit.

---

## Deploying to Vercel

Once everything works locally, follow these steps:

1. **Add all env vars to Vercel**: Project Settings → Environment Variables. Add every variable from your `.env.local` — including `FIREBASE_SERVICE_ACCOUNT` (mark it as "Sensitive").

2. **Update `NEXT_PUBLIC_SITE_URL`** to your production URL (e.g. `https://www.techbytesdesign.com`).

3. **Update Firebase Authorized Domains** (Step 8) to include your Vercel production URL.

4. **Verify after deploy**: Check `/sitemap.xml` on the live site — it should now include your actual production domain in all URLs.

Full deployment steps are in [DEPLOYMENT.md](./DEPLOYMENT.md).

---

*Guide version: May 2026 — Firebase Spark plan, Next.js 16, Firestore + Storage + Auth*
