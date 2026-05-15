/**
 * Seed Firebase Firestore with default legal documents.
 * Run after configuring FIREBASE_SERVICE_ACCOUNT in .env.local:
 *   node scripts/seed-legals.js
 */
require('dotenv').config({ path: '.env.local' });
const admin = require('firebase-admin');

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('❌  FIREBASE_SERVICE_ACCOUNT is not set in .env.local');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)),
  });
}

const db = admin.firestore();

// Import content from the compiled version — run ts-node or copy manually
// For plain Node.js, we inline the content references here:
const { LEGAL_DEFAULTS } = require('../lib/legalDefaults.js');

async function seed() {
  console.log('Seeding legal documents...\n');
  for (const [type, content] of Object.entries(LEGAL_DEFAULTS)) {
    await db.collection('legals').doc(type).set(
      { type, content, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
      { merge: true }
    );
    console.log(`✓ ${type}`);
  }
  console.log('\n✅  Done. Legal documents are live in Firestore.');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
