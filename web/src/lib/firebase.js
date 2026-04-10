// Firebase SDK initialization. Uses Vite env vars (VITE_ prefix) so the
// values are baked into the client bundle at build time. These keys are
// public identifiers; security is enforced by Firestore rules.

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Detect missing config so the dev-server message is friendly instead of
// a cryptic Firebase error.
const missing = Object.entries(firebaseConfig)
  .filter(([, v]) => !v)
  .map(([k]) => k)

if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn(
    `[firebase] Missing env vars: ${missing.join(', ')}. ` +
      `Copy .env.example to .env.local and fill in your Firebase web config.`
  )
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
