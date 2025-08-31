import { generateLatex } from "../utils/generateLatex";

function Preview({ general, education, experience, projects, skills, customSections, setStep }) {

  const handleDownloadPDF = async () => {
    const data = {
      generalInfo: general,
      education: education.map(e => ({ school: e.institution, location: e.place, degree: `${e.study} - ${e.grade}`, date: `${e.datestart} -- ${e.dateend}` })),
      experience: experience.map(exp => ({ company: exp.company, position: exp.position, description: exp.responsibilities, date: `${exp.from} -- ${exp.to}`, location: "" })),
      projects: projects.map(p => ({ name: p.name, tech: p.technology, description: p.description, link: p.url, date: "" })),
      skills: skills,
      customSections: customSections
    };

    const tex = generateLatex(data);

    try {
      const response = await fetch("http://localhost:5000/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tex }),
      });

      if (!response.ok) {
        alert("Error generating PDF");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "resume.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
      alert("Something went wrong while generating PDF");
    }
  };

  return (
    <div className="border border-r-20 rounded-tr-4xl rounded-bl-4xl p-10 mt-10 mb-10 w-full max-w-3xl border-yellow-600">
      <h2 className="text-[clamp(25px,3vw,60px)] text-center font-bold mb-10 p-4 text-yellow-600 italic">PREVIEW</h2>
      <hr className="mb-6 text-yellow-600" />

      {/* General Info */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">General Info</h3>
        <p><strong>Name:</strong> {general.name}</p>
        <p><strong>Email:</strong> {general.email}</p>
        <p><strong>Phone:</strong> {general.phone}</p>
        {general.github && <p><strong>Github:</strong> {general.github}</p>}
        {general.linkedin && <p><strong>LinkedIn:</strong> {general.linkedin}</p>}
        <p><strong>About:</strong> {general.about}</p>
      </div>
      <hr className="mb-6 text-yellow-600" />

      {/* Education */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Education</h3>
        {education.map((edu, i) => (<div key={i} className="mb-3"><p><strong>Institution:</strong> {edu.institution}</p></div>))}
      </div>
      <hr className="mb-6 text-yellow-600" />

      {/* Experience */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Experience</h3>
        {experience.map((exp, i) => (<div key={i} className="mb-3"><p><strong>Company:</strong> {exp.company}</p></div>))}
      </div>
      <hr className="mb-6 text-yellow-600" />

      {/* Projects */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Projects</h3>
        {projects.map((proj, i) => (<div key={i} className="mb-3"><p><strong>Name:</strong> {proj.name}</p></div>))}
      </div>
      <hr className="mb-6 text-yellow-600" />

      {/* Skills */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Skills</h3>
        <p><strong>Languages:</strong> {skills.languages}</p>
      </div>

      {/* Custom Sections */}
      {customSections && customSections.length > 0 && (
        <div className="mb-6 italic overflow-auto">
          <hr className="mb-6 text-yellow-600" />
          {customSections.map(section => (
            section.title && <div key={section.id} className="mb-4">
              <h3 className="text-2xl mb-3 font-semibold text-yellow-600">{section.title}</h3>
              {section.content.map(item => (
                <div key={item.id} className="pl-4 mb-2">
                  {item.type === 'subheading' ? (
                    <div>
                      <p><strong>{item.primary}</strong></p>
                      <p className="pl-4">{item.quaternary || item.text}</p>
                    </div>
                  ) : (
                    <p>- {item.text}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button onClick={() => setStep(5)} className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600">Go Back & Edit</button>
        <button onClick={handleDownloadPDF} className="text-white bg-blue-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-blue-600">Download</button>
      </div>
    </div>
  );
}

export default Preview;