# Setup Instructions

## Prerequisites

- Node.js 18+
- A Firebase project (free Spark plan)
- A Vercel account for deployment

## 1. Clone & Install

```bash
git clone <your-repo-url>
cd tech-bytes-design
npm install
```

## 2. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com) and create a new project.
2. Enable the following services:
   - **Firestore Database** — start in production mode
   - **Storage** — start in production mode
   - **Authentication** → Sign-in methods → enable **Email/Password**

3. Register a Web App (Project settings → Add app → Web) and copy the config values.

## 3. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Getting `FIREBASE_SERVICE_ACCOUNT`:**
1. Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key" → download JSON
3. Copy the **entire JSON content** as a single-line string into the env var

## 4. Firebase Security Rules

In the Firebase Console, go to **Firestore → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /projects/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /team/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /pricing/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /legals/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /siteContent/{doc} { allow read: if true; allow write: if request.auth != null; }
    match /submissions/{doc} {
      allow create: if true;
      allow read: if request.auth != null;
    }
  }
}
```

For **Storage → Rules**:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## 5. Create Admin User

In Firebase Console → **Authentication → Users → Add user**, create an admin email/password account. This is the account used to log into `/admin`.

## 6. Generate Placeholder Logo

```bash
node scripts/generate-logo.js
```

This writes `public/logo.svg`. Replace with a real logo later.

## 7. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`. The admin panel is at `/admin`.

## Firestore Collections

The app uses these collections (created automatically on first write):
- `projects` — portfolio projects
- `team` — team members
- `pricing` — service pricing plans
- `legals` — legal documents (terms, privacy, refund)
- `submissions` — contact/request form submissions
- `siteContent` — editable homepage/about text
