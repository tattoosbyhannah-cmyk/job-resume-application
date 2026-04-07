const { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopType, TabStopPosition, BorderStyle, PageBreak } = require('docx');
const fs = require('fs');

const today = 'April 3, 2026';

function noDash(str) {
  return str.replace(/\u2014/g, ', ').replace(/\u2013/g, ' to ').replace(/--/g, ', ').replace(/-/g, ' ');
}

// But preserve hyphens in specific things like phone numbers, URLs, email
function cleanText(str) {
  // First protect URLs, emails, phone numbers
  const protectedItems = [];
  let cleaned = str.replace(/(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+|\d{3}[\-\.]\d{3}[\-\.]\d{4})/g, (match) => {
    protectedItems.push(match);
    return `__PROTECTED_${protectedItems.length - 1}__`;
  });

  // Replace em dashes and en dashes
  cleaned = cleaned.replace(/\u2014/g, ', ');
  cleaned = cleaned.replace(/\u2013/g, ' to ');
  cleaned = cleaned.replace(/--/g, ', ');
  // Replace remaining standalone hyphens used as separators (space-hyphen-space)
  cleaned = cleaned.replace(/ - /g, ', ');

  // Restore protected items
  cleaned = cleaned.replace(/__PROTECTED_(\d+)__/g, (match, idx) => protectedItems[parseInt(idx)]);

  return cleaned;
}

const roles = [
  {
    filename: 'Hannah_Cowan_Assort_Health.docx',
    company: 'Assort Health',
    role: 'Head of Brand and Content',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am writing to express my strong interest in the Head of Brand and Content position at Assort Health. As a founder who has built a globally recognized brand from the ground up, spanning publishing, digital content, international speaking, and now app development, I bring a unique combination of strategic brand thinking and hands on content leadership that I believe aligns closely with this role.',
      'Over the past 20+ years, I have founded and led The Science of Tattooing, a research and publishing company where I direct a 12 person global team of scientists, editors, and designers. I built the brand identity, editorial voice, and content strategy from scratch, producing a licensed scientific textbook that has been recognized internationally. I am currently developing and launching a companion mobile app, extending our brand into interactive digital experiences. This work has given me deep expertise in translating complex, technical subject matter into compelling narratives that engage professional audiences, a skill I am eager to bring to the health technology space.',
      'What excites me about Assort Health is the opportunity to apply my brand building and content strategy experience to a mission driven organization at the intersection of technology and healthcare. My background in directing cross platform content ecosystems, managing creative teams, and leveraging AI enabled marketing tools (complemented by my in progress ML/AI Analytics certificate from the University of Texas and Python programming certification) positions me to make an immediate and meaningful impact on your brand and content initiatives. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself.',
      'I would welcome the opportunity to discuss how my experience building brands that blend science, storytelling, and design can contribute to Assort Health\u2019s growth. Thank you for your consideration.',
    ],
    summary: 'Dynamic brand and content leader with 20+ years building category defining brands from the ground up. Founded and scaled a globally recognized publishing and education company, directing brand voice, content strategy, and creative teams across digital and physical channels. Proven ability to translate complex subject matter into compelling narratives that drive audience engagement and business growth. Currently completing an ML/AI Analytics certificate to bring data driven precision to brand and content strategy.',
    highlights: [
      'Founded The Science of Tattooing, building a globally recognized brand from concept through textbook publication, app development, international speaking tours, and digital content ecosystem',
      'Directed brand voice, content strategy, and creative assets across platforms, maintaining consistency for a 12 person distributed team',
      'Built and scaled multiple businesses as owner operator, managing P&L, compliance, real estate, and marketing across LLC and S Corp entities',
      'Led teams of up to 14 professionals, overseeing talent development, performance standards, and vendor relationships',
      'Designed cross platform, narrative driven marketing strategies leveraging CRM systems and AI enabled lead filtering',
    ],
  },
  {
    filename: 'Hannah_Cowan_OpenAI.docx',
    company: 'OpenAI',
    role: 'Creative Director, Brand Identity',
    hiring: 'Hiring Team',
    coverLetter: [
      'I am excited to apply for the Creative Director, Brand Identity role at OpenAI. As someone who has built a complete brand identity from zero, including visual systems, editorial voice, product design, and global distribution, I understand what it takes to create a cohesive brand that resonates deeply with its audience. I want to bring that experience to an organization that is shaping the future of technology.',
      'As the founder of The Science of Tattooing, I created and directed every dimension of the brand: from the visual identity and textbook design to the content strategy and international marketing presence. I led a 12 person global team of scientists, artists, and editors to produce a licensed scientific publication that redefined how an entire industry approaches education. I am now extending that brand into a mobile app, demonstrating my ability to evolve brand systems across new mediums and platforms.',
      'What makes me particularly excited about this role is the chance to bring creative vision to a technology company whose work demands both precision and humanity. I am currently completing an ML/AI Analytics certificate at the University of Texas (alongside a Python programming certification), which gives me a genuine understanding of the technology OpenAI is building, not just the marketing around it. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself. I believe this combination of creative leadership and hands on technical expertise is exactly what a brand like OpenAI needs as it communicates its mission to the world.',
      'I would love to discuss how my experience creating category defining brands can serve OpenAI\u2019s creative vision. Thank you for your time and consideration.',
    ],
    summary: 'Creative director and brand architect with 20+ years translating bold ideas into globally recognized identities. Built a research and publishing brand from scratch that redefined an entire industry through strategic storytelling, visual design, and innovative content. Deep experience directing cross functional creative teams, establishing brand systems, and crafting narratives that connect technology with human experience. Currently earning an ML/AI Analytics certificate, combining creative vision with technical fluency in artificial intelligence.',
    highlights: [
      'Created and directed the complete brand identity for The Science of Tattooing, from visual systems and editorial voice to textbook design and app UX, now recognized internationally',
      'Led a 12 person global team of scientists, editors, designers, and visual artists to produce a licensed scientific textbook blending rigorous research with compelling creative design',
      'Designed and executed brand strategy across digital content, international speaking tours, and strategic partnerships, cultivating a loyal global professional audience',
      'Built and scaled multiple creative businesses over two decades, directing all brand touchpoints from marketing collateral to client experience design',
      'Pioneered AI enabled marketing workflows including CRM automation and intelligent lead filtering to drive referral based growth',
    ],
  },
  {
    filename: 'Hannah_Cowan_Scribd.docx',
    company: 'Scribd',
    role: 'Director, Brand Design',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am writing to express my interest in the Director, Brand Design position at Scribd. As a publishing entrepreneur who has directed the end to end brand design of an internationally recognized scientific textbook, and who is now launching a digital publishing app, I bring a deep understanding of how design, editorial vision, and brand strategy converge to create meaningful reader experiences.',
      'Through my work founding The Science of Tattooing, I have directed every aspect of brand design: from the textbook\u2019s visual identity and layout to the digital content ecosystem and international marketing presence. I led a 12 person distributed team and ensured brand consistency across print, digital, and live event channels. This experience has given me a strong foundation in building brand design systems that scale across platforms, something I know is critical at Scribd as you continue to grow your reading ecosystem.',
      'I am particularly drawn to Scribd because of your commitment to making knowledge accessible and your innovative approach to content delivery. My background in publishing, combined with my in progress ML/AI Analytics certificate and Python programming certification, positions me to bring both creative design leadership and data informed decision making to your brand team. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year, training the agents and engineering (or overseeing the engineering of) these tools myself.',
      'I would welcome the chance to discuss how my publishing and brand design experience can contribute to Scribd\u2019s next chapter. Thank you for your consideration.',
    ],
    summary: 'Publishing entrepreneur and brand design leader with 20+ years creating, producing, and marketing content that reaches global audiences. Founded a research and publishing company that produced an internationally recognized scientific textbook, directing every aspect of brand design from cover to digital presence. Expert at bridging editorial vision with visual identity to create cohesive, category defining brand experiences. Currently completing an ML/AI Analytics certificate to enhance data informed design and content decisions.',
    highlights: [
      'Founded The Science of Tattooing and directed end to end brand design for a licensed scientific textbook, from editorial direction and visual identity to print production and digital distribution',
      'Currently developing and launching a companion app, extending the brand into interactive digital publishing',
      'Built a global audience through strategic content marketing, international speaking engagements, and partnership cultivation across four continents',
      'Directed brand consistency across all platforms for a 12 person distributed creative team',
      'Designed narrative driven marketing strategies that combine editorial storytelling with data driven audience targeting using CRM and AI tools',
    ],
  },
  {
    filename: 'Hannah_Cowan_Braze.docx',
    company: 'Braze',
    role: 'Senior Director, Creative Strategy',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am excited to apply for the Senior Director, Creative Strategy role at Braze. With 20+ years of experience building brands and leading creative strategy across digital and physical channels, I bring a unique entrepreneurial perspective on how strategic storytelling drives audience engagement and business results.',
      'As the founder of The Science of Tattooing, I built a globally recognized brand from concept through international distribution, directing all creative strategy including editorial direction, visual identity, content marketing, and campaign execution. I manage a 12 person distributed team and have cultivated a loyal global audience through multi channel storytelling, CRM driven engagement, and AI enabled marketing workflows. I am currently developing a mobile app, extending creative strategy into product experiences.',
      'What excites me about Braze is your focus on helping brands build meaningful customer relationships through intelligent engagement. My hands on experience with CRM systems, marketing automation, and AI powered tools, paired with my in progress ML/AI Analytics certificate and Python programming certification, means I understand both the creative and technical dimensions of modern customer engagement strategy. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself.',
      'I look forward to discussing how my creative strategy experience can contribute to Braze\u2019s mission. Thank you for your consideration.',
    ],
    summary: 'Strategic creative leader with 20+ years building brands, directing campaigns, and driving audience engagement across digital and physical channels. Founded a globally recognized publishing and education brand, leading end to end creative strategy from concept through international distribution. Expert at translating complex ideas into compelling narratives that build loyal audiences and measurable business impact. Currently completing an ML/AI Analytics certificate to bring data driven intelligence to creative strategy.',
    highlights: [
      'Founded The Science of Tattooing, building a globally recognized brand through strategic storytelling, visual design, and multi channel content distribution',
      'Directed brand voice, content strategy, and creative assets across platforms for a 12 person distributed team of scientists, editors, and designers',
      'Designed cross platform marketing strategies leveraging CRM systems and AI enabled lead filtering to drive measurable audience growth',
      'Currently developing and launching a companion app, demonstrating ability to extend brand strategy into digital product experiences',
      'Built a global professional network through approximately 40 international conventions and speaking engagements across four continents',
    ],
  },
  {
    filename: 'Hannah_Cowan_Meet_Life_Sciences.docx',
    company: 'Meet Life Sciences',
    role: 'Senior Director Marketing Promotions',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am writing to apply for the Senior Director Marketing Promotions position at Meet Life Sciences. My background leading marketing at the intersection of science, education, and creative storytelling makes me a strong fit for this role.',
      'As the founder of The Science of Tattooing, I led a 12 person team of doctors, scientists, and editors to produce a licensed scientific textbook marketed globally through professional speaking tours, digital content, and strategic partnerships. This work required navigating the unique challenges of marketing scientific content to professional audiences, balancing credibility with accessibility, and education with engagement. I directed all promotional strategy, brand positioning, and go to market execution.',
      'I am drawn to Meet Life Sciences because of the opportunity to apply my science marketing expertise at greater scale. My in progress ML/AI Analytics certificate and Python programming certification demonstrate my commitment to bringing data driven precision to promotional strategy. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year, training the agents and engineering (or overseeing the engineering of) these tools myself, and my experience building cross functional teams ensures I can lead complex marketing initiatives effectively.',
      'I would welcome the opportunity to discuss how my experience marketing science based content can contribute to your team. Thank you for your time.',
    ],
    summary: 'Marketing leader with 20+ years building brands at the intersection of science, education, and creative storytelling. Founded The Science of Tattooing, a research and publishing company that produced a licensed scientific textbook in collaboration with doctors and scientists, marketed globally through speaking tours and strategic partnerships. Proven ability to drive promotional strategy, build cross functional teams, and create campaigns that resonate with professional and scientific audiences. Currently completing an ML/AI Analytics certificate to enhance data driven marketing decisions.',
    highlights: [
      'Founded The Science of Tattooing, leading a 12 person team of doctors, scientists, and editors to produce a licensed scientific textbook blending rigorous research with accessible design',
      'Marketed globally through scientific speaking tours, digital content, and strategic partnerships with professional and medical audiences',
      'Directed promotional strategy and brand positioning for a science education product in a niche professional market',
      'Currently developing a companion app, extending promotional reach into interactive digital experiences',
      'Built and managed cross functional teams across research, editorial, design, and marketing functions',
    ],
  },
  {
    filename: 'Hannah_Cowan_Acquire.docx',
    company: 'Acquire',
    role: 'Head of Growth (DTC eCommerce)',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am excited to apply for the Head of Growth role at Acquire. With 20+ years of experience building and scaling direct to consumer creative businesses from zero to profitability, I bring a founder\u2019s perspective on growth, one that combines customer acquisition strategy with brand storytelling and operational rigor.',
      'I have built multiple DTC businesses as an owner operator, managing P&L, designing AI enabled lead generation workflows, implementing CRM automation, and driving referral based customer acquisition. I am currently developing and launching a consumer mobile app for The Science of Tattooing, extending my DTC reach into digital products. My approach to growth has always been rooted in building authentic relationships with customers through personalized experiences and community engagement.',
      'My in progress ML/AI Analytics certificate and Python programming certification reflect my commitment to data driven growth strategy. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself. I understand both the creative and analytical sides of customer acquisition, and I am eager to bring that dual perspective to Acquire\u2019s eCommerce growth initiatives.',
      'I look forward to discussing how my DTC growth experience can contribute to Acquire\u2019s mission. Thank you for your consideration.',
    ],
    summary: 'Growth oriented entrepreneur with 20+ years building and scaling direct to consumer creative businesses. Founded and grew multiple ventures from zero to profitability, managing P&L, marketing automation, AI enabled lead generation, and cross platform brand strategy. Deep experience in DTC customer acquisition, retention, and referral based growth models. Currently developing a consumer app and completing an ML/AI Analytics certificate to bring technical rigor to growth strategy.',
    highlights: [
      'Built and scaled multiple DTC creative businesses over two decades as owner operator, managing LLC and S Corp entities',
      'Designed AI enabled lead filtering and CRM automation workflows that drove referral based customer acquisition and growth',
      'Currently developing and launching a consumer mobile app for The Science of Tattooing, extending DTC reach into digital products',
      'Managed P&L across multiple business entities including finance, compliance, vendor relationships, and marketing budgets',
      'Cultivated a loyal global customer base through personalized experiences, content marketing, and community building across four continents',
    ],
  },
  {
    filename: 'Hannah_Cowan_SkyBridge.docx',
    company: 'SkyBridge Luxury & Associates',
    role: 'Director of Sales and Marketing',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am writing to express my interest in the Director of Sales and Marketing position at SkyBridge Luxury & Associates. With 20+ years of experience building premium brands rooted in craftsmanship, storytelling, and exceptional client experiences, I understand what it takes to market luxury at the highest level.',
      'As the founder and owner of multiple creative businesses, I have served a discerning clientele that values artistry, personalization, and quality. I directed all brand positioning, marketing strategy, and client relationship management, building a business driven almost entirely by referrals and reputation. My work founding The Science of Tattooing demonstrated my ability to build aspirational brands that command premium positioning in competitive markets.',
      'I am drawn to SkyBridge because of your commitment to excellence in the luxury hospitality space. My experience building brands that connect on an emotional level through storytelling, combined with my practical expertise in sales operations, team leadership, and marketing technology (including CRM systems and an in progress ML/AI Analytics certificate), makes me a strong fit for this role. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself.',
      'I would welcome the chance to discuss how my luxury brand building experience can contribute to SkyBridge\u2019s growth. Thank you for your consideration.',
    ],
    summary: 'Sales and marketing leader with 20+ years building premium brands rooted in craftsmanship, storytelling, and exceptional client experiences. Founded and scaled luxury creative businesses serving discerning clientele, directing all aspects of brand positioning, relationship management, and revenue growth. Expert at translating artisan quality into compelling brand narratives that drive referral based acquisition and long term loyalty. Currently completing an ML/AI Analytics certificate.',
    highlights: [
      'Built and scaled premium creative businesses serving high value clientele, delivering personalized luxury experiences rooted in craftsmanship',
      'Directed all brand positioning, marketing strategy, and client relationship management, driving referral based revenue growth',
      'Led teams of up to 14 professionals, overseeing talent development, quality standards, and service delivery',
      'Founded The Science of Tattooing, demonstrating ability to build aspirational brands that command premium positioning in niche markets',
      'Developed a global professional network through approximately 40 international conventions, building partnerships across four continents',
    ],
  },
  {
    filename: 'Hannah_Cowan_Unison.docx',
    company: 'Unison',
    role: 'Marketing Director',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am excited to apply for the Marketing Director position at Unison. With over two decades of experience building brands, directing content strategy, and driving growth across digital and physical channels, I bring a comprehensive marketing leadership perspective shaped by founding and scaling multiple ventures.',
      'As the founder of The Science of Tattooing, I built a globally recognized brand from concept through textbook publication, app development, and international speaking tours. I directed a 12 person distributed team across brand development, audience acquisition, and multi channel campaign execution. My approach combines entrepreneurial instinct with data driven marketing, leveraging CRM systems and AI enabled tools to optimize performance.',
      'I am currently completing an ML/AI Analytics certificate at the University of Texas (alongside a Python programming certification), which strengthens my ability to bring analytical rigor to marketing leadership. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself. I am drawn to Unison\u2019s innovative approach and see a strong opportunity to apply my full spectrum marketing experience and hands on AI expertise to your growth objectives.',
      'I look forward to discussing how my marketing leadership can contribute to Unison\u2019s success. Thank you for your consideration.',
    ],
    summary: 'Full spectrum marketing director with 20+ years building brands, directing content strategy, and driving growth across digital and physical channels. Founded and scaled a globally recognized publishing company, leading cross functional teams in brand development, audience acquisition, and multi channel campaign execution. Combines entrepreneurial instinct with data driven marketing, leveraging CRM systems and AI enabled tools to optimize performance. Currently completing an ML/AI Analytics certificate at the University of Texas.',
    highlights: [
      'Founded The Science of Tattooing, building a globally recognized brand from concept through textbook publication, app development, and international speaking tours',
      'Directed brand voice, content strategy, and creative teams across digital and physical channels for a 12 person distributed organization',
      'Designed and executed cross platform marketing strategies leveraging CRM systems and AI enabled lead filtering to drive referral based growth',
      'Managed full P&L across multiple business entities including finance, compliance, real estate, and marketing budgets',
      'Currently completing ML/AI Analytics certificate at University of Texas, combining marketing leadership with data science capabilities',
    ],
  },
  {
    filename: 'Hannah_Cowan_Planisware.docx',
    company: 'Planisware',
    role: 'Director of Content Strategy and Market Enablement',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am writing to express my interest in the Director of Content Strategy and Market Enablement position at Planisware. My experience founding a publishing company and directing end to end content strategy, from editorial planning through global distribution, has given me deep expertise in building content ecosystems that serve both brand awareness and market education goals.',
      'Through The Science of Tattooing, I directed the production of a licensed scientific textbook, built supporting digital content channels, launched an international speaking presence, and am now developing a companion mobile app. I led a 12 person global team of subject matter experts, editors, and designers, ensuring our content strategy aligned with audience needs across multiple markets and formats. This experience translates directly to the challenge of creating content that enables market understanding and drives adoption.',
      'I am particularly drawn to Planisware because of the opportunity to build content strategy for a sophisticated B2B product. My in progress ML/AI Analytics certificate and Python programming certification demonstrate my ability to bridge content strategy with data and technology. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself, ensuring I bring both strategic vision and hands on technology leadership to market enablement.',
      'I would welcome the opportunity to discuss how my content strategy experience can support Planisware\u2019s growth. Thank you for your consideration.',
    ],
    summary: 'Content strategy leader with 20+ years creating, producing, and marketing content that drives audience engagement and business enablement. Founded a research and publishing company that produced an internationally recognized scientific textbook, directing editorial strategy, content production, and go to market execution. Experienced at building content ecosystems that serve both brand awareness and market education goals. Currently completing an ML/AI Analytics certificate to bring data intelligence to content strategy.',
    highlights: [
      'Founded The Science of Tattooing, directing end to end content strategy from editorial planning through global distribution of a licensed scientific textbook',
      'Built content ecosystems spanning print publication, digital content, international speaking tours, and an upcoming mobile app',
      'Led a 12 person global team of subject matter experts, editors, and designers to produce market enabling educational content',
      'Directed go to market content strategy that cultivated a loyal professional audience across four continents',
      'Designed narrative driven content campaigns combining editorial storytelling with CRM and AI powered audience targeting',
    ],
  },
];

function generateCombinedDoc(role) {
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
        // === COVER LETTER (Page 1) ===
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Hannah Cowan', bold: true, size: 28, color: '1a1a1a' })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Walnut Creek, CA  |  505.577.3197  |  Tsotdirector@gmail.com', size: 20, color: '666666' })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '2E75B6', space: 1 } },
          children: [],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: today, size: 22 })],
        }),
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: role.hiring, size: 22 })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: role.company, size: 22 })],
        }),
        new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: `Dear ${role.hiring},`, size: 22 })],
        }),
        ...role.coverLetter.map(p => new Paragraph({
          spacing: { after: 200 },
          children: [new TextRun({ text: cleanText(p), size: 22 })],
        })),
        new Paragraph({
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Sincerely,', size: 22 })],
        }),
        new Paragraph({
          spacing: { after: 0 },
          children: [new TextRun({ text: 'Hannah Cowan', bold: true, size: 22 })],
        }),

        // === PAGE BREAK ===
        new Paragraph({ children: [new PageBreak()] }),

        // === RESUME (Page 2+) ===
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 60 },
          children: [new TextRun({ text: 'HANNAH COWAN', bold: true, size: 36, font: 'Arial', color: '1a1a1a' })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 40 },
          children: [new TextRun({ text: 'Walnut Creek, CA  |  505.577.3197  |  Tsotdirector@gmail.com  |  TattoosByHannah.com', size: 18, color: '666666' })],
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
          children: [new TextRun({ text: cleanText(role.summary), size: 21 })],
        }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'KEY HIGHLIGHTS', bold: true, size: 24, color: '2E75B6' })],
        }),
        ...role.highlights.map(h => new Paragraph({
          spacing: { after: 80 },
          indent: { left: 360, hanging: 180 },
          children: [
            new TextRun({ text: '\u2022 ', size: 21 }),
            new TextRun({ text: cleanText(h), size: 21 }),
          ],
        })),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true, size: 24, color: '2E75B6' })],
        }),
        // Role 1
        new Paragraph({
          spacing: { after: 40 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: 'Founder & Creative Director', bold: true, size: 22 }),
            new TextRun({ text: '\t2019 to Present', size: 21, color: '666666' }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: 'The Science of Tattooing, Remote', italics: true, size: 21, color: '555555' })],
        }),
        ...[
          'Founded and led an educational publishing company, directing a 12 person global team of doctors, scientists, editors, and visual artists',
          'Published an internationally recognized licensed scientific textbook that redefined industry education through strategic storytelling and design',
          'Currently developing and launching a companion mobile app, extending the brand into interactive digital publishing',
          'Marketed globally through speaking tours, digital content, and strategic partnerships, cultivating a loyal professional audience across four continents',
          'Directed brand voice, content strategy, and all creative assets to maintain consistency across platforms',
        ].map(t => new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: cleanText(t), size: 21 })],
        })),
        new Paragraph({ spacing: { after: 120 }, children: [] }),
        // Role 2
        new Paragraph({
          spacing: { after: 40 },
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: [
            new TextRun({ text: 'Owner & Lead Artist', bold: true, size: 22 }),
            new TextRun({ text: '\t2003 to Present', size: 21, color: '666666' }),
          ],
        }),
        new Paragraph({
          spacing: { after: 80 },
          children: [new TextRun({ text: 'Old Crow Tattoo, Oakland/Berkeley, CA', italics: true, size: 21, color: '555555' })],
        }),
        ...[
          'Built and scaled multiple creative businesses as owner operator, managing LLC and S Corp entities across varied studio locations',
          'Led teams of up to 14 independent contractors, overseeing talent development, vendor relationships, scheduling, and performance standards',
          'Directed all business operations including finance, accounting, compliance, permitting, lease negotiation, and construction management',
          'Designed cross platform, narrative driven marketing strategies leveraging CRM systems and AI enabled lead filtering for referral based growth',
          'Developed a global professional network through approximately 40 international conventions across four continents',
        ].map(t => new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: cleanText(t), size: 21 })],
        })),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        // Education
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'EDUCATION & CERTIFICATIONS', bold: true, size: 24, color: '2E75B6' })],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'ML/AI Analytics Certificate', bold: true, size: 21 }),
            new TextRun({ text: ', University of Texas (Completing June 2026)', size: 21 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Introduction to Python Certificate', bold: true, size: 21 }),
            new TextRun({ text: ', Python Programming', size: 21 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Intelligent Investing', bold: true, size: 21 }),
            new TextRun({ text: ', Emeritas / UC Berkeley Extension (2022)', size: 21 }),
          ],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [
            new TextRun({ text: 'Bachelor of Arts, Art History', bold: true, size: 21 }),
            new TextRun({ text: ', University of New Mexico', size: 21 }),
          ],
        }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        // Skills
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'SKILLS & EXPERTISE', bold: true, size: 24, color: '2E75B6' })],
        }),
        new Paragraph({
          spacing: { after: 60 },
          children: [new TextRun({ text: 'Brand Strategy & Identity  |  Content Strategy & Editorial Direction  |  Creative Team Leadership  |  Storytelling & Narrative Design  |  AI/ML Analytics  |  CRM & Marketing Automation  |  Cross Platform Marketing  |  P&L Management  |  Project Management  |  Publishing & Production  |  Public Speaking  |  International Business Development', size: 21 })],
        }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        // Publications
        new Paragraph({
          spacing: { after: 100 },
          children: [new TextRun({ text: 'PUBLICATIONS & RECOGNITION', bold: true, size: 24, color: '2E75B6' })],
        }),
        ...[
          'The Science of Tattooing, Licensed scientific textbook (2019)',
          'Featured in Scene 360 (2022), Tattoodo (2021), Inkedmag (2019), Mammoth Book of Tattoos (2014)',
          'Multiple industry awards for creative work (2010 to 2023)',
        ].map(t => new Paragraph({
          spacing: { after: 40 },
          indent: { left: 360, hanging: 180 },
          children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: cleanText(t), size: 21 })],
        })),
      ],
    }],
  });

  return Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(`/Users/hannahwolf/help me code/resumes/${role.filename}`, buffer);
    console.log(`Created: ${role.filename}`);
  });
}

async function main() {
  for (const role of roles) {
    await generateCombinedDoc(role);
  }
}

main().catch(console.error);
