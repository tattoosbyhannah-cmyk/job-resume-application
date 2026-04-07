const { Document, Packer, Paragraph, TextRun, AlignmentType, TabStopType, TabStopPosition, BorderStyle, PageBreak } = require('docx');
const fs = require('fs');

const today = 'April 3, 2026';

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
    filename: 'Hannah_Cowan_XPRIZE.docx',
    company: 'XPRIZE Foundation',
    role: 'VP, Content and Creative',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am thrilled to apply for the VP, Content and Creative position at XPRIZE Foundation. With over two decades of experience building brands, directing content strategy, and leading creative teams, I am deeply aligned with XPRIZE\u2019s mission to solve humanity\u2019s greatest challenges through innovation.',
      'As the founder of The Science of Tattooing, I built a globally recognized brand from concept through international distribution, directing every dimension of content and creative strategy. I led a 12 person global team of scientists, editors, and designers to produce a licensed scientific textbook, launched international speaking tours, built a digital content ecosystem, and am now developing a companion mobile app. This work demonstrates my ability to build and scale content operations that educate, inspire, and engage global audiences.',
      'What excites me most about XPRIZE is the opportunity to direct content and creative strategy for an organization that sits at the intersection of science, technology, and storytelling. My background in translating complex scientific concepts into compelling narratives, combined with my in progress ML/AI Analytics certificate and Python programming certification, positions me to bring both creative vision and technical fluency to your content leadership. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself.',
      'I would be honored to discuss how my experience can contribute to XPRIZE\u2019s mission. Thank you for your consideration.',
    ],
    summary: 'Visionary content and creative leader with 20+ years building brands, directing editorial strategy, and producing content that educates and inspires global audiences. Founded a research and publishing company that produced an internationally recognized scientific textbook, directing end to end content and creative operations. Expert at translating complex scientific and technical concepts into compelling narratives. Currently completing an ML/AI Analytics certificate to bring data intelligence to content strategy.',
    highlights: [
      'Founded The Science of Tattooing, building a globally recognized content brand from concept through textbook publication, app development, and international speaking tours',
      'Led a 12 person global team of scientists, editors, and designers to produce educational content that redefined an industry',
      'Directed end to end content strategy spanning print, digital, live events, and interactive app experiences',
      'Built a loyal global professional audience through strategic storytelling, multi channel distribution, and partnership cultivation across four continents',
      'Currently completing ML/AI Analytics certificate and Python programming certification, combining creative leadership with technical fluency',
    ],
  },
  {
    filename: 'Hannah_Cowan_egnite_Health.docx',
    company: 'egnite Health',
    role: 'Head of Marketing',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am writing to express my strong interest in the Head of Marketing position at egnite Health. With 20+ years of experience building brands, directing marketing strategy, and leading teams at the intersection of science, education, and technology, I am well positioned to drive marketing leadership for a health technology company.',
      'As the founder of The Science of Tattooing, I built a globally recognized brand that bridges science and creative storytelling. I directed a 12 person team to produce a licensed scientific textbook in collaboration with doctors and researchers, and marketed it globally through speaking tours, digital content, and strategic partnerships. I am currently developing a companion app, demonstrating my ability to extend marketing strategy across digital product experiences.',
      'I am particularly drawn to egnite Health because of the opportunity to apply my science marketing expertise to healthcare innovation. My in progress ML/AI Analytics certificate and Python programming certification reflect my commitment to data driven marketing, and through implementing AI tools and automations across my own businesses I have personally saved tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself, ensuring I can lead comprehensive marketing operations with both strategic vision and hands on technology leadership.',
      'I look forward to discussing how my marketing leadership experience can contribute to egnite Health\u2019s growth. Thank you for your consideration.',
    ],
    summary: 'Full spectrum marketing leader with 20+ years building brands at the intersection of science, education, and technology. Founded The Science of Tattooing, directing a 12 person team to produce a licensed scientific textbook marketed globally through multi channel campaigns. Expert at translating complex health and science topics into engaging brand narratives. Currently completing an ML/AI Analytics certificate to enhance data driven marketing capabilities.',
    highlights: [
      'Founded The Science of Tattooing, building a globally recognized brand through science based content, strategic partnerships, and multi channel marketing',
      'Led marketing for a licensed scientific textbook produced in collaboration with doctors and researchers, reaching professional audiences across four continents',
      'Directed end to end marketing operations including brand strategy, content marketing, CRM automation, and AI enabled lead generation',
      'Currently developing and launching a companion mobile app, extending marketing reach into digital product experiences',
      'Managed P&L across multiple business entities, demonstrating ability to lead marketing with full business accountability',
    ],
  },
  {
    filename: 'Hannah_Cowan_Nebius.docx',
    company: 'Nebius',
    role: 'Head of Solution Marketing, Media & Entertainment',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am excited to apply for the Head of Solution Marketing, Media & Entertainment position at Nebius. With 20+ years of experience building brands and marketing at the intersection of creative industries and technology, I bring a unique perspective on how to position technology solutions for media and entertainment audiences.',
      'As the founder of The Science of Tattooing, I built and marketed a globally recognized brand across the creative and media landscape, participating in approximately 40 international conventions and cultivating partnerships with publications, artists, and industry leaders across four continents. I directed all marketing strategy, brand positioning, and content development, and am now extending the brand into a mobile app. This deep immersion in creative industries gives me an authentic understanding of how media and entertainment professionals evaluate and adopt technology solutions.',
      'My in progress ML/AI Analytics certificate and Python programming certification give me genuine technical fluency in the AI and cloud technologies that Nebius offers, allowing me to bridge the gap between technical capabilities and creative industry needs. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself.',
      'I would welcome the opportunity to discuss how my marketing expertise in creative industries can drive solution marketing for Nebius. Thank you for your consideration.',
    ],
    summary: 'Marketing leader with 20+ years of deep immersion in creative industries, building brands that bridge art, science, and technology. Founded a globally recognized publishing and education company, directing marketing strategy across international media, entertainment, and professional audiences. Expert at positioning complex technology solutions for creative professionals. Currently completing an ML/AI Analytics certificate to enhance technical marketing fluency.',
    highlights: [
      'Built and marketed a globally recognized creative brand through approximately 40 international media conventions and industry events across four continents',
      'Directed brand positioning and go to market strategy for a licensed scientific publication reaching professional creative and media audiences worldwide',
      'Founded The Science of Tattooing, demonstrating deep understanding of how creative and media professionals evaluate and adopt new tools and technologies',
      'Currently developing a mobile app, extending marketing capabilities into digital product experiences for creative industry users',
      'Completing ML/AI Analytics certificate and Python certification, building genuine technical fluency in AI and cloud technologies',
    ],
  },
  {
    filename: 'Hannah_Cowan_Flex.docx',
    company: 'Flex',
    role: 'Creative Director',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am excited to apply for the Creative Director position at Flex. As someone who has built and directed creative brands for over two decades, and who is currently completing an ML/AI Analytics certificate, I am uniquely positioned to bring creative leadership to an AI native financial technology company.',
      'As the founder of The Science of Tattooing, I created and directed the complete brand identity, from visual systems and editorial voice to digital content and product design (currently launching a mobile app). I led a 12 person global team and built a brand that is recognized internationally for blending complex subject matter with compelling, accessible design. My experience building brands for entrepreneurial audiences, people who value innovation, authenticity, and smart tools, aligns directly with Flex\u2019s mission of serving business owners.',
      'What makes me particularly excited about Flex is the intersection of AI technology and financial services for entrepreneurs. My own experience as a business owner managing LLC and S Corp entities, combined with my in progress ML/AI Analytics certificate and Python programming certification, gives me both the creative instinct and technical understanding to direct brand experiences that resonate with your target audience. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year. I train the agents and engineer (or oversee the engineering of) these tools myself.',
      'I look forward to discussing how my creative leadership can contribute to Flex\u2019s brand and growth. Thank you for your consideration.',
    ],
    summary: 'Creative director and brand builder with 20+ years creating category defining identities for entrepreneurial and professional audiences. Founded and directed the complete brand identity for a globally recognized publishing and education company, from visual systems to digital product design. Deep experience serving business owner audiences who value innovation, authenticity, and smart tools. Currently completing an ML/AI Analytics certificate, combining creative vision with technical fluency in AI.',
    highlights: [
      'Created and directed the complete brand identity for The Science of Tattooing, now recognized internationally for blending complex subject matter with compelling design',
      'Currently developing and launching a mobile app, demonstrating ability to extend creative direction into digital product experiences',
      'Led a 12 person global team of scientists, editors, and designers, directing all creative output across print, digital, and live event channels',
      'Deep understanding of business owner audiences through 20+ years as an entrepreneur managing LLC and S Corp entities across multiple ventures',
      'Completing ML/AI Analytics certificate and Python certification, building genuine technical fluency in AI technologies',
    ],
  },
  {
    filename: 'Hannah_Cowan_Tundra.docx',
    company: 'Tundra Technical Solutions',
    role: 'Creative Director',
    hiring: 'Hiring Manager',
    coverLetter: [
      'I am writing to express my interest in the Creative Director position at Tundra Technical Solutions. With 20+ years of experience directing creative strategy, building brands, and leading teams, I bring a proven ability to translate complex ideas into compelling creative work that drives business results.',
      'As the founder of The Science of Tattooing, I directed every aspect of creative output for a globally recognized brand, including a licensed scientific textbook, digital content ecosystem, international speaking presence, and a mobile app currently in development. I led a 12 person distributed team and ensured creative consistency across all channels and touchpoints. My experience demonstrates that I can build and direct creative operations at scale.',
      'My in progress ML/AI Analytics certificate and Python programming certification reflect my commitment to staying at the forefront of technology, ensuring that my creative leadership is informed by data and technical understanding. I have personally implemented AI tools, automations, and agent workflows across my own businesses that save tens of thousands of dollars per year, training the agents and engineering (or overseeing the engineering of) these tools myself. I am eager to bring this combination of creative vision and hands on AI expertise to Tundra\u2019s creative direction.',
      'I would welcome the opportunity to discuss how my creative leadership experience can contribute to Tundra Technical Solutions. Thank you for your consideration.',
    ],
    summary: 'Creative director with 20+ years building brands, directing creative teams, and producing work that drives business results. Founded a globally recognized publishing and education company, directing all creative output from textbook design to digital content and app development. Expert at leading distributed creative teams and maintaining brand consistency across channels. Currently completing an ML/AI Analytics certificate to bring data intelligence to creative direction.',
    highlights: [
      'Founded The Science of Tattooing, directing all creative output for a globally recognized brand across print, digital, live events, and mobile app experiences',
      'Led a 12 person global distributed team of scientists, editors, and designers, maintaining creative consistency across all channels',
      'Published an internationally recognized licensed scientific textbook through strategic creative direction blending rigorous content with compelling design',
      'Built and scaled multiple creative businesses over two decades, directing all brand touchpoints from marketing collateral to client experience',
      'Currently completing ML/AI Analytics certificate and Python certification, combining creative leadership with data and technology fluency',
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
