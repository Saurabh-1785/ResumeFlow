function Preview({ general, education, experience, projects, skills, setStep }) {
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
        <p><strong>Institution:</strong> {education.institution}</p>
        <p><strong>Study:</strong> {education.study}</p>
        <p><strong>From:</strong> {education.datestart}</p>
        <p><strong>To:</strong> {education.dateend}</p>
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
            <p><strong>Tech:</strong> {proj.technology}</p>
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
          onClick={() => alert("Form Completed")}
          className="text-white bg-green-600 font-bold px-10 py-2 rounded-3xl border border-solid text-xl cursor-pointer transition-all ease-in duration-300 mt-5 mb-5 hover:bg-white hover:text-green-600"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default Preview;
