const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle } = require('docx');
const fs = require('fs');

const today = 'April 3, 2026';

const letters = [
  {
    filename: 'Hannah_Cowan_CoverLetter_Assort_Health.docx',
    company: 'Assort Health',
    role: 'Head of Brand and Content',
    hiring: 'Hiring Manager',
    body: [
      'I am writing to express my strong interest in the Head of Brand and Content position at Assort Health. As a founder who has built a globally recognized brand from the ground up\u2014spanning publishing, digital content, international speaking, and now app development\u2014I bring a unique combination of strategic brand thinking and hands-on content leadership that I believe aligns closely with this role.',
      'Over the past 20+ years, I have founded and led The Science of Tattooing, a research and publishing company where I direct a 12-person global team of scientists, editors, and designers. I built the brand identity, editorial voice, and content strategy from scratch, producing a licensed scientific textbook that has been recognized internationally. I am currently developing and launching a companion mobile app, extending our brand into interactive digital experiences. This work has given me deep expertise in translating complex, technical subject matter into compelling narratives that engage professional audiences\u2014a skill I am eager to bring to the health technology space.',
      'What excites me about Assort Health is the opportunity to apply my brand-building and content strategy experience to a mission-driven organization at the intersection of technology and healthcare. My background in directing cross-platform content ecosystems, managing creative teams, and leveraging AI-enabled marketing tools (complemented by my in-progress ML/AI Analytics certificate from the University of Texas and Python programming certification) positions me to make an immediate and meaningful impact on your brand and content initiatives.',
      'I would welcome the opportunity to discuss how my experience building brands that blend science, storytelling, and design can contribute to Assort Health\u2019s growth. Thank you for your consideration.',
    ],
  },
  {
    filename: 'Hannah_Cowan_CoverLetter_OpenAI.docx',
    company: 'OpenAI',
    role: 'Creative Director, Brand Identity',
    hiring: 'Hiring Team',
    body: [
      'I am excited to apply for the Creative Director, Brand Identity role at OpenAI. As someone who has built a complete brand identity from zero\u2014visual systems, editorial voice, product design, and global distribution\u2014I understand what it takes to create a cohesive brand that resonates deeply with its audience. I want to bring that experience to an organization that is shaping the future of technology.',
      'As the founder of The Science of Tattooing, I created and directed every dimension of the brand: from the visual identity and textbook design to the content strategy and international marketing presence. I led a 12-person global team of scientists, artists, and editors to produce a licensed scientific publication that redefined how an entire industry approaches education. I am now extending that brand into a mobile app, demonstrating my ability to evolve brand systems across new mediums and platforms.',
      'What makes me particularly excited about this role is the chance to bring creative vision to a technology company whose work demands both precision and humanity. I am currently completing an ML/AI Analytics certificate at the University of Texas (alongside a Python programming certification), which gives me a genuine understanding of the technology OpenAI is building\u2014not just the marketing around it. I believe this combination of creative leadership and technical literacy is exactly what a brand like OpenAI needs as it communicates its mission to the world.',
      'I would love to discuss how my experience creating category-defining brands can serve OpenAI\u2019s creative vision. Thank you for your time and consideration.',
    ],
  },
  {
    filename: 'Hannah_Cowan_CoverLetter_Scribd.docx',
    company: 'Scribd',
    role: 'Director, Brand Design',
    hiring: 'Hiring Manager',
    body: [
      'I am writing to express my interest in the Director, Brand Design position at Scribd. As a publishing entrepreneur who has directed the end-to-end brand design of an internationally recognized scientific textbook\u2014and who is now launching a digital publishing app\u2014I bring a deep understanding of how design, editorial vision, and brand strategy converge to create meaningful reader experiences.',
      'Through my work founding The Science of Tattooing, I have directed every aspect of brand design: from the textbook\u2019s visual identity and layout to the digital content ecosystem and international marketing presence. I led a 12-person distributed team and ensured brand consistency across print, digital, and live event channels. This experience has given me a strong foundation in building brand design systems that scale across platforms\u2014something I know is critical at Scribd as you continue to grow your reading ecosystem.',
      'I am particularly drawn to Scribd because of your commitment to making knowledge accessible and your innovative approach to content delivery. My background in publishing, combined with my in-progress ML/AI Analytics certificate and Python programming certification, positions me to bring both creative design leadership and data-informed decision-making to your brand team.',
      'I would welcome the chance to discuss how my publishing and brand design experience can contribute to Scribd\u2019s next chapter. Thank you for your consideration.',
    ],
  },
  {
    filename: 'Hannah_Cowan_CoverLetter_Braze.docx',
    company: 'Braze',
    role: 'Senior Director, Creative Strategy',
    hiring: 'Hiring Manager',
    body: [
      'I am excited to apply for the Senior Director, Creative Strategy role at Braze. With 20+ years of experience building brands and leading creative strategy across digital and physical channels, I bring a unique entrepreneurial perspective on how strategic storytelling drives audience engagement and business results.',
      'As the founder of The Science of Tattooing, I built a globally recognized brand from concept through international distribution, directing all creative strategy including editorial direction, visual identity, content marketing, and campaign execution. I manage a 12-person distributed team and have cultivated a loyal global audience through multi-channel storytelling, CRM-driven engagement, and AI-enabled marketing workflows. I am currently developing a mobile app, extending creative strategy into product experiences.',
      'What excites me about Braze is your focus on helping brands build meaningful customer relationships through intelligent engagement. My hands-on experience with CRM systems, marketing automation, and AI-powered tools\u2014paired with my in-progress ML/AI Analytics certificate and Python programming certification\u2014means I understand both the creative and technical dimensions of modern customer engagement strategy.',
      'I look forward to discussing how my creative strategy experience can contribute to Braze\u2019s mission. Thank you for your consideration.',
    ],
  },
  {
    filename: 'Hannah_Cowan_CoverLetter_Meet_Life_Sciences.docx',
    company: 'Meet Life Sciences',
    role: 'Senior Director Marketing Promotions',
    hiring: 'Hiring Manager',
    body: [
      'I am writing to apply for the Senior Director Marketing Promotions position at Meet Life Sciences. My background leading marketing at the intersection of science, education, and creative storytelling makes me a strong fit for this role.',
      'As the founder of The Science of Tattooing, I led a 12-person team of doctors, scientists, and editors to produce a licensed scientific textbook marketed globally through professional speaking tours, digital content, and strategic partnerships. This work required navigating the unique challenges of marketing scientific content to professional audiences\u2014balancing credibility with accessibility, and education with engagement. I directed all promotional strategy, brand positioning, and go-to-market execution.',
      'I am drawn to Meet Life Sciences because of the opportunity to apply my science-marketing expertise at greater scale. My in-progress ML/AI Analytics certificate and Python programming certification demonstrate my commitment to bringing data-driven precision to promotional strategy, and my experience building cross-functional teams ensures I can lead complex marketing initiatives effectively.',
      'I would welcome the opportunity to discuss how my experience marketing science-based content can contribute to your team. Thank you for your time.',
    ],
  },
  {
    filename: 'Hannah_Cowan_CoverLetter_Acquire.docx',
    company: 'Acquire',
    role: 'Head of Growth (DTC eCommerce)',
    hiring: 'Hiring Manager',
    body: [
      'I am excited to apply for the Head of Growth role at Acquire. With 20+ years of experience building and scaling direct-to-consumer creative businesses from zero to profitability, I bring a founder\u2019s perspective on growth\u2014one that combines customer acquisition strategy with brand storytelling and operational rigor.',
      'I have built multiple DTC businesses as an owner-operator, managing P&L, designing AI-enabled lead generation workflows, implementing CRM automation, and driving referral-based customer acquisition. I am currently developing and launching a consumer mobile app for The Science of Tattooing, extending my DTC reach into digital products. My approach to growth has always been rooted in building authentic relationships with customers through personalized experiences and community engagement.',
      'My in-progress ML/AI Analytics certificate and Python programming certification reflect my commitment to data-driven growth strategy. I understand both the creative and analytical sides of customer acquisition, and I am eager to bring that dual perspective to Acquire\u2019s eCommerce growth initiatives.',
      'I look forward to discussing how my DTC growth experience can contribute to Acquire\u2019s mission. Thank you for your consideration.',
    ],
  },
  {
    filename: 'Hannah_Cowan_CoverLetter_SkyBridge.docx',
    company: 'SkyBridge Luxury & Associates',
    role: 'Director of Sales and Marketing',
    hiring: 'Hiring Manager',
    body: [
      'I am writing to express my interest in the Director of Sales and Marketing position at SkyBridge Luxury & Associates. With 20+ years of experience building premium brands rooted in craftsmanship, storytelling, and exceptional client experiences, I understand what it takes to market luxury at the highest level.',
      'As the founder and owner of multiple creative businesses, I have served a discerning clientele that values artistry, personalization, and quality. I directed all brand positioning, marketing strategy, and client relationship management, building a business driven almost entirely by referrals and reputation. My work founding The Science of Tattooing demonstrated my ability to build aspirational brands that command premium positioning in competitive markets.',
      'I am drawn to SkyBridge because of your commitment to excellence in the luxury hospitality space. My experience building brands that connect on an emotional level through storytelling, combined with my practical expertise in sales operations, team leadership, and marketing technology (including CRM systems and an in-progress ML/AI Analytics certificate), makes me a strong fit for this role.',
      'I would welcome the chance to discuss how my luxury brand-building experience can contribute to SkyBridge\u2019s growth. Thank you for your consideration.',
    ],
  },
  {
    filename: 'Hannah_Cowan_CoverLetter_Unison.docx',
    company: 'Unison',
    role: 'Marketing Director',
    hiring: 'Hiring Manager',
    body: [
      'I am excited to apply for the Marketing Director position at Unison. With over two decades of experience building brands, directing content strategy, and driving growth across digital and physical channels, I bring a comprehensive marketing leadership perspective shaped by founding and scaling multiple ventures.',
      'As the founder of The Science of Tattooing, I built a globally recognized brand from concept through textbook publication, app development, and international speaking tours. I directed a 12-person distributed team across brand development, audience acquisition, and multi-channel campaign execution. My approach combines entrepreneurial instinct with data-driven marketing, leveraging CRM systems and AI-enabled tools to optimize performance.',
      'I am currently completing an ML/AI Analytics certificate at the University of Texas (alongside a Python programming certification), which strengthens my ability to bring analytical rigor to marketing leadership. I am drawn to Unison\u2019s innovative approach and see a strong opportunity to apply my full-spectrum marketing experience to your growth objectives.',
      'I look forward to discussing how my marketing leadership can contribute to Unison\u2019s success. Thank you for your consideration.',
    ],
  },
  {
    filename: 'Hannah_Cowan_CoverLetter_Planisware.docx',
    company: 'Planisware',
    role: 'Director of Content Strategy and Market Enablement',
    hiring: 'Hiring Manager',
    body: [
      'I am writing to express my interest in the Director of Content Strategy and Market Enablement position at Planisware. My experience founding a publishing company and directing end-to-end content strategy\u2014from editorial planning through global distribution\u2014has given me deep expertise in building content ecosystems that serve both brand awareness and market education goals.',
      'Through The Science of Tattooing, I directed the production of a licensed scientific textbook, built supporting digital content channels, launched an international speaking presence, and am now developing a companion mobile app. I led a 12-person global team of subject matter experts, editors, and designers, ensuring our content strategy aligned with audience needs across multiple markets and formats. This experience translates directly to the challenge of creating content that enables market understanding and drives adoption.',
      'I am particularly drawn to Planisware because of the opportunity to build content strategy for a sophisticated B2B product. My in-progress ML/AI Analytics certificate and Python programming certification demonstrate my ability to bridge content strategy with data and technology\u2014essential for effective market enablement.',
      'I would welcome the opportunity to discuss how my content strategy experience can support Planisware\u2019s growth. Thank you for your consideration.',
    ],
  },
];

async function generateLetter(letter) {
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
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        // Header
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Hannah Cowan', bold: true, size: 28, color: '1a1a1a' })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Walnut Creek, CA  |  505-577-3197  |  Tsotdirector@gmail.com', size: 20, color: '666666' })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '2E75B6', space: 1 } },
          children: [],
        }),
        // Date
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: today, size: 22 })],
        }),
        // Addressee
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: letter.hiring, size: 22 })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: letter.company, size: 22 })],
        }),
        // Salutation
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: `Dear ${letter.hiring},`, size: 22 })],
        }),
        // Body paragraphs
        ...letter.body.map(p => new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: p, size: 22 })],
        })),
        // Closing
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Sincerely,', size: 22 })],
        }),
        new Paragraph({
          spacing: { after: 0 },
          children: [new TextRun({ text: 'Hannah Cowan', bold: true, size: 22 })],
        }),
      ],
    }],
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(`/Users/hannahwolf/help me code/resumes/${letter.filename}`, buffer);
  console.log(`Created: ${letter.filename}`);
}

async function main() {
  for (const letter of letters) {
    await generateLetter(letter);
  }
}

main().catch(console.error);
