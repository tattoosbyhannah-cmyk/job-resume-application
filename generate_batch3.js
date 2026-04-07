const { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopType, TabStopPosition, BorderStyle, PageBreak } = require('docx');
const fs = require('fs');

const today = 'April 6, 2026';

function cleanText(str) {
  const protectedItems = [];
  let cleaned = str.replace(/(https?:\/\/[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+|\d{3}[\.\-]\d{3}[\.\-]\d{4})/g, (match) => {
    protectedItems.push(match);
    return `__PROTECTED_${protectedItems.length - 1}__`;
  });
  cleaned = cleaned.replace(/\u2014/g, ', ');
  cleaned = cleaned.replace(/\u2013/g, ' to ');
  cleaned = cleaned.replace(/--/g, ', ');
  cleaned = cleaned.replace(/ - /g, ', ');
  cleaned = cleaned.replace(/__PROTECTED_(\d+)__/g, (match, idx) => protectedItems[parseInt(idx)]);
  return cleaned;
}

const roles = [
  {
    filename: 'Hannah_Cowan_Huckleberry_Labs.docx',
    company: 'Huckleberry Labs',
    role: 'Creative Director (Remote)',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am excited to apply for the Creative Director position at Huckleberry Labs. As a creative leader with over two decades of experience building brands that translate complex subject matter into compelling, trust building narratives, I am deeply aligned with Huckleberry\u2019s mission to help families unlock everyday magic.',
      'As the founder of The Science of Tattooing, I built a globally recognized brand from concept through international distribution, serving as both the strategic architect and hands on builder of every dimension of brand expression. I directed a 12 person global team to produce a licensed scientific textbook, built a digital content ecosystem, launched international speaking tours, and am currently developing a companion mobile app. This experience demonstrates exactly the combination of strategic brand ownership and hands on creative execution that this role requires.',
      'What excites me most about Huckleberry is the opportunity to shape how a trusted, science backed brand communicates with millions of families. My background in translating complex scientific concepts into emotionally resonant storytelling, combined with my experience scaling brand identity across multiple channels and my in progress ML/AI Analytics certificate, positions me to lead Huckleberry\u2019s creative evolution with both strategic vision and technical fluency. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself.',
      'I would welcome the opportunity to discuss how my creative leadership can contribute to Huckleberry\u2019s brand and growth. Thank you for your consideration.',
    ],
    summary: 'Creative director and brand architect with 20+ years building trust centered brands that translate complex subject matter into emotionally resonant storytelling. Founded a globally recognized science education company, directing all brand expression from visual identity to narrative voice across print, digital, live events, and mobile app experiences. Expert at bridging strategic business objectives with world class creative execution. Currently completing an ML/AI Analytics certificate, combining creative vision with data and technology fluency.',
    highlights: [
      'Founded The Science of Tattooing, serving as both strategic architect and hands on builder of a globally recognized brand from concept through international distribution',
      'Led a 12 person global team of scientists, editors, and designers, directing all creative output while maintaining brand consistency across every touchpoint',
      'Currently developing and launching a companion mobile app, demonstrating ability to extend brand expression into digital product experiences',
      'Built deep audience trust through science backed storytelling, translating complex research into compelling narratives for professional and consumer audiences',
      'Completing ML/AI Analytics certificate and Python certification, bringing data intelligence and technical fluency to creative leadership',
    ],
  },
  {
    filename: 'Hannah_Cowan_Superside.docx',
    company: 'Superside',
    role: 'Creative Director / Associate Creative Director',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am writing to express my strong interest in the Creative Director position at Superside. With 20+ years of experience directing creative strategy, building brands, and leading distributed teams, I bring a proven ability to deliver high quality creative work at scale for diverse audiences.',
      'As the founder of The Science of Tattooing, I directed every aspect of creative output for a globally recognized brand, from textbook design and editorial direction to digital content, international event presence, and a mobile app currently in development. I led a 12 person distributed team across multiple time zones, which closely mirrors the global, remote first creative operations at Superside.',
      'What particularly excites me about Superside is the intersection of creative excellence and generative AI. My in progress ML/AI Analytics certificate and Python programming certification give me genuine technical fluency in the AI tools that are transforming creative production. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself, and my experience partnering with global brands through international conventions and industry events has prepared me to lead creative work for enterprise clients.',
      'I look forward to discussing how my creative leadership can contribute to Superside\u2019s mission. Thank you for your consideration.',
    ],
    summary: 'Creative director with 20+ years leading distributed creative teams, building brands, and delivering high quality creative work across print, digital, and interactive channels. Founded a globally recognized publishing company, directing all creative strategy for a 12 person distributed team. Expert at scaling creative operations while maintaining brand excellence. Currently completing an ML/AI Analytics certificate, bringing AI fluency to creative leadership.',
    highlights: [
      'Founded The Science of Tattooing, directing all creative output for a globally recognized brand across print, digital, live events, and mobile app experiences',
      'Led a 12 person globally distributed team of scientists, editors, and designers across multiple time zones, maintaining creative consistency and quality at scale',
      'Built partnerships and creative collaborations with industry leaders across four continents through approximately 40 international conventions',
      'Currently developing and launching a mobile app, demonstrating ability to direct creative across emerging digital product experiences',
      'Completing ML/AI Analytics certificate and Python certification, building genuine technical fluency in generative AI and data driven creative strategy',
    ],
  },
  {
    filename: 'Hannah_Cowan_Primer.docx',
    company: 'Primer',
    role: 'Creative Director (Fully Remote)',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am excited to apply for the Creative Director position at Primer. With over two decades of experience building and managing creative studios, directing design, video, print, and experiential creative, I am well positioned to build and lead Primer\u2019s internal creative function.',
      'As the founder of The Science of Tattooing, I built an internal creative operation from scratch, directing a 12 person global team to produce a licensed scientific textbook, digital content ecosystem, international speaking presence, and a mobile app currently in development. I managed every creative channel, including design, editorial, video, web, print, and live event experiences, which directly mirrors the scope of this role.',
      'My in progress ML/AI Analytics certificate and Python programming certification reflect my commitment to integrating technology into creative workflows. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year, training the agents and engineering (or overseeing the engineering of) these tools myself. I am eager to bring this combination of studio building experience, multi channel creative direction, and hands on AI expertise to Primer\u2019s creative leadership.',
      'I would welcome the opportunity to discuss how my experience can contribute to Primer. Thank you for your consideration.',
    ],
    summary: 'Creative director and studio builder with 20+ years creating and managing multi channel creative operations from the ground up. Founded a globally recognized publishing and education company, directing all creative output across design, editorial, video, web, print, and live event experiences. Expert at building creative teams and establishing brand systems that scale. Currently completing an ML/AI Analytics certificate to bring data and technology fluency to creative leadership.',
    highlights: [
      'Built an internal creative operation from scratch at The Science of Tattooing, directing all design, editorial, video, web, print, and experiential creative output',
      'Led a 12 person global distributed team, establishing workflows, quality standards, and creative systems that maintained brand consistency at scale',
      'Directed creative for approximately 40 international conventions and live events, managing experiential and in person creative across four continents',
      'Currently developing and launching a companion mobile app, extending creative direction into interactive digital product experiences',
      'Completing ML/AI Analytics certificate and Python certification, integrating technology and data intelligence into creative strategy',
    ],
  },
  {
    filename: 'Hannah_Cowan_Enable.docx',
    company: 'Enable',
    role: 'Creative Director',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am writing to express my interest in the Creative Director position at Enable. With 20+ years of experience defining and leading visual identity and creative strategy for brands, I bring a proven track record of building brand systems that drive business results.',
      'As the founder of The Science of Tattooing, I defined and directed the complete visual identity and creative strategy for a globally recognized brand, working closely with cross functional teams to produce a licensed scientific textbook, digital content, and a mobile app currently in development. My experience leading brand and marketing creative programs aligns directly with this role\u2019s scope of working with the VP of Brand & Communications and internal marketing teams.',
      'My in progress ML/AI Analytics certificate and Python programming certification demonstrate my commitment to bringing data driven thinking to creative leadership. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself. I look forward to discussing how my brand building experience can contribute to Enable\u2019s creative direction. Thank you for your consideration.',
    ],
    summary: 'Creative director with 20+ years defining and leading visual identity and creative strategy for brands. Founded a globally recognized publishing and education company, directing all brand and marketing creative programs from concept through international distribution. Expert at building scalable brand systems and leading cross functional creative collaboration. Currently completing an ML/AI Analytics certificate to bring data intelligence to creative direction.',
    highlights: [
      'Founded The Science of Tattooing, defining and directing the complete visual identity and creative strategy for a globally recognized brand',
      'Led brand and marketing creative programs across print, digital, live events, and mobile app experiences, maintaining consistency across all channels',
      'Directed a 12 person global team of scientists, editors, and designers, partnering with cross functional stakeholders to align creative output with business goals',
      'Built scalable brand systems that supported international growth across four continents through strategic creative direction',
      'Completing ML/AI Analytics certificate and Python certification, bringing data driven thinking and technical fluency to creative leadership',
    ],
  },
  {
    filename: 'Hannah_Cowan_Alignable.docx',
    company: 'Alignable',
    role: 'Senior Director of Marketing (US Remote)',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am excited to apply for the Senior Director of Marketing position at Alignable. With 20+ years of experience building brands, leading marketing strategy, and driving growth as both an entrepreneur and creative leader, I am well positioned to own the product led sales and lifecycle revenue motion that this role requires.',
      'As the founder of The Science of Tattooing, I built and executed comprehensive marketing strategy for a globally recognized brand, driving growth through multi channel campaigns, CRM automation, AI enabled lead generation, and strategic partnerships across four continents. As owner of Old Crow Tattoo, I managed P&L across LLC and S Corp entities and built referral based growth engines using narrative driven marketing and CRM systems. This dual experience gives me deep understanding of both the marketing leadership and business operations that drive revenue.',
      'My in progress ML/AI Analytics certificate and Python programming certification reflect my commitment to data driven marketing. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself. I am eager to bring this combination of marketing leadership, growth strategy, and hands on AI expertise to Alignable\u2019s team. Thank you for your consideration.',
    ],
    summary: 'Full spectrum marketing leader with 20+ years building brands, directing growth strategy, and driving revenue through multi channel marketing operations. Founded and scaled multiple businesses, directing marketing strategy from brand positioning through CRM automation and AI enabled lead generation. Deep experience with product led growth, lifecycle marketing, and P&L management. Currently completing an ML/AI Analytics certificate to enhance data driven marketing capabilities.',
    highlights: [
      'Founded The Science of Tattooing, building a globally recognized brand through strategic marketing, content strategy, and multi channel campaigns across four continents',
      'Directed end to end marketing operations including brand strategy, CRM automation, AI enabled lead generation, and lifecycle marketing for referral based growth',
      'Managed P&L across multiple business entities (LLC and S Corp), demonstrating ability to lead marketing with full revenue accountability',
      'Built and scaled referral based growth engines through narrative driven marketing, strategic partnerships, and community cultivation',
      'Completing ML/AI Analytics certificate and Python certification, bringing data intelligence and technical fluency to marketing leadership',
    ],
  },
  {
    filename: 'Hannah_Cowan_DataCamp.docx',
    company: 'DataCamp',
    role: 'Creative Director, Marketing',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am thrilled to apply for the Creative Director, Marketing position at DataCamp. As a creative leader with 20+ years of experience building brands and directing creative strategy, and as someone currently completing an ML/AI Analytics certificate, I bring both creative expertise and genuine understanding of the data science and AI education space.',
      'As the founder of The Science of Tattooing, I built a globally recognized education brand from concept through international distribution, directing all creative and brand identity work including a licensed scientific textbook, digital content ecosystem, and a mobile app currently in development. My experience evolving and refining brand identity while bringing new energy to marketing collateral and digital assets directly mirrors what DataCamp is seeking.',
      'What makes me particularly excited about DataCamp is the alignment between my background and your mission. I am completing a 7 month ML/AI Analytics program at the University of Texas, giving me authentic understanding of how data science learners think and what resonates with them. I have also personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year, training the agents and engineering (or overseeing the engineering of) these tools myself. This combination of creative leadership, hands on AI expertise, and audience empathy positions me to lead DataCamp\u2019s creative evolution.',
      'I look forward to discussing how my creative leadership can contribute to DataCamp. Thank you for your consideration.',
    ],
    summary: 'Creative director and brand builder with 20+ years evolving brand identities and directing marketing creative for education and professional audiences. Founded a globally recognized education and publishing company, directing all brand identity, creative strategy, and marketing collateral from concept through international distribution. Currently completing an ML/AI Analytics certificate, bringing authentic understanding of data science education to creative leadership.',
    highlights: [
      'Founded The Science of Tattooing, building and evolving a globally recognized education brand identity across print, digital, live events, and mobile app experiences',
      'Directed all creative strategy and marketing collateral for a licensed scientific textbook reaching professional audiences across four continents',
      'Led a 12 person global team of scientists, editors, and designers, refining brand identity while maintaining creative excellence across all channels',
      'Currently completing ML/AI Analytics certificate at the University of Texas, bringing authentic understanding of data science and AI learner audiences',
      'Developing and launching a companion mobile app, demonstrating ability to extend brand identity into digital product experiences',
    ],
  },
  {
    filename: 'Hannah_Cowan_Cameo.docx',
    company: 'Cameo',
    role: 'Creative Director',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am excited to apply for the Creative Director position at Cameo. With 20+ years of experience leading creative teams, building brands, and directing creative strategy at the intersection of entertainment, media, and technology, I am well positioned to lead and grow Cameo\u2019s creative team.',
      'As the founder of The Science of Tattooing, I built and directed a creative team that produced a globally recognized brand spanning publishing, digital content, live events, and a mobile app currently in development. My experience managing creative talent, directing multi channel campaigns, and building brand systems that resonate with passionate audiences directly aligns with what Cameo needs in a creative leader.',
      'My deep experience in creative industries, combined with my in progress ML/AI Analytics certificate and Python programming certification, positions me to bring both creative vision and technical understanding to Cameo\u2019s creative direction. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself. I would welcome the opportunity to discuss how my leadership can contribute to Cameo\u2019s growth. Thank you for your consideration.',
    ],
    summary: 'Creative director with 20+ years building brands and leading creative teams at the intersection of entertainment, media, and technology. Founded a globally recognized publishing and education company, directing all creative output and growing a creative team that produced work reaching audiences across four continents. Expert at building brand systems that resonate with passionate, culturally engaged audiences. Currently completing an ML/AI Analytics certificate to bring technical fluency to creative leadership.',
    highlights: [
      'Founded The Science of Tattooing, building and directing a creative team that produced a globally recognized brand across publishing, digital, live events, and mobile app',
      'Led a 12 person global team of scientists, editors, and designers, mentoring creative talent and maintaining excellence across all creative output',
      'Built brand systems that resonate with passionate, culturally engaged audiences through strategic storytelling and multi channel creative campaigns',
      'Directed creative for approximately 40 international conventions and live events, building brand presence in entertainment and media contexts',
      'Completing ML/AI Analytics certificate and Python certification, bringing data driven thinking and AI fluency to creative direction',
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
        new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'Hannah Cowan', bold: true, size: 28, color: '1a1a1a' })] }),
        new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'Walnut Creek, CA  |  505.577.3197  |  Tsotdirector@gmail.com', size: 20, color: '666666' })] }),
        new Paragraph({ spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: '2E75B6', space: 1 } }, children: [] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: today, size: 22 })] }),
        new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: role.hiring, size: 22 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: role.company, size: 22 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `Dear ${role.hiring},`, size: 22 })] }),
        ...role.coverLetter.map(p => new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: cleanText(p), size: 22 })] })),
        new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: 'Sincerely,', size: 22 })] }),
        new Paragraph({ spacing: { after: 0 }, children: [new TextRun({ text: 'Hannah Cowan', bold: true, size: 22 })] }),
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 60 }, children: [new TextRun({ text: 'HANNAH COWAN', bold: true, size: 36, color: '1a1a1a' })] }),
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 40 }, children: [new TextRun({ text: 'Walnut Creek, CA  |  505.577.3197  |  Tsotdirector@gmail.com  |  TattoosByHannah.com', size: 18, color: '666666' })] }),
        new Paragraph({ spacing: { after: 200 }, border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '2E75B6', space: 1 } }, children: [] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'PROFESSIONAL SUMMARY', bold: true, size: 24, color: '2E75B6' })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: cleanText(role.summary), size: 21 })] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'KEY HIGHLIGHTS', bold: true, size: 24, color: '2E75B6' })] }),
        ...role.highlights.map(h => new Paragraph({ spacing: { after: 80 }, indent: { left: 360, hanging: 180 }, children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: cleanText(h), size: 21 })] })),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'PROFESSIONAL EXPERIENCE', bold: true, size: 24, color: '2E75B6' })] }),
        new Paragraph({ spacing: { after: 40 }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: [new TextRun({ text: 'Founder & Creative Director', bold: true, size: 22 }), new TextRun({ text: '\t2019 to Present', size: 21, color: '666666' })] }),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'The Science of Tattooing, Remote', italics: true, size: 21, color: '555555' })] }),
        ...['Founded and led an educational publishing company, directing a 12 person global team of doctors, scientists, editors, and visual artists','Published an internationally recognized licensed scientific textbook that redefined industry education through strategic storytelling and design','Currently developing and launching a companion mobile app, extending the brand into interactive digital publishing','Marketed globally through speaking tours, digital content, and strategic partnerships, cultivating a loyal professional audience across four continents','Directed brand voice, content strategy, and all creative assets to maintain consistency across platforms'].map(t => new Paragraph({ spacing: { after: 40 }, indent: { left: 360, hanging: 180 }, children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: cleanText(t), size: 21 })] })),
        new Paragraph({ spacing: { after: 120 }, children: [] }),
        new Paragraph({ spacing: { after: 40 }, tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }], children: [new TextRun({ text: 'Owner & Lead Artist', bold: true, size: 22 }), new TextRun({ text: '\t2003 to Present', size: 21, color: '666666' })] }),
        new Paragraph({ spacing: { after: 80 }, children: [new TextRun({ text: 'Old Crow Tattoo, Oakland/Berkeley, CA', italics: true, size: 21, color: '555555' })] }),
        ...['Built and scaled multiple creative businesses as owner operator, managing LLC and S Corp entities across varied studio locations','Led teams of up to 14 independent contractors, overseeing talent development, vendor relationships, scheduling, and performance standards','Directed all business operations including finance, accounting, compliance, permitting, lease negotiation, and construction management','Designed cross platform, narrative driven marketing strategies leveraging CRM systems and AI enabled lead filtering for referral based growth','Developed a global professional network through approximately 40 international conventions across four continents'].map(t => new Paragraph({ spacing: { after: 40 }, indent: { left: 360, hanging: 180 }, children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: cleanText(t), size: 21 })] })),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'EDUCATION & CERTIFICATIONS', bold: true, size: 24, color: '2E75B6' })] }),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'ML/AI Analytics Certificate', bold: true, size: 21 }), new TextRun({ text: ', University of Texas (Completing June 2026)', size: 21 })] }),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Introduction to Python Certificate', bold: true, size: 21 }), new TextRun({ text: ', Python Programming', size: 21 })] }),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Intelligent Investing', bold: true, size: 21 }), new TextRun({ text: ', Emeritas / UC Berkeley Extension (2022)', size: 21 })] }),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Bachelor of Arts, Art History', bold: true, size: 21 }), new TextRun({ text: ', University of New Mexico', size: 21 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'SKILLS & EXPERTISE', bold: true, size: 24, color: '2E75B6' })] }),
        new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: 'Brand Strategy & Identity  |  Content Strategy & Editorial Direction  |  Creative Team Leadership  |  Storytelling & Narrative Design  |  AI/ML Analytics  |  CRM & Marketing Automation  |  Cross Platform Marketing  |  P&L Management  |  Project Management  |  Publishing & Production  |  Public Speaking  |  International Business Development', size: 21 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ text: 'PUBLICATIONS & RECOGNITION', bold: true, size: 24, color: '2E75B6' })] }),
        ...['The Science of Tattooing, Licensed scientific textbook (2019)','Featured in Scene 360 (2022), Tattoodo (2021), Inkedmag (2019), Mammoth Book of Tattoos (2014)','Multiple industry awards for creative work (2010 to 2023)'].map(t => new Paragraph({ spacing: { after: 40 }, indent: { left: 360, hanging: 180 }, children: [new TextRun({ text: '\u2022 ', size: 21 }), new TextRun({ text: cleanText(t), size: 21 })] })),
      ],
    }],
  });
  return Packer.toBuffer(doc).then(buffer => {
    fs.writeFileSync(`/Users/hannahwolf/help me code/resumes/${role.filename}`, buffer);
    console.log(`Created: ${role.filename}`);
  });
}

async function main() { for (const r of roles) await generateCombinedDoc(r); }
main().catch(console.error);
