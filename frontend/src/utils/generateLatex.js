// utils/generateLatex.js

function escapeLatex(str = "") {
  return str
    .replace(/&/g, "\\&").replace(/%/g, "\\%").replace(/\$/g, "\\$")
    .replace(/#/g, "\\#").replace(/_/g, "\\_").replace(/{/g, "\\{")
    .replace(/}/g, "\\}").replace(/\^/g, "\\^{}").replace(/~/g, "\\~{}")
    .trim();
}

export function generateLatex(data) {
  const {
    generalInfo = {}, education = [], experience = [], projects = [], skills = {}, customSections = []
  } = data;

  const validProjects = projects.filter(p => p.name && p.name.trim() !== "");
  const validExperience = experience.filter(e => e.company && e.company.trim() !== "");
  const validEducation = education.filter(ed => ed.school && ed.school.trim() !== "");
  const validCustomSections = customSections.filter(sec => sec.title && sec.title.trim() !== "" && sec.content.length > 0);

  let latex = `
\\documentclass[letterpaper,10pt]{article}
\\usepackage{fontawesome5}
\\usepackage[left=0.75in,top=0.6in,right=0.75in,bottom=0.6in]{geometry}
\\usepackage{titlesec}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\usepackage{changepage}
\\usepackage{graphicx}
\\usepackage{xstring}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}
\\titlespacing{\\section}{0pt}{*2}{10pt}
\\titleformat{\\section}{\\scshape\\large}{}{0em}{}[\\titlerule]
\\setlist[itemize]{topsep=3pt, itemsep=5pt, partopsep=0pt, parsep=0pt}

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

// ... (The rest of the file remains exactly the same) ...
// ---------- HEADING ----------
latex += `\\begin{center}
  \\textbf{\\Huge \\scshape ${escapeLatex(generalInfo.name || "")}} \\\\ \\vspace{3pt}
  ${generalInfo.phone ? `\\small\\href{tel:+91${generalInfo.phone}}{\\raisebox{-0.2\\height}{\\rotatebox[origin=c]{270}\\faPhone}\\ \\underline{+91-${escapeLatex(generalInfo.phone)}}}` : ""}
  ${generalInfo.email ? ` $|$ \\href{mailto:${generalInfo.email}}{\\faEnvelope\\ \\underline{${escapeLatex(generalInfo.email)}}}` : ""}
  ${generalInfo.linkedin ? ` $|$ \\href{${generalInfo.linkedin}}{\\faLinkedin\\ \\underline{LinkedIn}}` : ""}
  ${generalInfo.github ? ` $|$ \\href{https://github.com/${generalInfo.github}}{\\faGithub\\ \\underline{GitHub}}` : ""}
\\end{center}`;
if (generalInfo.about && generalInfo.about.trim() !== "") { latex += `\\section{Summary}\\begin{adjustwidth}{0.15in}{0in}\\small{${escapeLatex(generalInfo.about)}}\\end{adjustwidth}`; }
if (skills && Object.values(skills).some(s => s && s.trim() !== "")) { latex += `\\section{Skills}\\begin{itemize}[leftmargin=0.15in, label={}] ${skills.languages ? `\\item \\small \\textbf{Languages}{: ${escapeLatex(skills.languages)}}` : ""} ${skills.frameworks ? `\\item \\small \\textbf{Frameworks}{: ${escapeLatex(skills.frameworks)}}` : ""} ${skills.libraries ? `\\item \\small \\textbf{Libraries}{: ${escapeLatex(skills.libraries)}}` : ""} ${skills.tools ? `\\item \\small \\textbf{Developer Tools}{: ${escapeLatex(skills.tools)}}` : ""} ${skills.others ? `\\item \\small \\textbf{Others}{: ${escapeLatex(skills.others)}}` : ""}\\end{itemize}`; }
if (validProjects.length > 0) { latex += `\\section{Projects}\\resumeSubHeadingListStart ${validProjects.map(p => `\\resumeProjectHeading{\\textbf{${escapeLatex(p.name || "")}} ${p.link ? `\\href{${p.link}}{\\faLink}` : ""} $|$ \\emph{${escapeLatex(p.tech || "")}}}{${escapeLatex(p.date || "")}} ${p.description ? `\\resumeItemListStart ${p.description.split('\n').filter(line => line.trim() !== '').map(line => `\\resumeItem{${escapeLatex(line.trim())}}`).join('\n')} \\resumeItemListEnd` : ""}`).join("\n")}\\resumeSubHeadingListEnd`; }
if (validExperience.length > 0) { latex += `\\section{Experience}\\resumeSubHeadingListStart ${validExperience.map(e => `\\resumeSubheading{${escapeLatex(e.company || "")}}{${escapeLatex(e.date || "")}}{${escapeLatex(e.position || "")}}{${escapeLatex(e.location || "")}} ${e.description ? `\\resumeItemListStart ${e.description.split('\n').filter(line => line.trim() !== '').map(line => `\\resumeItem{${escapeLatex(line.trim())}}`).join('\n')} \\resumeItemListEnd` : ""}`).join("\n")}\\resumeSubHeadingListEnd`; }
if (validEducation.length > 0) { latex += `\\section{Education}\\resumeSubHeadingListStart ${validEducation.map(ed => `\\resumeSubheading{${escapeLatex(ed.school || "")}}{${escapeLatex(ed.date || "")}}{${escapeLatex(ed.degree || "")}}{${escapeLatex(ed.location || "")}}`).join("\n")}\\resumeSubHeadingListEnd`; }
if (validCustomSections.length > 0) {
  validCustomSections.forEach(section => {
    latex += `\\section{${escapeLatex(section.title)}} \\resumeSubHeadingListStart`;
    section.content.forEach(item => {
      if (item.type === 'subheading' && item.primary && item.primary.trim() !== '') {
        latex += `\\resumeSubheading
          {${escapeLatex(item.primary || "")}}
          {${escapeLatex(item.secondary || "")}}
          {${escapeLatex(item.tertiary || "")}}
          {}
          ${item.quaternary ? `\\resumeItemListStart ${item.quaternary.split('\n').filter(line => line.trim() !== '').map(line => `\\resumeItem{${escapeLatex(line.trim())}}`).join('\n')} \\resumeItemListEnd` : ""}`;
      } else if (item.type === 'item' && item.text && item.text.trim() !== '') {
        latex += `\\resumeItem{${escapeLatex(item.text || "")}}`;
      }
    });
    latex += `\\resumeSubHeadingListEnd`;
  });
}

latex += `\\end{document}`;
return latex;
}