// utils/generateLatex.js

function escapeLatex(str = "") {
  return str
    .replace(/&/g, "\\&").replace(/%/g, "\\%").replace(/\$/g, "\\$")
    .replace(/#/g, "\\#").replace(/_/g, "\\_").replace(/{/g, "\\{")
    .replace(/}/g, "\\}").replace(/\^/g, "\\^{}").replace(/~/g, "\\~{}")
    .trim();
}

export function generateLatex(data, templateId = 'standard') {
  const {
    generalInfo = {}, education = [], experience = [], projects = [], skills = {}, customSections = [], sectionOrder = []
  } = data;

  const validProjects = projects.filter(p => p.name && p.name.trim() !== "");
  const validExperience = experience.filter(e => e.company && e.company.trim() !== "");
  const validEducation = education.filter(ed => ed.school && ed.school.trim() !== "");
  const validCustomSections = customSections.filter(sec => sec.title && sec.title.trim() !== "" && sec.content.length > 0);

  // --- PREAMBLE CONFIGURATION ---
  let preamble = `
\\documentclass[letterpaper,10pt]{article}
\\usepackage{fontawesome5}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage{tabularx}
\\usepackage{etoolbox}
\\usepackage{changepage}
\\usepackage{graphicx}
\\usepackage[english]{babel}
\\usepackage{xstring}
\\input{glyphtounicode}
\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\urlstyle{same}
`;

  // Template-specific packages and settings
  if (templateId === 'elegant') {
    preamble += `
\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}
\\usepackage[usenames,dvipsnames]{xcolor}
\\usepackage[explicit]{titlesec}
\\usepackage{enumitem}
\\usepackage{charter} % Serif font
\\definecolor{lightgray}{gray}{0.9}

% Section Formatting: Centered with gray background bar
\\titleformat{\\section}
  {\\large\\bfseries\\centering}
  {}
  {0em}
  {\\colorbox{lightgray}{\\parbox{\\dimexpr\\textwidth-2\\fboxsep\\relax}{\\centering #1}}}

\\titlespacing{\\section}{0pt}{12pt}{8pt}
\\setlist[itemize]{topsep=2pt, itemsep=4pt, leftmargin=0.2in}
`;
  } else if (templateId === 'modern') {
    preamble += `
\\usepackage[margin=0.5in]{geometry} % Tighter margins
\\usepackage{titlesec}
\\usepackage{enumitem}
\\usepackage{helvet} % Sans-serif
\\renewcommand{\\familydefault}{\\sfdefault}

% Section Formatting: Bold, Uppercase, with line below
\\titleformat{\\section}
  {\\large\\bfseries\\uppercase}
  {}
  {0em}
  {}[\\titlerule]

\\titlespacing{\\section}{0pt}{10pt}{5pt}
\\setlist[itemize]{leftmargin=*, topsep=2pt, itemsep=2pt}
`;
  } else {
    // Standard (Default)
    preamble += `
\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}

\\titlespacing{\\section}{0pt}{*2}{10pt}
\\titleformat{\\section}{\\scshape\\large}{}{0em}{}[\\titlerule]
\\setlist[itemize]{topsep=3pt, itemsep=5pt, partopsep=0pt, parsep=0pt}
`;
  }

  // Common Commands
  preamble += `
\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeSubheading}[4]{
  \\item\\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
    \\textbf{#1} & #2
    \\ifstrempty{#3#4}{}{ \\\\ \\textit{\\small#3} & \\textit{\\small#4}}
  \\end{tabular*}}
\\newcommand{\\resumeProjectHeading}[2]{\\item\\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}{#1} & #2 \\\\ \\end{tabular*}}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}}
\\begin{document}
`;

  let latex = preamble;

  // ---------- HEADING ----------
  // We can customize the header based on templateId if needed, but centering is generally safe for all.
  // The user mentioned Modern could be Left aligned, but centering is also acceptable and easier to maintain consistency.
  // Let's stick to the existing centered header for now, maybe tweaking font styles via the preamble.

  latex += `\\begin{center}
    \\textbf{\\Huge ${templateId === 'standard' ? '\\scshape ' : ''}${escapeLatex(generalInfo.name || "")}} \\\\ \\vspace{3pt}
    ${generalInfo.phone ? `\\small\\href{tel:+91${generalInfo.phone}}{\\raisebox{-0.2\\height}{\\rotatebox[origin=c]{270}\\faPhone}\\ \\underline{+91-${escapeLatex(generalInfo.phone)}}}` : ""}
    ${generalInfo.email ? ` $|$ \\href{mailto:${generalInfo.email}}{\\faEnvelope\\ \\underline{${escapeLatex(generalInfo.email)}}}` : ""}
    ${generalInfo.github ? ` $|$ \\href{https://github.com/${generalInfo.github}}{\\faGithub\\ \\underline{GitHub}}` : ""}
    ${generalInfo.linkedin ? ` $|$ \\href{${generalInfo.linkedin}}{\\faLinkedin\\ \\underline{LinkedIn}}` : ""}
  \\end{center}`;

  // Define section generators
  const sectionGenerators = {
    summary: () => {
      if (generalInfo.about && generalInfo.about.trim() !== "") {
        return `\\section{Summary}\\begin{adjustwidth}{0.15in}{0in}\\small{${escapeLatex(generalInfo.about)}}\\end{adjustwidth}`;
      }
      return '';
    },

    education: () => {
      if (validEducation.length > 0) {
        return `\\section{Education}\\resumeSubHeadingListStart ${validEducation.map(ed =>
          `\\resumeSubheading{${escapeLatex(ed.school || "")}}{${escapeLatex(ed.date || "")}}{${escapeLatex(ed.degree || "")}}{${escapeLatex(ed.location || "")}}`
        ).join("\n")}\\resumeSubHeadingListEnd`;
      }
      return '';
    },

    skills: () => {
      if (skills && Object.values(skills).some(s => s && s.trim() !== "")) {
        return `\\section{Skills}\\begin{itemize}[leftmargin=0.15in, label={}] ${skills.languages ? `\\item \\small \\textbf{Languages}{: ${escapeLatex(skills.languages)}}` : ""
          } ${skills.frameworks ? `\\item \\small \\textbf{Frameworks}{: ${escapeLatex(skills.frameworks)}}` : ""
          } ${skills.libraries ? `\\item \\small \\textbf{Libraries}{: ${escapeLatex(skills.libraries)}}` : ""
          } ${skills.tools ? `\\item \\small \\textbf{Developer Tools}{: ${escapeLatex(skills.tools)}}` : ""
          } ${skills.others ? `\\item \\small \\textbf{Others}{: ${escapeLatex(skills.others)}}` : ""
          }\\end{itemize}`;
      }
      return '';
    },

    projects: () => {
      if (validProjects.length > 0) {
        return `\\section{Projects}\\resumeSubHeadingListStart ${validProjects.map(p =>
          `\\resumeProjectHeading{\\textbf{${escapeLatex(p.name || "")}} ${p.link ? `\\href{${p.link}}{\\faLink}` : ""} $|$ \\emph{${escapeLatex(p.tech || "")}}}{${escapeLatex(p.date || "")}} ${p.description ? `\\resumeItemListStart ${p.description.split('\n').filter(line => line.trim() !== '').map(line =>
            `\\resumeItem{${escapeLatex(line.trim())}}`
          ).join('\n')} \\resumeItemListEnd` : ""
          }`
        ).join("\n")}\\resumeSubHeadingListEnd`;
      }
      return '';
    },

    experience: () => {
      if (validExperience.length > 0) {
        return `\\section{Experience}\\resumeSubHeadingListStart ${validExperience.map(e =>
          `\\resumeSubheading{${escapeLatex(e.company || "")}}{${escapeLatex(e.date || "")}}{${escapeLatex(e.position || "")}}{${escapeLatex(e.location || "")}} ${e.description ? `\\resumeItemListStart ${e.description.split('\n').filter(line => line.trim() !== '').map(line =>
            `\\resumeItem{${escapeLatex(line.trim())}}`
          ).join('\n')} \\resumeItemListEnd` : ""
          }`
        ).join("\n")}\\resumeSubHeadingListEnd`;
      }
      return '';
    },

    custom: () => {
      if (validCustomSections.length > 0) {
        return validCustomSections.map(section => {
          let sectionLatex = `\\section{${escapeLatex(section.title)}} \\resumeSubHeadingListStart`;

          if (Array.isArray(section.content)) {
            section.content.forEach(item => {
              if (item.type === 'subheading' && item.primary && item.primary.trim() !== '') {
                sectionLatex += `\\resumeSubheading
                  {${escapeLatex(item.primary || "")}}
                  {${escapeLatex(item.secondary || "")}}
                  {${escapeLatex(item.tertiary || "")}}
                  {}
                  ${item.quaternary ? `\\resumeItemListStart ${item.quaternary.split('\n').filter(line => line.trim() !== '').map(line =>
                  `\\resumeItem{${escapeLatex(line.trim())}}`
                ).join('\n')} \\resumeItemListEnd` : ""}`;
              } else if (item.type === 'item' && item.text && item.text.trim() !== '') {
                sectionLatex += `\\resumeItem{${escapeLatex(item.text || "")}}`;
              }
            });
          } else if (typeof section.content === 'string') {
            // Handle simple string content (from textarea)
            section.content.split('\n').filter(line => line.trim() !== '').forEach(line => {
              sectionLatex += `\\resumeItem{${escapeLatex(line.trim())}}`;
            });
          }

          sectionLatex += `\\resumeSubHeadingListEnd`;
          return sectionLatex;
        }).join('\n');
      }
      return '';
    }
  };

  // Generate sections based on sectionOrder if provided, otherwise use default order
  const defaultOrder = [
    { id: 'summary', enabled: true },
    { id: 'education', enabled: true },
    { id: 'skills', enabled: true },
    { id: 'projects', enabled: true },
    { id: 'experience', enabled: true },
    { id: 'custom', enabled: true }
  ];

  const orderToUse = sectionOrder && sectionOrder.length > 0 ? sectionOrder : defaultOrder;

  orderToUse.forEach(section => {
    if (section.enabled && sectionGenerators[section.id]) {
      const sectionContent = sectionGenerators[section.id]();
      if (sectionContent) {
        latex += sectionContent;
      }
    }
  });

  latex += `\\end{document}`;
  return latex;
}