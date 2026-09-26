// Copy this file to config.js and fill in your real values.
// config.js should NOT be committed to a public repo (add it to
// .gitignore) even though Firebase's client config isn't a secret — it's
// just cleaner to keep environment-specific values out of shared history.
//
// Firebase's web config (apiKey, authDomain, etc.) is safe to expose in
// browser code by design — it identifies your project, it doesn't grant
// access. Actual access control is enforced by Firestore Security Rules
// and this admin panel's Firebase Auth login, not by hiding this file.

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// The Railway backend URL from Phase 0/1 — e.g.
// "https://michael-backend-test.up.railway.app"
export const RAILWAY_API_BASE_URL = "YOUR_RAILWAY_URL_HERE";
