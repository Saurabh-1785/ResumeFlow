// utils/generateLatex.js


function escapeLatex(str = "") {
  return str
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/\^/g, "\\^{}")
    .replace(/~/g, "\\~{}")
    .trim();
}

export function generateLatex(data) {
  const {
    generalInfo = {},
    education = [],
    experience = [],
    projects = [],
    skills = []
  } = data;

  let latex = `
\\documentclass[letterpaper,11pt]{article}
\\usepackage{fontawesome5}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{graphicx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\titleformat{\\section}{\\scshape\\large}{}{0em}{}[\\titlerule]

\\newcommand{\\resumeItem}[1]{\\item\\small{#1}}
\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{#3} & \\textit{#4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeProjectHeading}[2]{
  \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      {#1} & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}
\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}}

\\begin{document}

% ---------- HEADING ----------
\\begin{center}
  \\textbf{\\Huge \\scshape ${escapeLatex(generalInfo.name || "")}} \\\\ \\vspace{3pt}
  ${generalInfo.phone ? `\\small\\href{tel:+91${generalInfo.phone}}{\\raisebox{-0.2\\height} {\\rotatebox[origin=c]{270}\\faPhone}\\ \\underline{+91-${escapeLatex(generalInfo.phone)}}}` : ""}
  ${generalInfo.email ? ` $|$ \\href{mailto:${generalInfo.email}}{\\raisebox{-0.2\\height}\\faEnvelope\\underline {${escapeLatex(generalInfo.email)}}}` : ""}
  ${generalInfo.linkedin ? ` $|$ \\href{${generalInfo.linkedin}}{\\raisebox{-0.2\\height}\\faLinkedin\\underline{LinkedIn}}` : ""}
  ${generalInfo.github ? ` $|$ \\href{${generalInfo.github}}{\\raisebox{-0.2\\height}\\faGithub\\underline{GitHub}}` : ""}
\\end{center}
`;

// ---------- SKILLS ----------
if (skills && Object.keys(skills).length > 0) {
  latex += `
\\section{Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  ${skills.languages ? `\\item \\textbf{Languages}{: ${escapeLatex(skills.languages)}}` : ""}
  ${skills.frameworks ? `\\item \\textbf{Frameworks}{: ${escapeLatex(skills.frameworks)}}` : ""}
  ${skills.libraries ? `\\item \\textbf{Libraries}{: ${escapeLatex(skills.libraries)}}` : ""}
  ${skills.tools ? `\\item \\textbf{Developer Tools}{: ${escapeLatex(skills.tools)}}` : ""}
  ${skills.others ? `\\item \\textbf{Others}{: ${escapeLatex(skills.others)}}` : ""}
\\end{itemize}
`;
}

  // ---------- PROJECTS ----------
  if (projects && projects.length > 0) {
    latex += `
\\section{Projects}
\\resumeSubHeadingListStart
${projects.map(
  p => `
  \\resumeProjectHeading
    {\\textbf{${escapeLatex(p.name || "")}} ${
    p.link ? `\\href{${p.link}}{\\faLink}` : ""
  } $|$ \\emph{${escapeLatex(p.tech || "")}}}{${escapeLatex(p.date || "")}}
    ${
      p.description
        ? `\\resumeItemListStart
           ${p.description
            .split("\n")
            .map(line => `\\resumeItem{${escapeLatex(line.trim())}}`)
            .join("\n")}
         \\resumeItemListEnd`
        : ""
    }
`
).join("\n")}
\\resumeSubHeadingListEnd
`;
  }

  // ---------- EXPERIENCE ----------
  if (experience && experience.length > 0) {
    latex += `
\\section{Experience}
\\resumeSubHeadingListStart
${experience.map(
  e => `
  \\resumeSubheading
    {${escapeLatex(e.company || "")}}{${escapeLatex(e.date || "")}}
    {${escapeLatex(e.position || "")}}{${escapeLatex(e.location || "")}}
    ${
      e.description
        ? `\\resumeItemListStart
           ${e.description
            .split("\n")
            .map(line => `\\resumeItem{${escapeLatex(line.trim())}}`)
            .join("\n")}
         \\resumeItemListEnd`
        : ""
    }
`
).join("\n")}
\\resumeSubHeadingListEnd
`;
  }

  // ---------- EDUCATION ----------
  if (education && education.length > 0) {
    latex += `
\\section{Education}
\\resumeSubHeadingListStart
${education.map(
  ed => `
  \\resumeSubheading
    {${escapeLatex(ed.school || "")}}{${escapeLatex(ed.date || "")}}
    {${escapeLatex(ed.degree || "")}}{${escapeLatex(ed.location || "")}}
`
).join("\n")}
\\resumeSubHeadingListEnd
`;
  }

  latex += `
\\end{document}
`;

  return latex;
}
