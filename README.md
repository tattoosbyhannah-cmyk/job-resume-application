# Hannah's Job Application Toolkit

A collection of Node.js scripts and browser bookmarklets that automate generating tailored resumes/cover letters and filling out web application forms (Lever, Greenhouse).

## Contents

### Resume + Cover Letter Generators

Each script generates one or more combined `.docx` files containing a tailored cover letter followed by a tailored resume for specific companies and roles. Built with the [`docx`](https://www.npmjs.com/package/docx) library.

| Script | Purpose |
|---|---|
| `generate_resume.js` | Original single-resume generator (3 roles) |
| `generate_resume_batch2.js` | Second batch generator |
| `generate_cover_letters.js` | Cover letters only |
| `generate_combined.js` | Combined cover letter + resume (9 companies: Assort Health, OpenAI, Scribd, Braze, Meet Life Sciences, Acquire, SkyBridge, Unison, Planisware) |
| `generate_remote.js` | Remote-focused roles (XPRIZE, egnite Health, Nebius, Flex, Tundra) |
| `generate_batch3.js` | Latest batch (Huckleberry Labs, Superside, Primer, Enable, Alignable, DataCamp, Cameo) |

### Browser Auto-Fill Bookmarklets

| Script | Purpose |
|---|---|
| `lever_autofill.js` | Auto-fills Lever (`jobs.lever.co/*/apply`) application forms |
| `greenhouse_autofill.js` | Auto-fills Greenhouse (`boards.greenhouse.io`) application forms |

Both auto-fill name, email, phone, location, current company, LinkedIn, portfolio, and Yes/No work authorization dropdowns. **They do NOT click submit** — leaving final review to you.

#### How to use a bookmarklet

1. Open the JS file and copy the `javascript:void(...)` line at the top
2. In your browser, create a new bookmark with that line as the URL
3. When on a Lever or Greenhouse application page, click the bookmark
4. Review the filled fields, then submit manually

## Setup

```bash
npm install docx
```

## Generating Documents

```bash
node generate_combined.js
node generate_remote.js
node generate_batch3.js
```

Output `.docx` files are written to this directory but `.gitignore`'d (they contain personal data).

## Notes

- All cover letters now mention Hannah's hands-on AI engineering experience and the tens of thousands of dollars per year she has saved by implementing AI tools and agent workflows across her businesses.
- The companion job-search pipeline (Python) lives at `~/Desktop/Job search/pipeline/` and uses `applications_tracker.csv` to dedupe already-applied companies.
