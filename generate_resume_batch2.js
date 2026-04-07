const { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopType, TabStopPosition, BorderStyle } = require('docx');
const fs = require('fs');

const configs = {
  braze: {
    filename: 'Hannah_Cowan_Resume_Braze.docx',
    summary: 'Strategic creative leader with 20+ years building brands, directing campaigns, and driving audience engagement across digital and physical channels. Founded a globally recognized publishing and education brand, leading end-to-end creative strategy from concept through international distribution. Expert at translating complex ideas into compelling narratives that build loyal audiences and measurable business impact. Currently completing an ML/AI Analytics certificate to bring data-driven intelligence to creative strategy.',
  },
  meet_life_sciences: {
    filename: 'Hannah_Cowan_Resume_Meet_Life_Sciences.docx',
    summary: 'Marketing leader with 20+ years building brands at the intersection of science, education, and creative storytelling. Founded The Science of Tattooing, a research and publishing company that produced a licensed scientific textbook in collaboration with doctors and scientists, marketed globally through speaking tours and strategic partnerships. Proven ability to drive promotional strategy, build cross-functional teams, and create campaigns that resonate with professional and scientific audiences. Currently completing an ML/AI Analytics certificate to enhance data-driven marketing decisions.',
  },
  acquire: {
    filename: 'Hannah_Cowan_Resume_Acquire.docx',
    summary: 'Growth-oriented entrepreneur with 20+ years building and scaling direct-to-consumer creative businesses. Founded and grew multiple ventures from zero to profitability, managing P&L, marketing automation, AI-enabled lead generation, and cross-platform brand strategy. Deep experience in DTC customer acquisition, retention, and referral-based growth models. Currently developing a consumer app and completing an ML/AI Analytics certificate to bring technical rigor to growth strategy.',
  },
  skybridge: {
    filename: 'Hannah_Cowan_Resume_SkyBridge.docx',
    summary: 'Sales and marketing leader with 20+ years building premium brands rooted in craftsmanship, storytelling, and exceptional client experiences. Founded and scaled luxury creative businesses serving discerning clientele, directing all aspects of brand positioning, relationship management, and revenue growth. Expert at translating artisan quality into compelling brand narratives that drive referral-based acquisition and long-term loyalty. Currently completing an ML/AI Analytics certificate.',
  },
  unison: {
    filename: 'Hannah_Cowan_Resume_Unison.docx',
    summary: 'Full-spectrum marketing director with 20+ years building brands, directing content strategy, and driving growth across digital and physical channels. Founded and scaled a globally recognized publishing company, leading cross-functional teams in brand development, audience acquisition, and multi-channel campaign execution. Combines entrepreneurial instinct with data-driven marketing, leveraging CRM systems and AI-enabled tools to optimize performance. Currently completing an ML/AI Analytics certificate at the University of Texas.',
  },
  planisware: {
    filename: 'Hannah_Cowan_Resume_Planisware.docx',
    summary: 'Content strategy leader with 20+ years creating, producing, and marketing content that drives audience engagement and business enablement. Founded a research and publishing company that produced an internationally recognized scientific textbook, directing editorial strategy, content production, and go-to-market execution. Experienced at building content ecosystems that serve both brand awareness and market education goals. Currently completing an ML/AI Analytics certificate to bring data intelligence to content strategy.',
  },
};

const highlights = {
  braze: [
    'Founded The Science of Tattooing, building a globally recognized brand through strategic storytelling, visual design, and multi-channel content distribution',
    'Directed brand voice, content strategy, and creative assets across platforms for a 12-person distributed team of scientists, editors, and designers',
    'Designed cross-platform marketing strategies leveraging CRM systems and AI-enabled lead filtering to drive measurable audience growth',
    'Currently developing and launching a companion app, demonstrating ability to extend brand strategy into digital product experiences',
    'Built a global professional network through ~40 international conventions and speaking engagements across four continents',
  ],
  meet_life_sciences: [
    'Founded The Science of Tattooing, leading a 12-person team of doctors, scientists, and editors to produce a licensed scientific textbook blending rigorous research with accessible design',
    'Marketed globally through scientific speaking tours, digital content, and strategic partnerships with professional and medical audiences',
    'Directed promotional strategy and brand positioning for a science-education product in a niche professional market',
    'Currently developing a companion app, extending promotional reach into interactive digital experiences',
    'Built and managed cross-functional teams across research, editorial, design, and marketing functions',
  ],
  acquire: [
    'Built and scaled multiple DTC creative businesses over two decades as owner-operator, managing LLC and S-Corp entities',
    'Designed AI-enabled lead filtering and CRM automation workflows that drove referral-based customer acquisition and growth',
    'Currently developing and launching a consumer mobile app for The Science of Tattooing, extending DTC reach into digital products',
    'Managed P&L across multiple business entities including finance, compliance, vendor relationships, and marketing budgets',
    'Cultivated a loyal global customer base through personalized experiences, content marketing, and community building across four continents',
  ],
  skybridge: [
    'Built and scaled premium creative businesses serving high-value clientele, delivering personalized luxury experiences rooted in craftsmanship',
    'Directed all brand positioning, marketing strategy, and client relationship management, driving referral-based revenue growth',
    'Led teams of up to 14 professionals, overseeing talent development, quality standards, and service delivery',
    'Founded The Science of Tattooing, demonstrating ability to build aspirational brands that command premium positioning in niche markets',
    'Developed a global professional network through ~40 international conventions, building partnerships across four continents',
  ],
  unison: [
    'Founded The Science of Tattooing, building a globally recognized brand from concept through textbook publication, app development, and international speaking tours',
    'Directed brand voice, content strategy, and creative teams across digital and physical channels for a 12-person distributed organization',
    'Designed and executed cross-platform marketing strategies leveraging CRM systems and AI-enabled lead filtering to drive referral-based growth',
    'Managed full P&L across multiple business entities including finance, compliance, real estate, and marketing budgets',
    'Currently completing ML/AI Analytics certificate at University of Texas, combining marketing leadership with data science capabilities',
  ],
  planisware: [
    'Founded The Science of Tattooing, directing end-to-end content strategy from editorial planning through global distribution of a licensed scientific textbook',
    'Built content ecosystems spanning print publication, digital content, international speaking tours, and an upcoming mobile app',
    'Led a 12-person global team of subject matter experts, editors, and designers to produce market-enabling educational content',
    'Directed go-to-market content strategy that cultivated a loyal professional audience across four continents',
    'Designed narrative-driven content campaigns combining editorial storytelling with CRM and AI-powered audience targeting',
  ],
};

function generateResume(configKey) {
  const config = configs[configKey];
  const roleHighlights = highlights[configKey];

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
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: 'HANNAH COWAN', bold: true, size: 36, font: 'Arial', color: '1a1a1a' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Walnut Creek, CA  |  505-577-3197  |  Tsotdirector@gmail.com  |  TattoosByHannah.com', size: 18, color: '666666' })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '2E75B6', space: 1 } },
          children: [],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 24, color: '2E75B6' })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: config.summary, size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'KEY HIGHLIGHTS', bold: true, size: 24, color: '2E75B6' })],
        }),
        ...roleHighlights.map(h => new Paragraph({
          spacing: { after: 80 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: h, size: 21 })],
        })),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true, size: 24, color: '2E75B6' })],
        }),
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
        ...[
          'Founded and led an educational publishing company, directing a 12-person global team of doctors, scientists, editors, and visual artists',
          'Published an internationally recognized licensed scientific textbook that redefined industry education through strategic storytelling and design',
          'Currently developing and launching a companion mobile app, extending the brand into interactive digital publishing',
          'Marketed globally through speaking tours, digital content, and strategic partnerships, cultivating a loyal professional audience across four continents',
          'Directed brand voice, content strategy, and all creative assets to maintain consistency across platforms',
        ].map(t => new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: t, size: 21 })],
        })),
        new Paragraph({ spacing: { after: 120 }, children: [] }),
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
        ...[
          'Built and scaled multiple creative businesses as owner-operator, managing LLC and S-Corp entities across varied studio locations',
          'Led teams of up to 14 independent contractors, overseeing talent development, vendor relationships, scheduling, and performance standards',
          'Directed all business operations including finance, accounting, compliance, permitting, lease negotiation, and construction management',
          'Designed cross-platform, narrative-driven marketing strategies leveraging CRM systems and AI-enabled lead filtering for referral-based growth',
          'Developed a global professional network through ~40 international conventions across four continents',
        ].map(t => new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: t, size: 21 })],
        })),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'EDUCATION & CERTIFICATIONS', bold: true, size: 24, color: '2E75B6' })],
        }),
        new Paragraph({
          spacing: { after: 60 },
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
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'SKILLS & EXPERTISE', bold: true, size: 24, color: '2E75B6' })],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: 'Brand Strategy & Identity  |  Content Strategy & Editorial Direction  |  Creative Team Leadership  |  Storytelling & Narrative Design  |  AI/ML Analytics  |  CRM & Marketing Automation  |  Cross-Platform Marketing  |  P&L Management  |  Project Management  |  Publishing & Production  |  Public Speaking  |  International Business Development', size: 21 })],
        }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'PUBLICATIONS & RECOGNITION', bold: true, size: 24, color: '2E75B6' })],
        }),
        ...[
          'The Science of Tattooing \u2014 Licensed scientific textbook (2019)',
          'Featured in Scene 360 (2022), Tattoodo (2021), Inkedmag (2019), Mammoth Book of Tattoos (2014)',
          'Multiple industry awards for creative work (2010\u20132023)',
        ].map(t => new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: t, size: 21 })],
        })),
      ],
    }],
  });

  return Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(`/Users/hannahwolf/help me code/resumes/${config.filename}`, buffer);
    console.log(`Created: ${config.filename}`);
  });
}

async function main() {
  for (const key of Object.keys(configs)) {
    await generateResume(key);
  }
}

main().catch(console.error);
