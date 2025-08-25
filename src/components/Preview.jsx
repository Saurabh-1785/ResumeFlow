import { generateLatex } from "../utils/generateLatex";

function Preview({ general, education, experience, projects, skills, setStep }) {

  const handleDownloadPDF = async () => {
    const tex = generateLatex(general, education, experience, projects, skills);

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
  };

  return (
    <div className="border border-r-20 rounded-tr-4xl rounded-bl-4xl p-10 mt-10 mb-10 w-full max-w-3xl border-yellow-600">
      <h2 className="text-[clamp(25px,3vw,60px)] text-center font-bold mb-10 p-4 text-yellow-600 italic">
        PREVIEW
      </h2>
      <hr className="mb-6 text-yellow-600"></hr>

      {/* General Info */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">General Info</h3>
        <p><strong>Name:</strong> {general.name}</p>
        <p><strong>Email:</strong> {general.email}</p>
        <p><strong>Phone:</strong> {general.phone}</p>
        {general.github && <p><strong>Github:</strong> {general.github}</p>}
        {general.linkedin && <p><strong>LinkedIn:</strong> {general.linkedin}</p>}
      </div>
      <hr className="mb-6 text-yellow-600"></hr>

      {/* Education */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Education</h3>
        {education.map((edu, i) => (
          <div key={i} className="mb-3">
            <p><strong>Institution Name:</strong> {edu.institution}</p>
            <p><strong>Place:</strong> {edu.place}</p>
            <p><strong>Study:</strong> {edu.study}</p>
            <p><strong>Grade:</strong> {edu.grade}</p>
            <p><strong>Year Start:</strong> {edu.datestart}</p>
            <p><strong>Year End:</strong> {edu.dateend}</p>
          </div>
        ))}
      </div>
      <hr className="mb-6 text-yellow-600"></hr>

      {/* Experience */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Experience</h3>
        {experience.map((exp, i) => (
          <div key={i} className="mb-3">
            <p><strong>Company:</strong> {exp.company}</p>
            <p><strong>Position:</strong> {exp.position}</p>
            <p><strong>Responsibilities:</strong> {exp.responsibilities}</p>
            <p><strong>From:</strong> {exp.from}</p>
            <p><strong>To:</strong> {exp.to}</p>
          </div>
        ))}
      </div>
      <hr className="mb-6 text-yellow-600"></hr>

      {/* Projects */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Projects</h3>
        {projects.map((proj, i) => (
          <div key={i} className="mb-3">
            <p><strong>Name:</strong> {proj.name}</p>
            <p><strong>Tech-stack used:</strong> {proj.technology}</p>
            <p><strong>Description:</strong> {proj.description}</p>
            <p><strong>URL:</strong> {proj.url}</p>
          </div>
          
        ))}
      </div>
      <hr className="mb-6 text-yellow-600"></hr>

      {/* Skills */}
      <div className="mb-6 italic overflow-auto">
        <h3 className="text-2xl mb-3 font-semibold text-yellow-600">Skills</h3>
        <p><strong>Languages:</strong> {skills.languages}</p>
        <p><strong>Frameworks:</strong> {skills.frameworks}</p>
        <p><strong>Libraries:</strong> {skills.libraries}</p>
        <p><strong>Tools:</strong> {skills.tools}</p>
        <p><strong>Others:</strong> {skills.others}</p>
      </div>
      <hr className="mb-6 text-yellow-600"></hr>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setStep(4)}
          className="text-white bg-yellow-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-yellow-600"
        >
          Go Back & Edit
        </button>

        <button
          onClick={handleDownloadPDF}
          className="text-white bg-blue-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-blue-600"
        >
          Download
        </button>
      </div>
    </div>
  );
}

export default Preview;
