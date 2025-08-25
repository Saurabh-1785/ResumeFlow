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
  const { generalInfo, education, experience, projects, skills } = data;

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
  \\textbf{\\Huge ${escapeLatex(generalInfo.name || "")}} \\\\
  ${generalInfo.phone ? `\\small\\faPhone\\ ${escapeLatex(generalInfo.phone)}` : ""}
  ${generalInfo.email ? ` $|$ \\href{mailto:${generalInfo.email}}{\\faEnvelope\\ ${escapeLatex(generalInfo.email)}}` : ""}
  ${generalInfo.linkedin ? ` $|$ \\href{${generalInfo.linkedin}}{\\faLinkedin\\ LinkedIn}` : ""}
  ${generalInfo.github ? ` $|$ \\href{${generalInfo.github}}{\\faGithub\\ GitHub}` : ""}
\\end{center}
`;

  // ---------- SKILLS ----------
  if (skills && skills.length > 0) {
    latex += `
\\section{Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
  \\item ${skills.map(s => escapeLatex(s)).join(", ")}
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
           \\resumeItem{${escapeLatex(p.description)}}
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
           \\resumeItem{${escapeLatex(e.description)}}
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
