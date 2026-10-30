// Browser-side .docx generator. Ported from
// /Users/hannahwolf/help me code/resumes/generate_combined.js and made
// fully data-driven so any user's profile produces a clean two-page
// document (cover letter on page 1, resume on page 2+).
//
// All input comes from Firestore via the wizard. Nothing is hardcoded.

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  TabStopType,
  TabStopPosition,
  BorderStyle,
  PageBreak,
} from 'docx'
import { saveAs } from 'file-saver'

// ── Helpers ───────────────────────────────────────────────────────────

/**
 * Strips em/en dashes and double-hyphens that read as "AI-written" while
 * preserving URLs, emails, and phone numbers.
 */
function cleanText(str) {
  if (!str) return ''
  const protectedItems = []
  let cleaned = str.replace(
    /(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+|\d{3}[.\-]\d{3}[.\-]\d{4})/g,
    (match) => {
      protectedItems.push(match)
      return `__PROTECTED_${protectedItems.length - 1}__`
    }
  )
  cleaned = cleaned
    .replace(/\u2014/g, ', ')
    .replace(/\u2013/g, ' to ')
    .replace(/--/g, ', ')
    .replace(/ - /g, ', ')
  cleaned = cleaned.replace(
    /__PROTECTED_(\d+)__/g,
    (_m, idx) => protectedItems[parseInt(idx, 10)]
  )
  return cleaned
}

/** Substitute {{company}} / {{role}} / {{hiring}} placeholders. */
function fillPlaceholders(template, ctx) {
  if (!template) return ''
  return template
    .replace(/\{\{company\}\}/g, ctx.company || '')
    .replace(/\{\{role\}\}/g, ctx.role || '')
    .replace(/\{\{hiring\}\}/g, ctx.hiring || 'Hiring Manager')
}

function todayString() {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ── Paragraph builders ────────────────────────────────────────────────

const colors = {
  primary: '2E75B6',
  heading: '1a1a1a',
  body: '333333',
  meta: '666666',
  italic: '555555',
}

function headerParagraph(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 40 },
    children: [
      new TextRun({
        text,
        bold: opts.bold ?? false,
        size: opts.size ?? 22,
        color: opts.color ?? colors.body,
        italics: opts.italics ?? false,
      }),
    ],
    alignment: opts.alignment,
  })
}

function dividerLine() {
  return new Paragraph({
    spacing: { after: 200 },
    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: colors.primary,
        space: 1,
      },
    },
    children: [],
  })
}

function bulletParagraph(text) {
  return new Paragraph({
    spacing: { after: 60 },
    indent: { left: 360, hanging: 180 },
    children: [
      new TextRun({ text: '\u2022 ', size: 21 }),
      new TextRun({ text: cleanText(text), size: 21 }),
    ],
  })
}

function sectionHeading(text) {
  return new Paragraph({
    spacing: { after: 100 },
    children: [
      new TextRun({
        text,
        bold: true,
        size: 24,
        color: colors.primary,
      }),
    ],
  })
}

// ── Document builder ──────────────────────────────────────────────────

/**
 * Build a single combined cover letter + resume .docx for one company.
 *
 * @param {object} bundle
 * @param {object} bundle.profile         { firstName, lastName, email, phone, location, linkedinUrl, portfolioUrl, githubUrl, currentCompany }
 * @param {Array}  bundle.experience      [{ title, company, city, startDate, endDate, bullets[] }]
 * @param {Array}  bundle.education       [{ level, fieldOfStudy, school, city, startDate, endDate }]
 * @param {object} bundle.roleTemplate    { displayName, professionalSummary, highlights[], coverLetterParagraphs[] }
 * @param {object} bundle.company         { companyName, jobTitle, hiringManager }
 * @returns {Promise<Blob>}               .docx blob, ready for saveAs()
 */
export async function buildResumeDocBlob(bundle) {
  const { profile, experience = [], education = [], roleTemplate, company } = bundle
  const fullName = `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'Your Name'
  const ctx = {
    company: company.companyName,
    role: company.jobTitle || roleTemplate.displayName,
    hiring: company.hiringManager || 'Hiring Manager',
  }

  // Substitute placeholders in the cover letter paragraphs.
  const coverLetterParas = (roleTemplate.coverLetterParagraphs || []).map((p) =>
    cleanText(fillPlaceholders(p, ctx))
  )

  // Build the contact line.
  const contactLine = [
    profile.location,
    profile.phone,
    profile.email,
  ].filter(Boolean).join('  |  ')

  const linksLine = [
    profile.linkedinUrl,
    profile.portfolioUrl,
    profile.githubUrl,
  ].filter(Boolean).join('  |  ')

  // ── Cover letter section (page 1) ──
  const children = [
    headerParagraph(fullName, { bold: true, size: 28, color: colors.heading }),
    headerParagraph(contactLine, { size: 20, color: colors.meta }),
    ...(linksLine ? [headerParagraph(linksLine, { size: 20, color: colors.meta })] : []),
    dividerLine(),
    headerParagraph(todayString(), { after: 200 }),
    headerParagraph(ctx.hiring, { after: 40 }),
    headerParagraph(ctx.company, { after: 200 }),
    headerParagraph(`Dear ${ctx.hiring},`, { after: 200 }),
    ...coverLetterParas.map((p) =>
      new Paragraph({
        spacing: { after: 200 },
        children: [new TextRun({ text: p, size: 22 })],
      })
    ),
    headerParagraph('Sincerely,', { after: 40 }),
    headerParagraph(fullName, { bold: true, after: 0 }),
    new Paragraph({ children: [new PageBreak()] }),

    // ── Resume header (page 2) ──
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: fullName.toUpperCase(),
          bold: true,
          size: 36,
          color: colors.heading,
        }),
      ],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: [contactLine, linksLine].filter(Boolean).join('  |  '),
          size: 18,
          color: colors.meta,
        }),
      ],
    }),
    new Paragraph({
      spacing: { after: 200 },
      border: {
        bottom: {
          style: BorderStyle.SINGLE,
          size: 6,
          color: colors.primary,
          space: 1,
        },
      },
      children: [],
    }),

    // ── Professional summary ──
    sectionHeading('PROFESSIONAL SUMMARY'),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: cleanText(fillPlaceholders(roleTemplate.professionalSummary, ctx)),
          size: 21,
        }),
      ],
    }),

    // ── Highlights ──
    sectionHeading('KEY HIGHLIGHTS'),
    ...(roleTemplate.highlights || []).map((h) =>
      bulletParagraph(fillPlaceholders(h, ctx))
    ),
    new Paragraph({ spacing: { after: 200 }, children: [] }),

    // ── Professional experience ──
    sectionHeading('PROFESSIONAL EXPERIENCE'),
    ...experience.flatMap((job) => {
      const dateRange = [job.startDate, job.endDate || 'Present']
        .filter(Boolean)
        .join(' to ')
      return [
        new Paragraph({
          spacing: { after: 40 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: job.title || '', bold: true, size: 22 }),
            new TextRun({ text: `\t${dateRange}`, size: 21, color: colors.meta }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: [job.company, job.city].filter(Boolean).join(', '),
              italics: true,
              size: 21,
              color: colors.italic,
            }),
          ],
        }),
        ...(job.bullets || []).map((b) => bulletParagraph(b)),
        new Paragraph({ spacing: { after: 120 }, children: [] }),
      ]
    }),

    // ── Education ──
    sectionHeading('EDUCATION & CERTIFICATIONS'),
    ...education.map((e) => {
      const left = [e.level, e.fieldOfStudy].filter(Boolean).join(' in ')
      const right = [e.school, e.city, e.endDate].filter(Boolean).join(', ')
      return new Paragraph({
        spacing: { after: 60 },
        children: [
          new TextRun({ text: left, bold: true, size: 21 }),
          new TextRun({ text: right ? `, ${right}` : '', size: 21 }),
        ],
      })
    }),
  ]

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 22, color: colors.body } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 12240, height: 15840 },
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children,
      },
    ],
  })

  return Packer.toBlob(doc)
}

/**
 * Build the doc and trigger a browser download.
 */
export async function downloadResumeDoc(bundle) {
  const blob = await buildResumeDocBlob(bundle)
  const safeName =
    `${bundle.profile.firstName || 'Resume'}_${bundle.profile.lastName || ''}_${
      bundle.company.companyName || 'Company'
    }`
      .replace(/\s+/g, '_')
      .replace(/[^A-Za-z0-9_-]/g, '')
  saveAs(blob, `${safeName}.docx`)
}
