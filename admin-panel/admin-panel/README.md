# Admin Panel

Plain HTML/JS + Firebase client SDK (loaded via CDN — no build step, no
npm install needed to run this). Deliberately simple so it's easy for you
to read and modify directly.

## What works right now

- **Login** (`index.html`) — Firebase Auth email/password. After signing
  in, it verifies admin status indirectly (by attempting a read that only
  admins are allowed — see the comment in `js/login.js` for why it's done
  this way, tied to the security rules design).
- **Projects tab** — create/edit projects directly in Firestore (allowed
  for admins per the security rules). Draft/published toggle included.
- **Payments tab** — create a NOWPayments invoice and mark one fulfilled,
  both by calling the Railway backend (never writes payment data to
  Firestore directly from the browser — matches the security design).
- **Conversations tab** — read-only viewer, wired up and ready, will just
  be empty until the Telegram bot exists and starts logging conversations.

## Setup

1. Copy `config.example.js` → `config.js`, fill in:
   - Your Firebase project's web config (Firebase console → Project
     settings → scroll to "Your apps" → web app → config object)
   - Your Railway backend's URL from Phase 0/1
2. Add `config.js` to `.gitignore` (see `gitignore.txt` — merge its
   contents into your repo's real `.gitignore`)
3. Open `index.html` in a browser. For local testing, don't just
   double-click the file — ES modules need a real server. Easiest option:
   `npx serve .` in this folder (needs Node, but no install/build step
   for the app itself), or deploy straight to Firebase Hosting / any
   static host.
4. Log in with the email/password account you created in Firebase
   Authentication, for the UID that has a document in `/admins/`.

## Known v1 limitations (deliberate, not oversights)

- No image upload widget yet — thumbnail/media are pasted URLs (upload to
  Cloudinary manually, paste the resulting URL). A proper upload widget is
  a fast follow-up once this is confirmed working.
- No slug-change confirmation dialog yet (the schema allows editing a
  published slug — the UI doesn't yet warn you before you do).
- Error handling is minimal (`alert()` in one place) — fine for a v1 tool
  only you use, worth improving before anyone else touches this.
- No pagination — fine at current scale (a handful of projects/payments),
  would need addressing if either list grows into the hundreds.
