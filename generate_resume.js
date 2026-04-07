const { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopType, TabStopPosition, BorderStyle } = require('docx');
const fs = require('fs');

// Configuration per role
const configs = {
  assort_health: {
    filename: 'Hannah_Cowan_Resume_Assort_Health.docx',
    summary: 'Dynamic brand and content leader with 20+ years building category-defining brands from the ground up. Founded and scaled a globally recognized publishing and education company, directing brand voice, content strategy, and creative teams across digital and physical channels. Proven ability to translate complex subject matter into compelling narratives that drive audience engagement and business growth. Currently completing an ML/AI Analytics certificate to bring data-driven precision to brand and content strategy.',
    highlights: [
      'Founded The Science of Tattooing, building a globally recognized brand from concept through textbook publication, app development, international speaking tours, and digital content ecosystem',
      'Directed brand voice, content strategy, and creative assets across platforms, maintaining consistency for a 12-person distributed team',
      'Built and scaled multiple businesses as owner-operator, managing P&L, compliance, real estate, and marketing across LLC and S-Corp entities',
      'Led teams of up to 14 professionals, overseeing talent development, performance standards, and vendor relationships',
      'Designed cross-platform, narrative-driven marketing strategies leveraging CRM systems and AI-enabled lead filtering',
    ],
  },
  openai: {
    filename: 'Hannah_Cowan_Resume_OpenAI.docx',
    summary: 'Creative director and brand architect with 20+ years translating bold ideas into globally recognized identities. Built a research and publishing brand from scratch that redefined an entire industry through strategic storytelling, visual design, and innovative content. Deep experience directing cross-functional creative teams, establishing brand systems, and crafting narratives that connect technology with human experience. Currently earning an ML/AI Analytics certificate, combining creative vision with technical fluency in artificial intelligence.',
    highlights: [
      'Created and directed the complete brand identity for The Science of Tattooing \u2014 from visual systems and editorial voice to textbook design and app UX, now recognized internationally',
      'Led a 12-person global team of scientists, editors, designers, and visual artists to produce a licensed scientific textbook blending rigorous research with compelling creative design',
      'Designed and executed brand strategy across digital content, international speaking tours, and strategic partnerships, cultivating a loyal global professional audience',
      'Built and scaled multiple creative businesses over two decades, directing all brand touchpoints from marketing collateral to client experience design',
      'Pioneered AI-enabled marketing workflows including CRM automation and intelligent lead filtering to drive referral-based growth',
    ],
  },
  scribd: {
    filename: 'Hannah_Cowan_Resume_Scribd.docx',
    summary: 'Publishing entrepreneur and brand design leader with 20+ years creating, producing, and marketing content that reaches global audiences. Founded a research and publishing company that produced an internationally recognized scientific textbook, directing every aspect of brand design from cover to digital presence. Expert at bridging editorial vision with visual identity to create cohesive, category-defining brand experiences. Currently completing an ML/AI Analytics certificate to enhance data-informed design and content decisions.',
    highlights: [
      'Founded The Science of Tattooing and directed end-to-end brand design for a licensed scientific textbook \u2014 from editorial direction and visual identity to print production and digital distribution',
      'Currently developing and launching a companion app, extending the brand into interactive digital publishing',
      'Built a global audience through strategic content marketing, international speaking engagements, and partnership cultivation across four continents',
      'Directed brand consistency across all platforms for a 12-person distributed creative team',
      'Designed narrative-driven marketing strategies that combine editorial storytelling with data-driven audience targeting using CRM and AI tools',
    ],
  },
};

function generateResume(configKey) {
  const config = configs[configKey];

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: 'Arial', size: 22, color: '333333' } },
      },
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
        },
      },
      children: [
        // Name
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: 'HANNAH COWAN', bold: true, size: 36, font: 'Arial', color: '1a1a1a' })],
        }),
        // Contact line
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Walnut Creek, CA  |  505-577-3197  |  Tsotdirector@gmail.com  |  TattoosByHannah.com', size: 18, color: '666666' })],
        }),
        // Divider
        new Paragraph({
          spacing: { after: 200 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '2E75B6', space: 1 } },
          children: [],
        }),
        // Professional Summary
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 24, color: '2E75B6' })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: config.summary, size: 21 })],
        }),
        // Key Highlights
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'KEY HIGHLIGHTS', bold: true, size: 24, color: '2E75B6' })],
        }),
        ...config.highlights.map(h => new Paragraph({
          spacing: { after: 80 },
          indent: { left: 360, hanging: 180 },
          children: [
            new TextRun({ text: '\u2022 ', size: 21 }),
            new TextRun({ text: h, size: 21 }),
          ],
        })),
        // Spacer
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        // Experience header
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true, size: 24, color: '2E75B6' })],
        }),
        // Role 1 - Science of Tattooing
        new Paragraph({
          spacing: { after: 40 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: 'Founder & Creative Director', bold: true, size: 22 }),
            new TextRun({ text: '\t2019 \u2013 Present', size: 21, color: '666666' }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: 'The Science of Tattooing \u2014 Remote', italics: true, size: 21, color: '555555' })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Founded and led an educational publishing company, directing a 12-person global team of doctors, scientists, editors, and visual artists', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Published an internationally recognized licensed scientific textbook that redefined industry education through strategic storytelling and design', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Currently developing and launching a companion mobile app, extending the brand into interactive digital publishing', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Marketed globally through speaking tours, digital content, and strategic partnerships, cultivating a loyal professional audience across four continents', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Directed brand voice, content strategy, and all creative assets to maintain consistency across platforms', size: 21 })],
        }),
        // Role 2 - Old Crow Tattoo
        new Paragraph({
          spacing: { after: 40 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: 'Owner & Lead Artist', bold: true, size: 22 }),
            new TextRun({ text: '\t2003 \u2013 Present', size: 21, color: '666666' }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: 'Old Crow Tattoo \u2014 Oakland/Berkeley, CA', italics: true, size: 21, color: '555555' })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Built and scaled multiple creative businesses as owner-operator, managing LLC and S-Corp entities across varied studio locations', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Led teams of up to 14 independent contractors, overseeing talent development, vendor relationships, scheduling, and performance standards', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Directed all business operations including finance, accounting, compliance, permitting, lease negotiation, and construction management', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Designed cross-platform, narrative-driven marketing strategies leveraging CRM systems and AI-enabled lead filtering for referral-based growth', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 120 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Developed a global professional network through ~40 international conventions across four continents', size: 21 })],
        }),
        // Spacer
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        // Education
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'EDUCATION & CERTIFICATIONS', bold: true, size: 24, color: '2E75B6' })],
        }),
        new Paragraph({
          spacing: { after: 60 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: 'ML/AI Analytics Certificate', bold: true, size: 21 }),
            new TextRun({ text: ' \u2014 University of Texas (Completing June 2026)', size: 21 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Introduction to Python Certificate', bold: true, size: 21 }),
            new TextRun({ text: ' \u2014 Python Programming', size: 21 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Intelligent Investing', bold: true, size: 21 }),
            new TextRun({ text: ' \u2014 Emeritas / UC Berkeley Extension (2022)', size: 21 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Bachelor of Arts, Art History', bold: true, size: 21 }),
            new TextRun({ text: ' \u2014 University of New Mexico', size: 21 }),
          ],
        }),
        // Spacer
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        // Skills
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'SKILLS & EXPERTISE', bold: true, size: 24, color: '2E75B6' })],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: 'Brand Strategy & Identity  |  Content Strategy & Editorial Direction  |  Creative Team Leadership  |  Storytelling & Narrative Design  |  AI/ML Analytics  |  CRM & Marketing Automation  |  Cross-Platform Marketing  |  P&L Management  |  Project Management  |  Publishing & Production  |  Public Speaking  |  International Business Development', size: 21 })],
        }),
        // Spacer
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        // Publications & Awards
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'PUBLICATIONS & RECOGNITION', bold: true, size: 24, color: '2E75B6' })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'The Science of Tattooing \u2014 Licensed scientific textbook (2019)', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Featured in Scene 360 (2022), Tattoodo (2021), Inkedmag (2019), Mammoth Book of Tattoos (2014)', size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: 'Multiple industry awards for creative work (2010\u20132023)', size: 21 })],
        }),
      ],
    }],
  });

  return Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(`/Users/hannahwolf/help me code/resumes/${config.filename}`, buffer);
    console.log(`Created: ${config.filename}`);
  });
}

async function main() {
  const role = process.argv[2];
  if (role) {
    await generateResume(role);
  } else {
    for (const key of Object.keys(configs)) {
      await generateResume(key);
    }
  }
}

main().catch(console.error);
