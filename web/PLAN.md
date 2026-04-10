# Job Application Toolkit — Public Multi-User Web App

## Context
The existing toolkit at `/Users/hannahwolf/help me code/resumes/` is a personal Node.js CLI: six generator scripts with Hannah's info hardcoded into `roles` arrays, plus two bookmarklets with her name, email, phone, and LinkedIn embedded as string literals. It works beautifully for one person but can't be shared.

The goal is to transform it into a **public multi-user web app** where any user can:
1. Sign up for their own account
2. Walk through a step-by-step wizard that collects their personal info, experience, education, and cover letter templates
3. Generate tailored resume + cover letter `.docx` files in their browser
4. Install personalized Lever and Greenhouse autofill bookmarklets with their values embedded
5. Come back later and access everything across devices

**Key constraints from the user:**
- Host on GitHub Pages (static only) using the existing `tattoosbyhannah-cmyk/job-resume-application` repo
- Full multi-user web app (real accounts, persistent storage across devices)
- Backend: **Firebase** (Auth + Firestore) since GH Pages can't host a backend itself
- Frontend: **React + Vite**
- Save everything to a project folder so it's self-contained

**Outcome:** Anyone can visit the published URL, create an account, fill out the wizard once, and have the same personalized docs + bookmarklets Hannah uses — without ever touching the Node.js scripts.

---

## Architecture

```
Browser (GitHub Pages static site)
  │
  ├── React + Vite SPA
  │     ├── Firebase Auth SDK (email/password + Google OAuth)
  │     ├── Firestore SDK (profile + templates + history)
  │     ├── docx library (browser build) for in-browser .docx generation
  │     └── file-saver for client-side downloads
  │
  └── Firebase Cloud
        ├── Authentication (managed)
        └── Firestore (NoSQL, user-scoped security rules)
```

**No application server.** All auth and data go browser → Firebase directly. GitHub Pages only serves the compiled React bundle.

---

## Project Folder

New top-level folder: **`/Users/hannahwolf/Projects/job-toolkit-web/`**

Rationale: Keeps the web app as its own self-contained project, separate from Hannah's personal `~/help me code/resumes/` CLI scripts. The `~/help me code/resumes/` folder stays untouched for her own use. The new folder will be added to the existing GitHub repo as a `web/` subdirectory, with a GitHub Action that builds from `web/` and deploys to GitHub Pages.

**Two options for repo layout — I'll recommend the first:**

1. **Monorepo (recommended):** Add the web app as `web/` inside the existing `tattoosbyhannah-cmyk/job-resume-application` repo. The existing CLI scripts stay at the repo root. One repo, one GH Pages deploy.
2. **Separate repo:** New `job-toolkit-web` repo. Cleaner separation but requires a second GH Pages setup.

Final project folder structure (monorepo):

```
/Users/hannahwolf/Projects/job-toolkit-web/        ← local working copy
├── README.md                                      ← project docs
├── .gitignore                                     ← node_modules, dist, .env.local
├── package.json                                   ← React + Vite + Firebase deps
├── vite.config.js                                 ← base path for GH Pages subpath
├── index.html
├── .env.example                                   ← Firebase config template (no secrets)
├── firebase.rules                                 ← Firestore security rules (committed)
├── src/
│   ├── main.jsx                                   ← React entry
│   ├── App.jsx                                    ← router + layout
│   ├── index.css                                  ← Tailwind or vanilla styling
│   ├── lib/
│   │   ├── firebase.js                            ← Firebase init + singleton
│   │   ├── auth.js                                ← signup/login/logout wrappers
│   │   ├── firestore.js                           ← profile CRUD wrappers
│   │   ├── docx-generator.js                      ← PORTED from generate_combined.js, parameterized
│   │   └── bookmarklet-builder.js                 ← generates per-user bookmarklet URLs
│   ├── contexts/
│   │   ├── AuthContext.jsx
│   │   └── ProfileContext.jsx
│   ├── components/
│   │   ├── StepNav.jsx                            ← wizard progress bar
│   │   ├── FormField.jsx
│   │   ├── ExperienceEntry.jsx                    ← repeatable list
│   │   ├── EducationEntry.jsx
│   │   ├── CoverLetterTemplateEditor.jsx
│   │   └── BookmarkletInstallCard.jsx             ← copy button + per-browser instructions
│   └── pages/
│       ├── Landing.jsx                            ← marketing page with "Get Started"
│       ├── Signup.jsx
│       ├── Login.jsx
│       ├── Dashboard.jsx                          ← after setup: list of generated docs, re-run wizard
│       └── Wizard/
│           ├── index.jsx                          ← wizard shell / step router
│           ├── Step1_Welcome.jsx
│           ├── Step2_Profile.jsx                  ← name, email, phone, location, LinkedIn, portfolio, work auth, visa
│           ├── Step3_Experience.jsx               ← repeatable work entries
│           ├── Step4_Education.jsx                ← repeatable entries
│           ├── Step5_RoleTemplates.jsx            ← "target roles" with cover letter paragraphs
│           ├── Step6_Companies.jsx                ← add companies under each role
│           ├── Step7_Generate.jsx                 ← generate + download .docx files
│           └── Step8_Bookmarklets.jsx             ← personalized bookmarklet install UI
└── public/
    └── favicon.svg
```

---

## Firestore Data Model

Security: Every document lives under `users/{uid}/...` and a single rule enforces `request.auth.uid == uid`.

```
users/{uid}
  profile              (single doc)
    firstName, lastName, email, phone, location, linkedinUrl,
    portfolioUrl, currentCompany, workAuth (bool), needsSponsorship (bool),
    updatedAt

  experience/{entryId} (collection)
    title, company, city, startDate, endDate (or "Present"),
    bullets[] (strings), order

  education/{entryId}  (collection)
    level, fieldOfStudy, school, city, startDate, endDate, order

  roleTemplates/{roleKey}  (collection)
    displayName (e.g. "Marketing Director"),
    professionalSummary,
    highlights[] (5 bullets),
    coverLetterParagraphs[] (4-5 strings, can include {{company}} placeholders)

  targetCompanies/{companyId}  (collection)
    roleKey (ref), companyName, jobTitle, hiringManager,
    generatedAt, bookmarkletInstalled (bool)
```

**`firebase.rules`:**
```
match /users/{userId}/{document=**} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

---

## Critical Files: What to Port vs Rewrite

### Port directly (with parameterization)
- **`src/lib/docx-generator.js`** — Take the `generateCombinedDoc(role)` function from `/Users/hannahwolf/help me code/resumes/generate_combined.js` (lines ~215 onward). It already accepts a `role` object. Changes: accept a full `{profile, experience, education, roleTemplate, company}` bundle instead of hardcoded constants; use `docx` browser build; return a Blob instead of writing to fs.
- **`src/lib/bookmarklet-builder.js`** — Take the template structure from `lever_autofill.js` and `greenhouse_autofill.js`. Replace the hardcoded string literals ("Hannah Cowan", "Tsotdirector@gmail.com", etc.) with a `buildLeverBookmarklet(profile)` function that returns the `javascript:void(...)` URL with the user's values encoded.

### Build new
- Everything in `src/contexts/`, `src/pages/`, `src/components/`
- Firebase init (`src/lib/firebase.js`)
- Auth wrappers (`src/lib/auth.js`) wrapping Firebase Auth SDK
- Firestore wrappers (`src/lib/firestore.js`) for each collection

### Leave untouched
- All files in `/Users/hannahwolf/help me code/resumes/*.js` stay as-is for Hannah's personal CLI use.

---

## Step-by-Step Wizard UX

1. **Welcome** — Brief explanation, "Sign in or create account" CTAs.
2. **Profile** — Name, email, phone, location (Google Places autocomplete), LinkedIn URL, portfolio URL, current company, work authorization (Yes/No), visa sponsorship needed (Yes/No). Saves on every field blur to Firestore.
3. **Work Experience** — "Add position" button → modal with title, company, location, dates, bullet points. Repeatable. Drag-to-reorder.
4. **Education & Certs** — Same pattern for schools/certs.
5. **Target Roles** — "What roles are you applying for?" → user adds one template per target role. Each template has a professional summary, 5 highlights, and a 4-paragraph cover letter (with `{{company}}` placeholders the app substitutes automatically).
6. **Companies** — Under each role, add specific companies the user is targeting. This generates one tailored doc per company.
7. **Generate** — Big button per company that builds the `.docx` in-browser and triggers download. Uses `docx-generator.js` with `{profile, experience, education, roleTemplate, company}`.
8. **Install Bookmarklets** — Shows two boxes (Lever + Greenhouse) with the personalized `javascript:void(...)` URL and browser-specific install instructions (Chrome, Safari, Firefox, Edge). Includes a "Test it on a live Lever page" CTA linking to a known Lever apply URL.

**Dashboard after first setup:** List of generated docs with re-download buttons, list of installed bookmarklets, "Edit profile" link, "Add a new target role" link.

---

## Deployment (GitHub Pages)

1. Add `/Users/hannahwolf/Projects/job-toolkit-web/` as a working copy.
2. Inside, run `npm create vite@latest . -- --template react`, install `firebase docx file-saver react-router-dom`.
3. Push to a new `web/` subdirectory of `tattoosbyhannah-cmyk/job-resume-application` (monorepo approach).
4. Add `.github/workflows/deploy-pages.yml` at the repo root:
   - On push to `main`, runs `cd web && npm ci && npm run build`
   - Uploads `web/dist/` as a Pages artifact
   - Deploys to `https://tattoosbyhannah-cmyk.github.io/job-resume-application/`
5. Set `vite.config.js` `base: '/job-resume-application/'` so asset paths resolve correctly on the subpath.
6. Enable GitHub Pages in repo settings → Source: GitHub Actions.

**Firebase setup (one-time manual, Hannah does in browser):**
1. Create Firebase project at console.firebase.google.com
2. Enable Authentication → Email/Password + Google
3. Create Firestore database (production mode)
4. Paste `firebase.rules` into Firestore Rules tab
5. Copy the web config snippet → into `web/.env.local` as `VITE_FIREBASE_API_KEY`, etc.
6. Add `tattoosbyhannah-cmyk.github.io` to authorized domains.

**Note on secrets:** Firebase web API keys are safe to ship in the client bundle — they're public identifiers, not secrets. Security is enforced by Firestore rules. We'll commit `.env.example` but gitignore `.env.local`.

---

## Plan File

Once we exit plan mode, this plan file (`mutable-strolling-nebula.md`) will also be copied into the project folder as `/Users/hannahwolf/Projects/job-toolkit-web/PLAN.md` so it's self-contained and versioned with the code.

---

## Verification

After implementation:

1. **Local dev server:** `cd ~/Projects/job-toolkit-web && npm run dev` → open localhost:5173. Go through the full wizard with a test account. Confirm each step saves to Firestore (check Firebase console → Firestore). Confirm `.docx` downloads open correctly in Word and contain the values entered.
2. **Build:** `npm run build` → confirm `dist/` is generated with no errors and asset paths use the GH Pages subpath.
3. **Deploy:** Push to `main` → GitHub Actions runs → site goes live at `https://tattoosbyhannah-cmyk.github.io/job-resume-application/`.
4. **End-to-end:** Sign up with a fresh email on the live site. Run through the wizard. Download a `.docx` and open it. Install the Lever bookmarklet and test it on a real `jobs.lever.co/*/apply` page — confirm it fills the form with the new user's info (not Hannah's).
5. **Security:** In Firebase console, check that the test user's docs only live under `users/{testUid}/...`. Attempt to read another user's data from the browser console and confirm Firestore rules reject it.
6. **Mobile:** Open the live URL on a phone. Confirm the wizard is usable (responsive layout).

---

## Out of Scope (for this plan)

- Payment/subscription — the app is free
- Job board OAuth integrations (Lever/Greenhouse don't offer public OAuth for applicants)
- Email-scraping for application confirmations (possible in a future phase via Gmail OAuth, not now)
- AI-powered cover letter generation — users write their own templates; the app only substitutes placeholders
- Multi-language support
