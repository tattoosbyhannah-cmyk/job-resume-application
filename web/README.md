# Job Toolkit Web

A public, multi-user web app for generating tailored resume + cover letter `.docx` files and creating personalized Lever and Greenhouse autofill bookmarklets.

Live at: `https://tattoosbyhannah-cmyk.github.io/job-resume-application/`

## What it does

1. **Sign up** with email/password or Google.
2. **Walk through a wizard** that collects your profile, work experience, education, and cover letter templates.
3. **Generate** tailored `.docx` files for each company you're targeting — resume + cover letter in one document.
4. **Install personalized bookmarklets** that auto-fill your info on Lever (`jobs.lever.co/*/apply`) and Greenhouse (`boards.greenhouse.io`) application pages.

Everything is yours. Your data lives under your own Firebase user account; nobody else can read it.

## Tech stack

- **Frontend:** React + Vite, deployed to GitHub Pages
- **Backend:** Firebase (Authentication + Firestore)
- **Document generation:** `docx` library running in the browser
- **Downloads:** `file-saver` for client-side file downloads

## Architecture

```
Browser (GitHub Pages static site)
  │
  ├── React + Vite SPA
  │     ├── Firebase Auth SDK
  │     ├── Firestore SDK
  │     ├── docx for in-browser .docx generation
  │     └── file-saver for downloads
  │
  └── Firebase Cloud (managed)
        ├── Authentication
        └── Firestore (user-scoped security rules)
```

No application server. All auth and data flow browser → Firebase directly.

## Running locally

```bash
# Install dependencies
npm install

# Set up Firebase config (one-time)
cp .env.example .env.local
# Edit .env.local and paste your Firebase web config values

# Run dev server
npm run dev
# → http://localhost:5173
```

## Firebase setup (one-time, in browser)

1. Go to https://console.firebase.google.com and create a project
2. Add a **Web app** and copy the config snippet into `.env.local`
3. Enable **Authentication** → Sign-in methods → Email/Password + Google
4. Create **Firestore Database** in production mode
5. Paste the contents of `firebase.rules` into Firestore → Rules
6. Under Authentication → Settings → Authorized domains, add your GitHub Pages domain (e.g. `tattoosbyhannah-cmyk.github.io`)

## Deployment

Pushed to the `main` branch of `tattoosbyhannah-cmyk/job-resume-application`. A GitHub Actions workflow in `.github/workflows/deploy-pages.yml` builds the Vite project and deploys `dist/` to GitHub Pages on every push.

## Data model (Firestore)

```
users/{uid}
  profile/main             — contact info + auth answers
  experience/{entryId}     — work history, repeatable
  education/{entryId}      — schools and certs, repeatable
  roleTemplates/{roleKey}  — cover letter templates per target role
  targetCompanies/{id}     — specific companies under each role
```

Every document enforces `request.auth.uid == uid` at the Firestore rule level.

## Project structure

```
src/
├── main.jsx
├── App.jsx                          ← router + layout
├── index.css
├── lib/
│   ├── firebase.js                  ← Firebase init singleton
│   ├── auth.js                      ← signup/login/logout wrappers
│   ├── firestore.js                 ← profile CRUD wrappers
│   ├── docx-generator.js            ← in-browser .docx builder
│   └── bookmarklet-builder.js       ← personalized bookmarklet URLs
├── contexts/
│   ├── AuthContext.jsx
│   └── ProfileContext.jsx
├── components/
│   ├── StepNav.jsx
│   ├── FormField.jsx
│   ├── ExperienceEntry.jsx
│   ├── EducationEntry.jsx
│   ├── CoverLetterTemplateEditor.jsx
│   └── BookmarkletInstallCard.jsx
└── pages/
    ├── Landing.jsx
    ├── Signup.jsx
    ├── Login.jsx
    ├── Dashboard.jsx
    └── Wizard/
        ├── index.jsx
        ├── Step1_Welcome.jsx
        ├── Step2_Profile.jsx
        ├── Step3_Experience.jsx
        ├── Step4_Education.jsx
        ├── Step5_RoleTemplates.jsx
        ├── Step6_Companies.jsx
        ├── Step7_Generate.jsx
        └── Step8_Bookmarklets.jsx
```

## License

Personal project. Ask before redistributing.
